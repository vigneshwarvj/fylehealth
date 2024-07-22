import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { initialUserData } from '../workout-list/user-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  userData = initialUserData;

  selectedUser: any;
  
  // Define the chart type
  public barChartType: ChartType = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Minutes' }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit() {
    this.selectedUser = this.userData[0]; // Default to first user
    this.updateChart();
  }

  onUserSelect(user: any) {
    this.selectedUser = user;
    this.updateChart();
  }

  updateChart() {
    this.barChartData.labels = this.selectedUser.workouts.map((w: any) => w.type);
    this.barChartData.datasets[0].data = this.selectedUser.workouts.map((w: any) => w.minutes);
    this.chart?.update();
  }
}