import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { PaymentComponent } from './components/payment/payment.component';
import { WorkoutComponent } from './components/workout/workout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'exercises/:planId', component: ExerciseComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'workout', component: WorkoutComponent }
];
