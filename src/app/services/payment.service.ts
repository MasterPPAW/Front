import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Payment, PaymentForPost } from '../models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPayments(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/payments`, { withCredentials: true });
  }

  postPayment(payment: PaymentForPost): Observable<Payment> {
    return this.http.post<Payment>(`${this.API_URL}/payments`, payment, { withCredentials: true });
  }
}
