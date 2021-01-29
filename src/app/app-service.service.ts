import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'
import { AppWeatherModel } from './app-weather.model';
import { map } from 'rxjs/operators'
import { GeoDbService } from 'wft-geodb-angular-client';
import { GetPlaceDetailsRequest } from 'wft-geodb-angular-client/lib/request/get-place-details-request.model';
import { FindPlacesRequest } from 'wft-geodb-angular-client/lib/request/find-places-request.model';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private cities : Array<any> = [];
  private allReportTypes = ['current','minutely','hourly','daily','alert']

  constructor(private httpClient: HttpClient, private geoDbService: GeoDbService) {
    this.httpClient.get<Array<any>>('assets/json/cities.json').subscribe(response => {
      this.cities = response;
    });
   }

  getCurrentWeatherData(city: string, unit?: string) {
    unit = unit ? unit : 'metric';
    var params = new HttpParams().set('q', city).set('units', unit).set('appid', environment.openWeatherAPIKey);
    return this.httpClient.get<AppWeatherModel>(`http://api.openweathermap.org/data/2.5/weather`, { params });
  }

  getDetailedWeatherData(lat: number, lon: number, unit: string, detailedReportType : 'hourly'|'daily') {
    var excludes: string = this.allReportTypes.filter(rt=> rt !== detailedReportType).join(",");
    var params = new HttpParams().set('lat', ''+lat).set('lon', ''+lon).set('units',unit).set('exclude',excludes).set('appid', environment.openWeatherAPIKey);
    return this.httpClient.get<any>(`http://api.openweathermap.org/data/2.5/onecall`, { params });
  }

  getCities(searchText: string) {
    var geoPlaceRequest : FindPlacesRequest = {limit : 10, offset: 0, namePrefix : searchText, types: ["CITY"]};
    return this.geoDbService.findPlaces(geoPlaceRequest);
  }


}
