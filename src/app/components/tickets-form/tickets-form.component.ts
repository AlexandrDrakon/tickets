import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { Store } from '@ngrx/store';

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
          if (typeof value === 'string') {
            return this.citiesService.search(value);
          }
          return [];
        })
      );
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
}
