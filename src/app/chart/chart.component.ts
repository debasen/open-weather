import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartName : string;
  @Input() data : Array<number>;
  @Input() xLabels : Array<string>;
  @Input() min : number;
  @Input() max : number;
  @Input() step : number;

  public lineChartData: ChartDataSets[];
  public lineChartLabels: Label[];
  public lineChartOptions: (ChartOptions);
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins : Array<any> = [];

  constructor() { }

  ngOnInit() {
    this.lineChartData = [
      { data: this.data, label: this.chartName },
    ];
    this.lineChartLabels = this.xLabels;
    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      // scales: {
      //   yAxes: [{
      //     display: true,
      //     ticks : {
      //       suggestedMin: this.min,
      //       suggestedMax : this.max,
      //       stepSize : this.step
      //     }
      //   }]
      // }
    };
  }

}
