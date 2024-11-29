import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { WorkoutService } from '../../services/workout.service';
import { Exercise, WorkoutPlan } from '../../models/workout.models';
import { UserProfile } from '../../models/auth.models';
import { DomSanitizer } from '@angular/platform-browser';
import { 
  trigger, 
  state, 
  style, 
  transition, 
  animate 
} from '@angular/animations';

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
import { VideoDialogComponent } from './video-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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
    MatChipListbox,
    VideoDialogComponent
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <mat-toolbar color="primary" class="dashboard-header">
        <span>Welcome, {{user?.name || 'User'}}! 🏋️‍♂️</span>
        <span class="spacer"></span>
        <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="User menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <!-- Main Content -->
      <div class="dashboard-content">
        <!-- Workout Plans Section -->
        <section class="workout-plans">
          <h2>Your Workout Plans</h2>
          <div class="plans-grid">
            <mat-card *ngFor="let plan of workoutPlans" class="plan-card" 
                      [class]="plan.fitnessLevel.toLowerCase()">
              <mat-card-header>
                <mat-card-title>{{plan.name}}</mat-card-title>
                <mat-card-subtitle>
                  {{plan.durationWeeks}} weeks • {{plan.fitnessLevel}}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="plan-details" [@expandCollapse]="expandedPlanId === plan.planId ? 'expanded' : 'collapsed'">
                  <p>{{plan.description}}</p>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" (click)="togglePlanDetails(plan)">
                  <mat-icon>{{expandedPlanId === plan.planId ? 'visibility_off' : 'visibility'}}</mat-icon>
                  {{expandedPlanId === plan.planId ? 'Hide Details' : 'View Details'}}
                </button>
                <button mat-button color="accent">
                  <mat-icon>play_circle</mat-icon>
                  Start Plan
                </button>
              </mat-card-actions>
            </mat-card>

            <!-- Add New Plan Card -->
            <mat-card class="plan-card add-plan" (click)="createNewPlan()">
              <mat-card-content class="add-content">
                <mat-icon>add_circle_outline</mat-icon>
                <span>Create New Plan</span>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <!-- Featured Exercises Section -->
        <section class="featured-exercises">
          <h2>Featured Exercises</h2>
          <div class="exercises-grid">
            <mat-card *ngFor="let exercise of exercises" class="exercise-card">
              <mat-card-header>
                <mat-card-title>{{exercise.name}}</mat-card-title>
                <mat-card-subtitle>
                  {{exercise.category}} • {{exercise.duration}} min
                </mat-card-subtitle>
              </mat-card-header>
              <div class="exercise-media" [class.no-video]="!exercise.videoUrl" 
                   (click)="exercise.videoUrl && openVideo(exercise)">
                <div *ngIf="exercise.videoUrl" class="video-thumbnail">
                  <img [src]="getYouTubeThumbnail(exercise.videoUrl)" [alt]="exercise.name">
                  <div class="play-overlay">
                    <mat-icon>play_circle_filled</mat-icon>
                  </div>
                </div>
                <div *ngIf="!exercise.videoUrl" class="no-video-content">
                  <mat-icon>fitness_center</mat-icon>
                </div>
              </div>
              <mat-card-content>
                <p>{{exercise.description}}</p>
                <mat-chip-listbox>
                  <mat-chip [class]="exercise.difficultyLevel.toLowerCase()">
                    {{exercise.difficultyLevel}}
                  </mat-chip>
                </mat-chip-listbox>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" *ngIf="exercise.videoUrl">
                  <mat-icon>play_circle</mat-icon>
                  Watch Video
                </button>
                <button mat-button color="accent">
                  <mat-icon>add</mat-icon>
                  Add to Plan
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </section>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ 
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('collapsed', style({ 
        height: '0',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('expanded <=> collapsed', animate('200ms ease-in-out'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  user: UserProfile | null = null;
  workoutPlans: WorkoutPlan[] = [];
  exercises: Exercise[] = [];
  expandedPlanId: number | null = null;

  constructor(
    private authService: AuthService,
    private workoutService: WorkoutService,
    private router: Router,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadWorkoutPlans();
    this.loadExercises();
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

  loadWorkoutPlans(): void {
    this.workoutService.getWorkoutPlans().subscribe(
      (plans: WorkoutPlan[]) => this.workoutPlans = plans,
      (error: Error) => console.error('Error loading workout plans:', error)
    );
  }

  loadExercises(): void {
    this.workoutService.getExercises().subscribe(
      (exercises: Exercise[]) => this.exercises = exercises,
      (error: Error) => console.error('Error loading exercises:', error)
    );
  }

  togglePlanDetails(plan: WorkoutPlan): void {
    this.expandedPlanId = this.expandedPlanId === plan.planId ? null : plan.planId;
  }

  createNewPlan(): void {
    // TODO: Implement plan creation
    console.log('Creating new plan...');
  }

  getYouTubeThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  extractVideoId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  openVideo(exercise: Exercise): void {
    if (!exercise.videoUrl) return;
    
    const videoId = this.extractVideoId(exercise.videoUrl);
    this.dialog.open(VideoDialogComponent, {
      data: { videoId, title: exercise.name },
      width: '90vw',
      maxWidth: '1200px',
      panelClass: 'video-dialog-container'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
