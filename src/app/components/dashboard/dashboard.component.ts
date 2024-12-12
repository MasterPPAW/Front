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
  ],
  templateUrl: './dashboard.component.html',
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
  planExercises: { [key: number]: Exercise[] } = {};

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
    if (this.expandedPlanId === plan.planId) {
      this.expandedPlanId = null;
    } else {
      this.expandedPlanId = plan.planId;
      this.loadPlanExercises(plan.planId);
    }
  }

  loadPlanExercises(planId: number): void {
    if (!this.planExercises[planId]) {
      this.workoutService.getPlanExercises(planId).subscribe(
        (exercises: Exercise[]) => {
          this.planExercises[planId] = exercises;
        },
        (error: Error) => console.error('Error loading plan exercises:', error)
      );
    }
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
