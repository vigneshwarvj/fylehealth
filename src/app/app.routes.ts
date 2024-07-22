import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddWorkoutComponent } from './add-workout/add-workout.component';
import { WorkoutListComponent } from './workout-list/workout-list.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'workout',
        component: AddWorkoutComponent
    },
    {
        path: 'workoutlist',
        component: WorkoutListComponent
    },
    {
        path: 'workoutprogress',
        component: DashboardComponent
    }
];
