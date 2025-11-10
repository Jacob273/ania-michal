import { Component, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';
import { ProgressService } from './services/progress.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-wrapper">
      <!-- Home Screen -->
      <div class="container" *ngIf="currentView === 'home'">
        <!-- Language Toggle Button -->
        <button class="language-toggle" (click)="toggleLanguage()">
          <span class="flag">{{ currentLanguage === 'en' ? '🇵🇱' : '🇬🇧' }}</span>
          {{ translate('switch_language') }}
        </button>

        <!-- Ania's Section (Left) -->
        <div class="section ania-section">
          <div class="header">
            <h1 class="name-title">ANIA</h1>
            <div class="emoji">🎨</div>
          </div>
          <div class="content-area">
            <div class="card">
              <div class="card-header">
                <button class="arrow-toggle arrow-left" (click)="toggleAniaList()">
                  <span class="arrow-icon">{{ aniaShowFavorites ? '◀' : '▶' }}</span>
                </button>
                <h2>{{ aniaShowFavorites ? translate('favorite_things') : translate('unfavorite_things') }}</h2>
              </div>
              <div class="list-container">
                <ul class="fun-list"
                    [class.fade-out]="aniaListAnimating"
                    [class.fade-in]="!aniaListAnimating"
                    *ngIf="aniaShowFavorites">
                  <li>{{ translate('drawing_painting') }}</li>
                  <li (click)="startBookTracking('ANIA')">{{ translate('reading_books') }}</li>
                  <li>{{ translate('playing_games') }}</li>
                  <li>{{ translate('making_crafts') }}</li>
                  <li (click)="startLearning('ANIA')" class="learning-item">{{ translate('learning_english') }} 📚</li>
                </ul>
                <ul class="fun-list unfavorite-list"
                    [class.fade-out]="aniaListAnimating"
                    [class.fade-in]="!aniaListAnimating"
                    *ngIf="!aniaShowFavorites">
                  <li>{{ translate('cleaning_room') }}</li>
                  <li>{{ translate('doing_homework') }}</li>
                  <li>{{ translate('going_to_bed_early') }}</li>
                  <li>{{ translate('eating_vegetables') }}</li>
                  <li>{{ translate('brushing_teeth') }}</li>
                </ul>
              </div>
            </div>
            <div class="score-box">
              <div class="score-label">{{ translate('stars_earned') }}</div>
              <div class="score-value">⭐⭐⭐⭐⭐</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">Words Learned</div>
              <div class="progress-value">{{ aniaWordsLearned }} / {{ totalWords }}</div>
              <div class="progress-bar">
                <div class="progress-fill ania-fill" [style.width.%]="(aniaWordsLearned / totalWords) * 100"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Michał's Section (Right) -->
        <div class="section michal-section">
          <div class="header">
            <h1 class="name-title">MICHAŁ</h1>
            <div class="emoji">🎮</div>
          </div>
          <div class="content-area">
            <div class="card">
              <div class="card-header">
                <h2>{{ michalShowFavorites ? translate('favorite_things') : translate('unfavorite_things') }}</h2>
                <button class="arrow-toggle arrow-right" (click)="toggleMichalList()">
                  <span class="arrow-icon">{{ michalShowFavorites ? '▶' : '◀' }}</span>
                </button>
              </div>
              <div class="list-container">
                <ul class="fun-list"
                    [class.fade-out]="michalListAnimating"
                    [class.fade-in]="!michalListAnimating"
                    *ngIf="michalShowFavorites">
                  <li>{{ translate('video_games') }}</li>
                  <li>{{ translate('sports_soccer') }}</li>
                  <li (click)="startBookTracking('MICHAL')">{{ translate('reading_books') }}</li>
                  <li>{{ translate('building_legos') }}</li>
                  <li (click)="startLearning('MICHAL')" class="learning-item">{{ translate('learning_english') }} 📚</li>
                </ul>
                <ul class="fun-list unfavorite-list"
                    [class.fade-out]="michalListAnimating"
                    [class.fade-in]="!michalListAnimating"
                    *ngIf="!michalShowFavorites">
                  <li>{{ translate('cleaning_room') }}</li>
                  <li>{{ translate('doing_homework') }}</li>
                  <li>{{ translate('going_to_bed_early') }}</li>
                  <li>{{ translate('eating_vegetables') }}</li>
                  <li>{{ translate('brushing_teeth') }}</li>
                </ul>
              </div>
            </div>
            <div class="score-box">
              <div class="score-label">{{ translate('stars_earned') }}</div>
              <div class="score-value">⭐⭐⭐⭐⭐</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">Words Learned</div>
              <div class="progress-value">{{ michalWordsLearned }} / {{ totalWords }}</div>
              <div class="progress-bar">
                <div class="progress-fill michal-fill" [style.width.%]="(michalWordsLearned / totalWords) * 100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matching Game Screen -->
      <app-matching-game
        *ngIf="currentView === 'game'"
        [playerName]="currentPlayer"
        (backToHome)="goHome()">
      </app-matching-game>

      <!-- Book Tracker Screen -->
      <app-book-tracker
        *ngIf="currentView === 'books'"
        [playerName]="currentPlayer"
        (backToHome)="goHome()">
      </app-book-tracker>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      height: 100vh;
      margin: 0;
      padding: 0;
      font-family: 'Comic Sans MS', 'Chalkboard SE', 'Arial Rounded MT Bold', cursive, sans-serif;
    }

    .section {
      width: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30px 20px 40px 20px;
      box-sizing: border-box;
      position: relative;
      overflow-y: auto;
    }

    .ania-section {
      background: linear-gradient(135deg, #ff6b9d 0%, #ffa5c8 100%);
      border-right: 5px solid #fff;
    }

    .michal-section {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-left: 5px solid #fff;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .name-title {
      font-size: 72px;
      font-weight: bold;
      color: white;
      text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
      margin: 20px 0;
      letter-spacing: 8px;
    }

    .emoji {
      font-size: 80px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .content-area {
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 20px;
      padding: 35px;
      margin-bottom: 30px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      transform: rotate(-1deg);
      transition: transform 0.3s ease;
      position: relative;
      overflow: visible;
    }

    .card:hover {
      transform: rotate(0deg) scale(1.05);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-bottom: 20px;
      position: relative;
    }

    .card-header h2 {
      color: #333;
      font-size: 28px;
      margin: 0;
      text-align: center;
      flex: 1;
    }

    .arrow-toggle {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .arrow-toggle:hover {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .arrow-toggle:active {
      transform: scale(0.95);
    }

    .arrow-icon {
      font-size: 24px;
      color: white;
      font-weight: bold;
      transition: transform 0.3s ease;
    }

    .arrow-left {
      order: -1;
    }

    .arrow-right {
      order: 1;
    }

    .list-container {
      position: relative;
      min-height: 380px;
      padding-bottom: 20px;
    }

    .fun-list {
      list-style: none;
      padding: 0;
      margin: 0;
      position: absolute;
      width: 100%;
      animation-duration: 0.6s;
      animation-fill-mode: both;
    }

    .fade-out {
      animation-name: fadeOut;
    }

    .fade-in {
      animation-name: fadeIn;
    }

    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-30px);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .fun-list li {
      background: #f0f0f0;
      margin: 12px 0;
      padding: 18px;
      border-radius: 10px;
      font-size: 20px;
      color: #555;
      border-left: 5px solid #ffd700;
      transition: all 0.3s ease;
    }

    .fun-list li:hover {
      background: #ffd700;
      transform: translateX(10px);
      cursor: pointer;
    }

    .unfavorite-list li {
      background: #ffe0e0;
      border-left-color: #ff6b6b;
    }

    .unfavorite-list li:hover {
      background: #ff6b6b;
      color: white;
    }

    .learning-item {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border-left-color: #667eea !important;
      font-weight: bold;
      animation: pulse 2s infinite;
    }

    .learning-item:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
      transform: translateX(10px) scale(1.05);
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
      50% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
    }

    .score-box {
      background: white;
      border-radius: 20px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      transform: rotate(1deg);
      margin-bottom: 20px;
    }

    .score-label {
      font-size: 24px;
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
    }

    .score-value {
      font-size: 36px;
      animation: sparkle 1.5s infinite;
    }

    .progress-box {
      background: white;
      border-radius: 20px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      transform: rotate(-1deg);
    }

    .progress-label {
      font-size: 20px;
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
    }

    .progress-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
    }

    .progress-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .progress-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.5s ease;
    }

    .ania-fill {
      background: linear-gradient(90deg, #ff6b9d 0%, #ffa5c8 100%);
    }

    .michal-fill {
      background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .language-toggle {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      background: white;
      border: none;
      border-radius: 50px;
      padding: 15px 30px;
      font-size: 20px;
      font-weight: bold;
      font-family: 'Comic Sans MS', cursive;
      color: #333;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .language-toggle:hover {
      transform: translateX(-50%) scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .language-toggle:active {
      transform: translateX(-50%) scale(0.95);
    }

    .flag {
      font-size: 28px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Ania & Michal';
  currentLanguage: 'en' | 'pl' = 'en';
  currentView: 'home' | 'game' | 'books' = 'home';
  currentPlayer: string = 'ANIA';

  aniaWordsLearned: number = 0;
  michalWordsLearned: number = 0;
  totalWords: number = 0;

  aniaShowFavorites: boolean = true;
  michalShowFavorites: boolean = true;
  aniaListAnimating: boolean = false;
  michalListAnimating: boolean = false;

  constructor(
    public translationService: TranslationService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.translationService.getCurrentLanguage();
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    // Load total words
    this.totalWords = this.progressService.getTotalWords();

    // Subscribe to Ania's progress
    this.progressService.aniaProgress$.subscribe(progress => {
      this.aniaWordsLearned = progress.wordsLearned;
    });

    // Subscribe to Michal's progress
    this.progressService.michalProgress$.subscribe(progress => {
      this.michalWordsLearned = progress.wordsLearned;
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }

  startLearning(player: string): void {
    this.currentPlayer = player;
    this.currentView = 'game';
  }

  goHome(): void {
    this.currentView = 'home';
  }

  toggleAniaList(): void {
    this.aniaListAnimating = true;
    setTimeout(() => {
      this.aniaShowFavorites = !this.aniaShowFavorites;
      this.aniaListAnimating = false;
    }, 600);
  }

  toggleMichalList(): void {
    this.michalListAnimating = true;
    setTimeout(() => {
      this.michalShowFavorites = !this.michalShowFavorites;
      this.michalListAnimating = false;
    }, 600);
  }

  startBookTracking(player: string): void {
    this.currentPlayer = player;
    this.currentView = 'books';
  }
}
