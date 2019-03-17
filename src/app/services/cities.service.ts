import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ICity } from '../models/city.interface';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  constructor(private http: HttpClient) { }

  search(value: string) {
    return this.http
      .get<{c: ICity[]}>(`https://www.s7.ru/app/LocationService?action=get_locations&searchType=avia&str=${value}&lang=ru`)
      .pipe(
        map(data => data.c.filter(city => city.type === 'city'))
      );
  }
}
