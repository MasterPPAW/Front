import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly USER_KEY = 'user_profile';
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(this.getUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasUserLoggedIn());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log('API URL:', this.API_URL);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Login request:', credentials);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          this.handleAuthResponse(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('Register request URL:', `${this.API_URL}/register`);
    
    // Convert Date to ISO string and maintain property order
    const requestData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      registrationDate: userData.registrationDate.toISOString(),
      fitnessLevel: userData.fitnessLevel,
      trialExpiration: userData.trialExpiration,
      newProperty1: userData.newProperty1,
      newProperty2: userData.newProperty2
    };
    
    console.log('Register request data:', JSON.stringify(requestData, null, 2));
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, requestData, { withCredentials: true })
      .pipe(
        tap(response => {
          console.log('Register response:', response);
          this.handleAuthResponse(response);
        })
      );
  }

  logout(): void {
    console.log('Logout request sent');
    // Call logout endpoint to clear server-side session
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        console.log('Logout successful');
      });
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response.success) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      this.isAuthenticatedSubject.next(true);
      console.log('Auth response handled successfully:', response);
    }
  }

  private getUserFromStorage(): UserProfile | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private hasUserLoggedIn(): boolean {
    return !!this.getUserFromStorage();
  }
}
