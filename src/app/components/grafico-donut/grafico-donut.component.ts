import { Component, OnInit, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-grafico-donut',
  templateUrl: './grafico-donut.component.html',
  styles: []
})
export class GraficoDonutComponent implements OnInit {

  @Input()  chartLabels: string[] = [];
  @Input()  chartData: number[] = [];
  @Input()  chartType: string = '';

  constructor() { }

  ngOnInit() {
  }

}
