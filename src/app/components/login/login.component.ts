import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="stars">
        <div class="star" *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]"></div>
      </div>

      <!-- Language Toggle Button -->
      <button class="language-toggle-login" (click)="toggleLanguage()">
        <span class="flag">{{ currentLanguage === 'en' ? '🇵🇱' : '🇬🇧' }}</span>
        {{ translate('switch_language') }}
      </button>

      <div class="login-card">
        <div class="logo-section">
          <div class="logo-circle">
            <span class="logo-emoji">🎨</span>
            <span class="logo-emoji">📚</span>
          </div>
          <h1 class="app-title">{{ translate('app_title') }}</h1>
          <p class="app-subtitle">{{ translate('learning_adventure') }}</p>
        </div>

        <div class="login-form">
          <div class="lock-icon">🔒</div>
          <h2>{{ translate('enter_password') }}</h2>
          <p class="instruction">{{ translate('password_instruction') }}</p>

          <input
            type="password"
            [(ngModel)]="password"
            (keyup.enter)="onLogin()"
            [placeholder]="translate('enter_password_placeholder')"
            class="password-input"
            [class.shake]="showError"
            autofocus>

          <div class="error-message" *ngIf="showError">
            ❌ {{ translate('incorrect_password') }}
          </div>

          <button class="login-button" (click)="onLogin()">
            <span class="button-text">{{ translate('unlock') }}</span>
            <span class="button-icon">→</span>
          </button>
        </div>

        <div class="footer-info">
          <div class="feature-badge">
            <span class="badge-icon">📖</span>
            <span>{{ translate('book_tracking_feature') }}</span>
          </div>
          <div class="feature-badge">
            <span class="badge-icon">🎮</span>
            <span>{{ translate('word_games_feature') }}</span>
          </div>
          <div class="feature-badge">
            <span class="badge-icon">🌍</span>
            <span>{{ translate('languages_feature') }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Comic Sans MS', cursive;
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    .stars {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .language-toggle-login {
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 25px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      font-family: 'Comic Sans MS', cursive;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1000;
    }

    .language-toggle-login:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .language-toggle-login .flag {
      font-size: 24px;
    }

    .star {
      position: absolute;
      width: 3px;
      height: 3px;
      background: white;
      border-radius: 50%;
      animation: twinkle 3s infinite;
    }

    .star:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
    .star:nth-child(2) { top: 40%; left: 30%; animation-delay: 0.5s; }
    .star:nth-child(3) { top: 60%; left: 50%; animation-delay: 1s; }
    .star:nth-child(4) { top: 80%; left: 70%; animation-delay: 1.5s; }
    .star:nth-child(5) { top: 30%; left: 80%; animation-delay: 2s; }
    .star:nth-child(6) { top: 70%; left: 20%; animation-delay: 2.5s; }
    .star:nth-child(7) { top: 50%; left: 90%; animation-delay: 0.3s; }
    .star:nth-child(8) { top: 10%; left: 60%; animation-delay: 0.8s; }
    .star:nth-child(9) { top: 90%; left: 40%; animation-delay: 1.2s; }
    .star:nth-child(10) { top: 25%; left: 45%; animation-delay: 1.8s; }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.5); }
    }

    .login-card {
      background: white;
      border-radius: 30px;
      padding: 50px 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      position: relative;
      z-index: 1;
      animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .logo-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #ff6b9d 0%, #4facfe 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      animation: rotate 10s linear infinite;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .logo-emoji {
      font-size: 40px;
      animation: bounce 2s infinite;
    }

    .logo-emoji:nth-child(2) {
      animation-delay: 1s;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .app-title {
      font-size: 48px;
      color: #333;
      margin: 0 0 10px 0;
      background: linear-gradient(135deg, #ff6b9d, #4facfe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .app-subtitle {
      font-size: 18px;
      color: #666;
      margin: 0;
    }

    .login-form {
      margin-bottom: 30px;
    }

    .lock-icon {
      font-size: 50px;
      text-align: center;
      margin-bottom: 20px;
      animation: swing 2s infinite;
    }

    @keyframes swing {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-10deg); }
      75% { transform: rotate(10deg); }
    }

    .login-form h2 {
      text-align: center;
      color: #333;
      font-size: 28px;
      margin: 0 0 10px 0;
    }

    .instruction {
      text-align: center;
      color: #666;
      margin: 0 0 30px 0;
      font-size: 16px;
    }

    .password-input {
      width: 100%;
      padding: 18px 20px;
      border: 3px solid #e0e0e0;
      border-radius: 15px;
      font-size: 18px;
      font-family: 'Comic Sans MS', cursive;
      box-sizing: border-box;
      transition: all 0.3s ease;
      text-align: center;
      letter-spacing: 2px;
    }

    .password-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    }

    .password-input.shake {
      animation: shake 0.5s;
      border-color: #ff6b6b;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .error-message {
      color: #ff6b6b;
      text-align: center;
      margin: 15px 0;
      font-size: 16px;
      font-weight: bold;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .login-button {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      font-family: 'Comic Sans MS', cursive;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .login-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.6);
    }

    .login-button:active {
      transform: translateY(0);
    }

    .button-icon {
      font-size: 28px;
      transition: transform 0.3s ease;
    }

    .login-button:hover .button-icon {
      transform: translateX(5px);
    }

    .footer-info {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }

    .feature-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 15px;
      background: #f8f9fa;
      border-radius: 20px;
      font-size: 14px;
      color: #666;
    }

    .badge-icon {
      font-size: 18px;
    }
  `]
})
export class LoginComponent {
  password: string = '';
  showError: boolean = false;
  currentLanguage: 'en' | 'pl' = 'en';

  constructor(
    private authService: AuthService,
    public translationService: TranslationService
  ) {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  onLogin(): void {
    if (this.authService.login(this.password)) {
      // Login successful - auth service will update the state
      this.showError = false;
    } else {
      // Login failed
      this.showError = true;
      this.password = '';

      // Remove shake animation after it completes
      setTimeout(() => {
        this.showError = false;
      }, 2000);
    }
  }
}
