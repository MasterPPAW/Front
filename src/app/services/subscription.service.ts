import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Subscription, SubscriptionForPost } from '../models/subscription.models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly API_URL = environment.apiUrl;
  private subscriptionData: SubscriptionForPost | undefined;

  constructor(private http: HttpClient) { }

  setSubscriptionData(data: SubscriptionForPost): void {
    this.subscriptionData = data;
  }

  // Get the subscription data
  getSubscriptionData(): SubscriptionForPost | undefined {
    return this.subscriptionData;
  }

  getSubscriptions(userId: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.API_URL}/subscriptions/user/${userId}`, { withCredentials: true });
  }

  postSubscription(subscription: SubscriptionForPost): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.API_URL}/subscriptions`, subscription, { withCredentials: true });
  }
}
