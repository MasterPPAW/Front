import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Exercise, WorkoutPlan, WorkoutPlanExercise, WorkoutPlanForCreate } from '../models/workout.models';

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

  createWorkoutPlan(workoutPlan: WorkoutPlanForCreate): Observable<WorkoutPlan> {
    return this.http.post<WorkoutPlan>(`${this.API_URL}/workoutplans`, workoutPlan, { withCredentials: true });
  }

  createWorkoutPlanExercises(workoutPlan: WorkoutPlanExercise): Observable<WorkoutPlanExercise> {
    return this.http.post<WorkoutPlanExercise>(`${this.API_URL}/workoutplanexercises`, workoutPlan, { withCredentials: true });
  }

  deleteWorkoutPlan(planId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/workoutplans/${planId}`, { withCredentials: true });
  }
}
