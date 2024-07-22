import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-workout',
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddWorkoutComponent implements OnInit {
  workoutForm!: FormGroup;
  showToast: boolean = false;
  showAllFieldsRequiredError: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.workoutForm = this.fb.group({
      username: ['', {
        validators: [Validators.required],
        asyncValidators: [this.uniqueUsernameValidator()],
      }],
      workoutType: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    });
  }

  uniqueUsernameValidator() {
    return (control: FormControl) => {
      return new Promise((resolve) => {
        const userData = JSON.parse(localStorage.getItem('userData') || '[]');
        const isUsernameUnique = !userData.some((user: any) => user.name === control.value);
        resolve(isUsernameUnique ? null : { notUnique: true });
      });
    };
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const userData = JSON.parse(localStorage.getItem('userData') || '[]');
      const newWorkout = {
        type: this.workoutForm.value.workoutType,
        minutes: parseInt(this.workoutForm.value.minutes, 10)
      };

      const existingUserIndex = userData.findIndex((user: any) => user.name === this.workoutForm.value.username);

      if (existingUserIndex !== -1) {
        userData[existingUserIndex].workouts.push(newWorkout);
      } else {
        userData.push({
          id: userData.length + 1,
          name: this.workoutForm.value.username,
          workouts: [newWorkout]
        });
      }

      localStorage.setItem('userData', JSON.stringify(userData));
      this.showToast = true;
      setTimeout(() => {
      this.showToast = false;
      this.workoutForm.reset();
      this.workoutForm.markAsPristine();
      this.workoutForm.markAsUntouched();
      this.showAllFieldsRequiredError = false;
      }, 3000);
    } else {
      this.showAllFieldsRequiredError = true;
      // Mark all fields as touched to display validation messages
      Object.values(this.workoutForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.workoutForm.get(controlName)?.hasError(errorName);
  }
}
