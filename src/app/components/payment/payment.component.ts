import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PaymentService } from '../../services/payment.service';
import { Subscription, SubscriptionForPost } from '../../models/subscription.models';
import { UserProfile } from '../../models/auth.models';
import { Payment, PaymentForDisplay, PaymentForPost } from '../../models/payment.models';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
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
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
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
export class PaymentComponent implements OnInit {
  user: UserProfile | null = null;
  subscriptionData: SubscriptionForPost | undefined;
  subscription: Subscription | null = null;
  payment: Payment | null = null;

  paymentOptions = [
    {
      paymentMethod: 'credit_card',
      displayName: 'Credit Card'
    },
    {
      paymentMethod: 'paypal',
      displayName: 'PayPal'
    },
    {
      paymentMethod: 'bank_transfer',
      displayName: 'Bank Transfer'
    }
  ];

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionData = this.subscriptionService.getSubscriptionData();
    console.log('Received subscription data:', this.subscriptionData);

    this.loadUserProfile();
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
  
  async selectPaymentMethod(paymentMethod: PaymentForDisplay): Promise<void> {
    console.log('Selected payment method:', paymentMethod);

    try {
        await this.selectSubscription();
    
        const pay: PaymentForPost = {
            UserId: this.user!.userId,
            SubscriptionId: this.subscription!.subscriptionId,
            Amount: this.subscription!.price,
            PaymentDate: this.subscription!.startDate,
            PaymentMethod: paymentMethod.paymentMethod
        };

        console.log('Pay:', pay);
        
        this.paymentService.postPayment(pay).subscribe(
            (payment: Payment) => {
                this.payment = payment;
                console.log('Payment made successfully:', payment);
                this.dialog.open(SuccessDialogComponent, {
                    width: '400px', // You can adjust the dialog size
                  });
            },
            (error: Error) => console.error('Error making payment:', error)
        );
    } catch (error) {
        console.error('Error selecting subscription:', error);
    }
  }

  private selectSubscription(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.subscriptionService.postSubscription(this.subscriptionData!).subscribe(
            (updatedSubscription: Subscription) => {
                this.subscription = updatedSubscription;
                console.log('Subscription updated:', updatedSubscription);
                resolve();
            },
            (error: Error) => {
                console.error('Error updating subscription:', error)
                reject(error);
            }
        );
    });
  }

  goBackToSubscription(): void {
    this.router.navigate(['/subscription']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
