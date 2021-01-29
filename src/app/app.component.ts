import { Component, OnInit } from '@angular/core';
import { AppServiceService } from './app-service.service';
import { AppWeatherModel } from './app-weather.model';
import { Observable } from 'rxjs';
import { PlaceSummary } from 'wft-geodb-angular-client/lib/model/place-summary.model';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './app.icon-spin.scss']
})
export class AppComponent implements OnInit {
  title = 'open-weather';
  searchText: string = '';
  resultFound: boolean = false;
  detailedResultFound: boolean = false;
  weatherData: AppWeatherModel;
  cities: Observable<PlaceSummary[]> = new Observable();
  cityDetails: PlaceSummary;
  reportTimestamp: Date = null;
  unitSystem: 'standard' | 'metric' | 'imperial';
  unitMap: Map<string, { temperature: string, windSpeed: string }> = new Map();
  isLoading: { city: boolean, weather: boolean, detailedReport: boolean } = { city: false, weather: false, detailedReport: false };
  panelOpenState: boolean;
  detailedReportAttr: 'temp' | 'humidity' = 'temp';
  chartNameMap = { temp: 'Temperature', humidity: 'Humidity' };
  chartData: Array<number>;
  chartXLabels: Array<string>;
  day: number;
  days: Array<{ name: string, value: number, reports: Array<any> }>;

  constructor(private appService: AppServiceService) {
    this.weatherData = new AppWeatherModel();
    this.unitMap.set('standard', { temperature: 'K', windSpeed: 'meter/sec' });
    this.unitMap.set('metric', { temperature: '°C', windSpeed: 'meter/sec' });
    this.unitMap.set('imperial', { temperature: '°F', windSpeed: 'miles/hour' });
  }

  ngOnInit() {
    this.unitSystem = 'metric';
  }

  citySelected(event: MatAutocompleteSelectedEvent) {
    this.cityDetails = <PlaceSummary>event.option.value;
    if (this.cityDetails) {
      this.refreshWeatherData();
      this.refreshDetailedReport();
    }
  }

  unitChanged() {
    this.refreshWeatherData();
    this.refreshDetailedReport();
  }

  refreshWeatherData() {
    this.isLoading.weather = true;
    this.appService.getCurrentWeatherData(this.cityDetails.city, this.unitSystem).subscribe(response => {
      this.isLoading.weather = false;
      if (response && response.main) {
        this.resultFound = true;
        this.weatherData = response;
        this.reportTimestamp = new Date();
      } else {
        this.resultFound = false;
        this.weatherData = new AppWeatherModel();
      }
    }, (error) => this.isLoading.weather = false);
  }

  searchTextChanged() {
    this.cities = this.appService.getCities(this.searchText).pipe(map(response => response.data));
  }

  displayCityDropdown(city: PlaceSummary) {
    return city ? city.city : '';
  }

  detailPanelOpened() {
    this.refreshDetailedReport();
  }

  detailedReportTypeChanged() {
    this.refreshDetailedReport();
  }

  detailedReportAttrChanged() {
    this.refreshDetailedReport();
  }

  refreshDetailedReport() {
    this.panelOpenState = true;
    this.isLoading.detailedReport = true;
    this.detailedResultFound = false;
    this.appService.getDetailedWeatherData(this.cityDetails.latitude, this.cityDetails.longitude, this.unitSystem, 'hourly')
      .subscribe(response => {
        const datePipe = new DatePipe('en-US');
        this.days = [];
        var reports: any = [];
        var day = 0;
        var currentDate = new Date(response.hourly[0].dt * 1000);
        for (var i = 0; i < response.hourly.length; i++) {
          var re = response.hourly[i];
          var reportDt = new Date(re.dt * 1000);
          if (reportDt.getDate() === currentDate.getDate()) {
            reports.push(re);
          } if ((i === (response.hourly.length - 1)) || (reportDt.getDate() !== currentDate.getDate())) {
            this.days.push({ name: datePipe.transform(currentDate, 'EEEE'), value: day, reports });
            currentDate = reportDt;
            reports = [];
            reports.push(re);
            day++;
          }
        }
        console.log(this.days);
        this.day = 0;
        this.dayChanged();
        this.isLoading.detailedReport = false;
        this.detailedResultFound = true;
      });
  }

  dayChanged() {
    this.detailedResultFound = false;
    var reports = this.days[this.day].reports;
    this.chartData = reports.map((re: any) => re[this.detailedReportAttr]);
    this.chartXLabels = reports.map((r: any) => {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(new Date(r.dt * 1000), 'h:mm a')
    });
    setTimeout(() => {
      this.detailedResultFound = true;
    }, 100);
  }

}
