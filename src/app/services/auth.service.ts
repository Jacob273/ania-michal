import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CORRECT_PASSWORD = 'praliczynka123';
  private readonly AUTH_KEY = 'ania-michal-authenticated';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuth());
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  private checkAuth(): boolean {
    return sessionStorage.getItem(this.AUTH_KEY) === 'true';
  }

  login(password: string): boolean {
    if (password === this.CORRECT_PASSWORD) {
      sessionStorage.setItem(this.AUTH_KEY, 'true');
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.checkAuth();
  }
}
