import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {SubscriptionService} from '../../services/subscription.service';
import { Subscription, SubscriptionForDisplay, SubscriptionForPost } from '../../models/subscription.models';
import { UserProfile } from '../../models/auth.models';
import { ActivatedRoute } from '@angular/router';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription',
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
  ],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
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
export class SubscriptionComponent implements OnInit {
  user: UserProfile | null = null;
  subscription: SubscriptionForPost | null = null;

  subscriptionOptions = [
    {
      title: 'Basic Plan',
      type: 'beginner',
      duration: 30,
      price: 9.99,
      description: 'Access to beginner workout plans.'
    },
    {
      title: 'Intermediate Plan',
      type: 'intermediate',
      duration: 30,
      price: 19.99,
      description: 'Access to beginner and intermediate workout plans.'
    },
    {
      title: 'Advanced Plan',
      type: 'advanced',
      duration: 30,
      price: 29.99,
      description: 'Access to all workout plans.'
    },
    {
      title: 'All-in-one Plan',
      type: 'advanced',
      duration: 365,
      price: 249.99,
      description: 'Access to all workout plans, for a better year.'
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadSubscription();
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

  loadSubscription(): void {
    this.subscriptionService.getSubscriptions(this.user?.userId || 1).subscribe(
      (subscription: Subscription) => this.subscription = subscription,
      (error: Error) => console.error('Error loading subscriptions:', error)
    );
  }
  
  selectSubscription(subscription: SubscriptionForDisplay): void {
    const sub: SubscriptionForPost = {
      userId: this.user!.userId,
      subscriptionType: subscription.type,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + subscription.duration)),
      price: subscription.price,
      isDeleted: false
    }

    this.subscriptionService.postSubscription(sub).subscribe(
      (updatedSubscription: SubscriptionForPost) => {
        this.subscription = updatedSubscription;
        console.log('Subscription updated:', updatedSubscription);
      },
      (error: Error) => console.error('Error updating subscription:', error)
    );
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
