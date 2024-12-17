import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { Exercise, WorkoutPlan, WorkoutPlanExercise, WorkoutPlanForCreate } from '../../models/workout.models';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule, MatChipListbox } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms'; // Importă acest modul
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/auth.models';

@Component({
  selector: 'app-workout',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent {
  user: UserProfile | null = null;

  workoutPlanForm!: FormGroup;
  workoutPlan: WorkoutPlan | null = null;
  exercises: Exercise[] = [];

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    // Inițializarea formularului
    this.workoutPlanForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      durationWeeks: [1, [Validators.required, Validators.min(1)]],
      fitnessLevel: ['', Validators.required],
      exercises: [[]] // Array pentru exerciții selectate
    });

    // Aducerea listei de exerciții din backend
    this.loadExercises();
  }

  private loadExercises(): void {
    this.workoutService.getExercises().subscribe(
      (data: Exercise[]) => {
        this.exercises = data;
      },
      (error: Error) => {
        console.error('Error fetching exercises:', error);
      }
    );
  }

  submitForm(): void {
    if (this.workoutPlanForm.valid) {
      const newPlan: WorkoutPlanForCreate = this.workoutPlanForm.value;

      console.log('Workout Plan Submitted:', newPlan);

      this.workoutService.createWorkoutPlan(newPlan).subscribe(
        (response: WorkoutPlan) => {
          console.log('Workout Plan Created:', response);
          this.workoutPlan = response;
          this.createWorkoutPlanExercises();
        },
        (error: Error) => {
          console.error('Error creating workout plan:', error);
        }
      );
    }
  }

  createWorkoutPlanExercises(): void {
    const newPlanExercises = this.workoutPlanForm.value.exercises.map((exerciseId: number) => ({
      planId: this.workoutPlan?.planId,
      exerciseId: exerciseId
    }));

    console.log('Workout Plan Exercises Submitted:', newPlanExercises);

    this.workoutService.createWorkoutPlanExercises(newPlanExercises).subscribe(
      (response: WorkoutPlanExercise) => {
        console.log('Workout Plan ExercisesCreated:', response);
        this.workoutPlanForm.reset();
        this.router.navigate(['/dashboard']);
      },
      (error: Error) => {
        console.error('Error creating workoutplanExercises plan:', error);
      }
    );
  }

  loadUserProfile(): void {
    this.authService.currentUser$.subscribe(
      (user: UserProfile | null) => {
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
      },
      (error: Error) => console.error('Error loading user profile:', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openSubscriptionDialog(): void {
    this.router.navigate(['/subscription']);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
