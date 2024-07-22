import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AddWorkoutComponent } from './add-workout/add-workout.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';
import { SearchPipe } from './workout-list/search.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NG_CHARTS_CONFIGURATION } from 'ng2-charts';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddWorkoutComponent,
    WorkoutListComponent,
    DashboardComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [SearchPipe],
})
export class AppModule {}
