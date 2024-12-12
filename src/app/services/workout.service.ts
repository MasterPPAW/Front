import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Exercise, WorkoutPlan } from '../models/workout.models';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getWorkoutPlans(): Observable<WorkoutPlan[]> {
    return this.http.get<WorkoutPlan[]>(`${this.API_URL}/workoutplans`, { withCredentials: true });
  }

  getWorkoutPlan(planId: number): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.API_URL}/workoutplans/${planId}`, { withCredentials: true });
  }

  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.API_URL}/exercises`, { withCredentials: true });
  }

  getWorkoutPlanDetails(planId: number): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.API_URL}/workoutplans/${planId}`, { withCredentials: true });
  }

  getPlanExercises(planId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.API_URL}/WorkoutPlanExercises/plan/${planId}`, { withCredentials: true });
  }
}
