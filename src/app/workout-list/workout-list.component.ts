import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initialUserData } from './user-data';
import { SearchPipe } from './search.pipe';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SearchPipe, FormsModule],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css'
})

export class WorkoutListComponent implements OnInit {
  userData = initialUserData;
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = this.userData.length;
  totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  searchText: any = '';
  selectedWorkoutType: string = 'all';

  ngOnInit(): void {
    this.updateTotalPages();
  }

  get paginatedWorkouts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    let filteredData = this.userData;

    // Apply workout type filter
    if (this.selectedWorkoutType !== 'all') {
      filteredData = filteredData.filter(user =>
        user.workouts.some(workout => workout.type === this.selectedWorkoutType)
      );
    }

    // Update total items and total pages based on filtered data
    this.totalItems = filteredData.length;
    this.updateTotalPages();

    return filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalMinutes(workouts: any[]) {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  changeItemsPerPage() {
    this.currentPage = 1;
    if (this.itemsPerPage === -1) {
      this.totalPages = 1;
    } else {
      this.updateTotalPages();
    }
  }
  
  updateTotalPages() {
    this.totalPages = Math.ceil(this.userData.length / this.itemsPerPage);
  }
  
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilter() {
    this.currentPage = 1;
    this.updateTotalPages();
  }

  exportToExcel() {
    // Prepare the data for export
    const exportData: {
      Name: string; 
      'Workout Type': string; 
      'Number of Workouts': number; 
      'Total Workout Minutes': number; 
    }[] = this.userData.map(user => {
      return {
        Name: user.name,
        'Workout Type': user.workouts.map(workout => workout.type).join(', '),
        'Number of Workouts': user.workouts.length,
        'Total Workout Minutes': user.workouts.reduce((total, workout) => total + workout.minutes, 0)
      };
    });
  
    // Convert the export data to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = 'workout_data.xlsx';
  
    if ((window.navigator as any).msSaveBlob) {
      (window.navigator as any).msSaveBlob(data, fileName);
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
  
}
