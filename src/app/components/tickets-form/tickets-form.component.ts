import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { Store } from '@ngrx/store';
import ymaps from 'ymaps';

import { CitiesService } from '../../services/cities.service';
import { ICity } from '../../models/city.interface';
import { ValidationService } from '../../services/validation.service';
import { ITicket } from '../../models/ticket.interface';
import { IAppState } from '../../store/state/app.state';
import { AddTicket } from '../../store/actions/ticket.actions';

@Component({
  selector: 'app-tickets-form',
  templateUrl: './tickets-form.component.html',
  styleUrls: ['./tickets-form.component.scss']
})
export class TicketsFormComponent implements OnInit {
  ticketForm: FormGroup;
  filteredCitiesFrom$: Observable<ICity[]>;
  filteredCitiesTo$: Observable<ICity[]>;
  private counter = 0;
  private ymaps;
  private mapCities;
  private API_KEY = 'b0f826bc-64e4-4213-a834-a4e6da9173d4';
  private DEFAULT_CENTER = [55.000665013597725, 82.95603900000002];
  private DEFAULT_ZOOM = 6;

  constructor(private fb: FormBuilder, private citiesService: CitiesService, private store: Store<IAppState>) { }

  ngOnInit() {
    this.ticketForm = this.fb.group({
      cityFrom: ['', [Validators.required, ValidationService.match]],
      timeFrom: ['', [Validators.required]],
      cityTo: ['', [Validators.required, ValidationService.match]],
      timeTo: ['', [Validators.required]]
    });

    this.filteredCitiesFrom$ = this.ticketForm
      .get('cityFrom')
      .valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          this.updateMapCities();
          if (typeof value === 'string') {
            return this.citiesService.search(value);
          }
          return [];
        })
      );

    this.filteredCitiesTo$ = this.ticketForm
      .get('cityTo')
      .valueChanges
      .pipe(
        debounceTime(300),
        switchMap(value => {
          this.updateMapCities();
          if (typeof value === 'string') {
            return this.citiesService.search(value);
          }
          return [];
        })
      );

    this.initMapCities();
  }

  displayCity(city: ICity) {
    if (city) {
      return city.name;
    }
  }

  onCheckTimes() {
    const {cityFrom, timeFrom, cityTo, timeTo} = this.ticketForm.value;
    const controlTimeFrom = this.ticketForm.get('timeFrom');
    const errors = controlTimeFrom.errors;
    if (cityFrom && cityFrom.timeZone && timeFrom && cityTo && cityTo.timeZone && timeTo) {
      const momentFrom = moment.tz(timeFrom, 'hh:mm', cityFrom.timeZone);
      const momentTo = moment.tz(timeTo, 'hh:mm', cityTo.timeZone);
      controlTimeFrom.setErrors(momentFrom > momentTo ? {rangeTime: true} : null);
    } else if (errors && 'rangeTime' in errors) {
      delete errors.rangeTime;
      controlTimeFrom.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  addTicket() {
    const {cityFrom, timeFrom, cityTo, timeTo} = this.ticketForm.value;
    const ticket: ITicket = {
      id: this.counter++,
      cityFrom: cityFrom.name,
      timeFrom,
      cityTo: cityTo.name,
      timeTo
    };
    this.store.dispatch(new AddTicket(ticket));
  }

  private initMapCities() {
    ymaps.load(`https://api-maps.yandex.ru/2.1/?apikey=${this.API_KEY}&lang=ru_RU`)
      .then(maps => {
        this.ymaps = maps;
        this.mapCities = new this.ymaps.Map('map-cities', {
          center: this.DEFAULT_CENTER,
          zoom: this.DEFAULT_ZOOM,
          controls: ['zoomControl']
        });
      });
  }

  private updateMapCities() {
    const {cityFrom, cityTo} = this.ticketForm.value;
    const promiseList = [];
    if (cityFrom && cityFrom.name) {
      promiseList.push(this.ymaps.geocode(cityFrom.name));
    }
    if (cityTo && cityTo.name) {
      promiseList.push(this.ymaps.geocode(cityTo.name));
    }

    if (promiseList.length) {
      Promise.all(promiseList)
        .then(resultList => {
          const myCollection = new this.ymaps.GeoObjectCollection();
          resultList.forEach(res => {
            myCollection.add(res.geoObjects.get(0));
          });

          this.mapCities.geoObjects.removeAll();
          this.mapCities.geoObjects.add(myCollection);

          if (myCollection.getLength() === 1) {
            this.mapCities.setCenter(myCollection.get(0).geometry._coordinates, this.DEFAULT_ZOOM);
          } else {
            const centerAndZoom = this.ymaps.util.bounds.getCenterAndZoom(
              myCollection.getBounds(),
              this.mapCities.container.getSize(),
              this.mapCities.options.get('projection')
            );
            this.mapCities.setCenter(
              [centerAndZoom.center[0], centerAndZoom.center[1]],
              centerAndZoom.zoom
            );
          }
        });
    } else {
      this.mapCities.geoObjects.removeAll();
      this.mapCities.setCenter(this.DEFAULT_CENTER, this.DEFAULT_ZOOM);
    }
  }
}
