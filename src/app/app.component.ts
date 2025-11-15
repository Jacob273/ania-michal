import { Component, OnInit } from '@angular/core';
import { TranslationService } from './services/translation.service';
import { ProgressService } from './services/progress.service';
import { AuthService } from './services/auth.service';
import { RoomCleaningService } from './services/room-cleaning.service';
import { BedtimeService } from './services/bedtime.service';
import { TeethBrushingService } from './services/teeth-brushing.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-wrapper">
      <!-- Login Screen -->
      <app-login *ngIf="!isAuthenticated"></app-login>

      <!-- Home Screen -->
      <div class="container" *ngIf="currentView === 'home' && isAuthenticated">
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
                  <li class="not-implemented">
                    {{ translate('drawing_painting') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="startBookTracking('ANIA')" class="clickable-item">{{ translate('reading_books') }}</li>
                  <li class="not-implemented">
                    {{ translate('playing_games') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li class="not-implemented">
                    {{ translate('making_crafts') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="startLearning('ANIA')" class="learning-item">{{ translate('learning_english') }} 📚</li>
                </ul>
                <ul class="fun-list unfavorite-list"
                    [class.fade-out]="aniaListAnimating"
                    [class.fade-in]="!aniaListAnimating"
                    *ngIf="!aniaShowFavorites">
                  <li (click)="showCleaningImage('ANIA')" class="clickable-item">{{ translate('cleaning_room') }}</li>
                  <li class="not-implemented">
                    {{ translate('doing_homework') }}
                    <span class="coming-soon-icon" (click)="$event.stopPropagation()">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="showBedtimeImage('ANIA')" class="clickable-item">{{ translate('going_to_bed_early') }}</li>
                  <li (click)="showVegetablesImage('ANIA')" class="clickable-item">{{ translate('eating_vegetables') }}</li>
                  <li (click)="showTeethBrushingImage('ANIA')" class="clickable-item">{{ translate('brushing_teeth') }}</li>
                </ul>
              </div>
            </div>
            <div class="score-box">
              <div class="score-label">{{ translate('stars_earned') }}</div>
              <div class="score-value">⭐⭐⭐⭐⭐</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('words_learned') }}</div>
              <div class="progress-value">{{ aniaWordsLearned }} / {{ totalWords }}</div>
              <div class="progress-bar">
                <div class="progress-fill ania-fill" [style.width.%]="(aniaWordsLearned / totalWords) * 100"></div>
              </div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('rooms_cleaned') }} 🧹</div>
              <div class="progress-value">{{ aniaRoomsCleaned }}</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('bedtimes_completed') }} 🌙</div>
              <div class="progress-value">{{ aniaBedtimesCompleted }}</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('teeth_brushed') }} 🦷</div>
              <div class="progress-value">{{ aniaTeethBrushed }}</div>
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
                  <li class="not-implemented">
                    {{ translate('video_games') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li class="not-implemented">
                    {{ translate('sports_soccer') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="startBookTracking('MICHAL')" class="clickable-item">{{ translate('reading_books') }}</li>
                  <li class="not-implemented">
                    {{ translate('building_legos') }}
                    <span class="coming-soon-icon">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="startLearning('MICHAL')" class="learning-item">{{ translate('learning_english') }} 📚</li>
                </ul>
                <ul class="fun-list unfavorite-list"
                    [class.fade-out]="michalListAnimating"
                    [class.fade-in]="!michalListAnimating"
                    *ngIf="!michalShowFavorites">
                  <li (click)="showCleaningImage('MICHAL')" class="clickable-item">{{ translate('cleaning_room') }}</li>
                  <li class="not-implemented">
                    {{ translate('doing_homework') }}
                    <span class="coming-soon-icon" (click)="$event.stopPropagation()">
                      💡
                      <span class="custom-tooltip">{{ translate('coming_soon_message') }}</span>
                    </span>
                  </li>
                  <li (click)="showBedtimeImage('MICHAL')" class="clickable-item">{{ translate('going_to_bed_early') }}</li>
                  <li (click)="showVegetablesImage('MICHAL')" class="clickable-item">{{ translate('eating_vegetables') }}</li>
                  <li (click)="showTeethBrushingImage('MICHAL')" class="clickable-item">{{ translate('brushing_teeth') }}</li>
                </ul>
              </div>
            </div>
            <div class="score-box">
              <div class="score-label">{{ translate('stars_earned') }}</div>
              <div class="score-value">⭐⭐⭐⭐⭐</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('words_learned') }}</div>
              <div class="progress-value">{{ michalWordsLearned }} / {{ totalWords }}</div>
              <div class="progress-bar">
                <div class="progress-fill michal-fill" [style.width.%]="(michalWordsLearned / totalWords) * 100"></div>
              </div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('rooms_cleaned') }} 🧹</div>
              <div class="progress-value">{{ michalRoomsCleaned }}</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('bedtimes_completed') }} 🌙</div>
              <div class="progress-value">{{ michalBedtimesCompleted }}</div>
            </div>
            <div class="progress-box">
              <div class="progress-label">{{ translate('teeth_brushed') }} 🦷</div>
              <div class="progress-value">{{ michalTeethBrushed }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Matching Game Screen -->
      <app-matching-game
        *ngIf="currentView === 'game' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()">
      </app-matching-game>

      <!-- Book Tracker Screen -->
      <app-book-tracker
        *ngIf="currentView === 'books' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()">
      </app-book-tracker>

      <!-- Cleaning Game Screen -->
      <app-cleaning-game
        *ngIf="currentView === 'cleaning' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()"
        (roomCleaned)="onRoomCleaned()">
      </app-cleaning-game>

      <!-- Bedtime Game Screen -->
      <app-bedtime-game
        *ngIf="currentView === 'bedtime' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()"
        (bedtimeCompleted)="onBedtimeCompleted()">
      </app-bedtime-game>

      <!-- Teeth Brushing Game Screen -->
      <app-teeth-brushing-game
        *ngIf="currentView === 'teeth' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()"
        (teethBrushed)="onTeethBrushed()">
      </app-teeth-brushing-game>

      <!-- Vegetable Game Screen -->
      <app-vegetable-game
        *ngIf="currentView === 'vegetables' && isAuthenticated"
        [playerName]="currentPlayer"
        (backToHome)="goHome()">
      </app-vegetable-game>

      <!-- Cleaning Room Image Modal -->
      <div class="image-modal-overlay" *ngIf="showCleaningModal" (click)="closeCleaningModal()">
        <div class="image-modal-content"
             [class.ania-modal]="cleaningPlayer === 'ANIA'"
             [class.michal-modal]="cleaningPlayer === 'MICHAL'"
             (click)="$event.stopPropagation()">
          <button class="modal-close-btn" (click)="closeCleaningModal()">×</button>
          <img [src]="getCleaningImage()" [alt]="translate('cleaning_room')" class="cleaning-image">
          <h2 class="modal-title">{{ translate('cleaning_room') }} 😫</h2>
          <button class="clean-room-btn" (click)="startCleaningGame()">
            {{ translate('clean_my_room') }} 🧹
          </button>
        </div>
      </div>

      <!-- Bedtime Image Modal -->
      <div class="image-modal-overlay" *ngIf="showBedtimeModal" (click)="closeBedtimeModal()">
        <div class="image-modal-content bedtime-modal"
             [class.ania-modal]="bedtimePlayer === 'ANIA'"
             [class.michal-modal]="bedtimePlayer === 'MICHAL'"
             (click)="$event.stopPropagation()">
          <button class="modal-close-btn" (click)="closeBedtimeModal()">×</button>
          <img [src]="getBedtimeImage()" [alt]="translate('going_to_bed_early')" class="cleaning-image">
          <h2 class="modal-title">{{ translate('going_to_bed_early') }} 😴</h2>
          <button class="bedtime-btn" (click)="startBedtimeGame()">
            {{ translate('go_to_bed_early') }} 🌙
          </button>
        </div>
      </div>

      <!-- Teeth Brushing Image Modal -->
      <div class="image-modal-overlay" *ngIf="showTeethModal" (click)="closeTeethModal()">
        <div class="image-modal-content teeth-modal"
             [class.ania-modal]="teethPlayer === 'ANIA'"
             [class.michal-modal]="teethPlayer === 'MICHAL'"
             (click)="$event.stopPropagation()">
          <button class="modal-close-btn" (click)="closeTeethModal()">×</button>
          <img [src]="getTeethImage()" [alt]="translate('brushing_teeth')" class="cleaning-image">
          <h2 class="modal-title">{{ translate('brushing_teeth') }} 🦷</h2>
          <button class="teeth-btn" (click)="startTeethBrushingGame()">
            {{ translate('brush_your_teeth') }} 🪥
          </button>
        </div>
      </div>

      <!-- Vegetables Image Modal -->
      <div class="image-modal-overlay" *ngIf="showVegetablesModal" (click)="closeVegetablesModal()">
        <div class="image-modal-content vegetables-modal"
             [class.ania-modal]="vegetablesPlayer === 'ANIA'"
             [class.michal-modal]="vegetablesPlayer === 'MICHAL'"
             (click)="$event.stopPropagation()">
          <button class="modal-close-btn" (click)="closeVegetablesModal()">×</button>
          <img [src]="getVegetablesImage()" [alt]="translate('eating_vegetables')" class="cleaning-image">
          <h2 class="modal-title">{{ translate('eating_vegetables') }} 🥦</h2>
          <button class="vegetables-btn" (click)="startVegetablesGame()">
            {{ translate('play_vegetable_game') }} 🏹
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      height: 100vh;
      margin: 0;
      padding: 0;
      font-family: 'Quicksand', sans-serif;
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

    .not-implemented {
      opacity: 0.5;
      background: #e0e0e0 !important;
      color: #999 !important;
      cursor: not-allowed !important;
      position: relative;
      border-left-color: #ccc !important;
    }

    .not-implemented:hover {
      background: #e0e0e0 !important;
      color: #999 !important;
      transform: none !important;
      cursor: not-allowed !important;
    }

    .coming-soon-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 28px;
      animation: glow-bulb 2s ease-in-out infinite;
      cursor: pointer;
      z-index: 10;
    }

    .coming-soon-icon:active {
      transform: translateY(-50%) scale(0.9);
    }

    @keyframes glow-bulb {
      0%, 100% {
        filter: brightness(1);
        transform: translateY(-50%) scale(1);
      }
      50% {
        filter: brightness(1.5);
        transform: translateY(-50%) scale(1.15);
      }
    }

    .custom-tooltip {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%) scale(0.8);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 15px;
      font-size: 18px;
      font-weight: bold;
      width: 280px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
      z-index: 1000;
      transition: all 0.3s ease;
      line-height: 1.5;
      border: 3px solid #ffd700;
      pointer-events: none;
    }

    .custom-tooltip::before {
      content: '';
      position: absolute;
      right: -15px;
      top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: #ffd700;
      z-index: 1;
    }

    .custom-tooltip::after {
      content: '';
      position: absolute;
      right: -9px;
      top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: #667eea;
      z-index: 2;
    }

    /* Backdrop for tooltip to ensure visibility */
    .coming-soon-icon:hover::before,
    .coming-soon-icon:active::before,
    .coming-soon-icon:focus::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 999;
      animation: fadeInBackdrop 0.3s ease;
    }

    @keyframes fadeInBackdrop {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .coming-soon-icon:hover .custom-tooltip,
    .coming-soon-icon:active .custom-tooltip,
    .coming-soon-icon:focus .custom-tooltip {
      visibility: visible;
      opacity: 1 !important;
      transform: translateY(-50%) scale(1);
    }

    @media (max-width: 768px) {
      .custom-tooltip {
        right: auto;
        left: 50%;
        top: -80px;
        transform: translateX(-50%) scale(0.8);
        width: 240px;
        font-size: 16px;
      }

      .custom-tooltip::before,
      .custom-tooltip::after {
        right: auto;
        left: 50%;
        top: 100%;
        transform: translateX(-50%) rotate(90deg);
      }

      .coming-soon-icon:hover .custom-tooltip,
      .coming-soon-icon:active .custom-tooltip,
      .coming-soon-icon:focus .custom-tooltip {
        transform: translateX(-50%) scale(1);
      }
    }

    .clickable-item {
      cursor: pointer;
    }

    .clickable-item:hover {
      cursor: pointer;
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
      font-family: 'Quicksand', sans-serif;
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

    .clickable-item {
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .clickable-item:hover {
      transform: scale(1.05);
      font-weight: bold;
    }

    .image-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .image-modal-content {
      background: white;
      border-radius: 30px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      text-align: center;
      position: relative;
      animation: slideUp 0.4s ease;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    @keyframes slideUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .ania-modal {
      border: 5px solid #ff6b9d;
    }

    .michal-modal {
      border: 5px solid #4facfe;
    }

    .modal-close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 28px;
      cursor: pointer;
      line-height: 1;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close-btn:hover {
      background: #ff5252;
      transform: scale(1.2) rotate(90deg);
    }

    .cleaning-image {
      max-width: 100%;
      height: auto;
      border-radius: 20px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-title {
      color: #333;
      font-size: 32px;
      margin: 0 0 25px 0;
      font-family: 'Quicksand', sans-serif;
    }

    .clean-room-btn {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: none;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }

    .clean-room-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.6);
    }

    .clean-room-btn:active {
      transform: translateY(0);
    }

    .bedtime-btn {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: #ffd700;
      border: 2px solid #ffd700;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    }

    .bedtime-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(255, 215, 0, 0.6);
      background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    }

    .bedtime-btn:active {
      transform: translateY(0);
    }

    .teeth-btn {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
      color: white;
      border: 2px solid white;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 6px 20px rgba(0, 188, 212, 0.4);
    }

    .teeth-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 188, 212, 0.6);
      background: linear-gradient(135deg, #0097a7 0%, #00bcd4 100%);
    }

    .teeth-btn:active {
      transform: translateY(0);
    }

    .vegetables-btn {
      width: 100%;
      padding: 18px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: 2px solid white;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
    }

    .vegetables-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(76, 175, 80, 0.6);
      background: linear-gradient(135deg, #45a049 0%, #4CAF50 100%);
    }

    .vegetables-btn:active {
      transform: translateY(0);
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Ania & Michal';
  currentLanguage: 'en' | 'pl' = 'en';
  currentView: 'home' | 'game' | 'books' | 'cleaning' | 'bedtime' | 'teeth' | 'vegetables' = 'home';
  currentPlayer: string = 'ANIA';
  isAuthenticated: boolean = false;

  aniaWordsLearned: number = 0;
  michalWordsLearned: number = 0;
  totalWords: number = 0;

  aniaRoomsCleaned: number = 0;
  michalRoomsCleaned: number = 0;

  aniaBedtimesCompleted: number = 0;
  michalBedtimesCompleted: number = 0;

  aniaTeethBrushed: number = 0;
  michalTeethBrushed: number = 0;

  aniaShowFavorites: boolean = true;
  michalShowFavorites: boolean = true;
  aniaListAnimating: boolean = false;
  michalListAnimating: boolean = false;

  showCleaningModal: boolean = false;
  cleaningPlayer: 'ANIA' | 'MICHAL' = 'ANIA';

  showBedtimeModal: boolean = false;
  bedtimePlayer: 'ANIA' | 'MICHAL' = 'ANIA';

  showTeethModal: boolean = false;
  teethPlayer: 'ANIA' | 'MICHAL' = 'ANIA';

  showVegetablesModal: boolean = false;
  vegetablesPlayer: 'ANIA' | 'MICHAL' = 'ANIA';

  constructor(
    public translationService: TranslationService,
    private progressService: ProgressService,
    private authService: AuthService,
    private roomCleaningService: RoomCleaningService,
    private bedtimeService: BedtimeService,
    private teethBrushingService: TeethBrushingService
  ) {}

  ngOnInit(): void {
    // Check authentication state
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

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

    // Subscribe to room cleaning stats
    this.roomCleaningService.aniaRooms$.subscribe(stats => {
      this.aniaRoomsCleaned = stats.roomsCleaned;
    });

    this.roomCleaningService.michalRooms$.subscribe(stats => {
      this.michalRoomsCleaned = stats.roomsCleaned;
    });

    // Subscribe to bedtime stats
    this.bedtimeService.aniaBedtimes$.subscribe(stats => {
      this.aniaBedtimesCompleted = stats.bedtimesCompleted;
    });

    this.bedtimeService.michalBedtimes$.subscribe(stats => {
      this.michalBedtimesCompleted = stats.bedtimesCompleted;
    });

    // Subscribe to teeth brushing stats
    this.teethBrushingService.aniaTeeth$.subscribe(stats => {
      this.aniaTeethBrushed = stats.teethBrushed;
    });

    this.teethBrushingService.michalTeeth$.subscribe(stats => {
      this.michalTeethBrushed = stats.teethBrushed;
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

  showCleaningImage(player: 'ANIA' | 'MICHAL'): void {
    this.cleaningPlayer = player;
    this.showCleaningModal = true;
  }

  closeCleaningModal(): void {
    this.showCleaningModal = false;
  }

  getCleaningImage(): string {
    if (this.cleaningPlayer === 'ANIA') {
      return 'assets/img/tired_exhausted-girl.png';
    } else {
      return 'assets/img/tired_exhausted-child.png';
    }
  }

  startCleaningGame(): void {
    this.currentPlayer = this.cleaningPlayer;
    this.showCleaningModal = false;
    this.currentView = 'cleaning';
  }

  onRoomCleaned(): void {
    const player = this.currentPlayer as 'ANIA' | 'MICHAL';
    this.roomCleaningService.incrementRoomsCleaned(player);
  }

  showBedtimeImage(player: 'ANIA' | 'MICHAL'): void {
    this.bedtimePlayer = player;
    this.showBedtimeModal = true;
  }

  closeBedtimeModal(): void {
    this.showBedtimeModal = false;
  }

  getBedtimeImage(): string {
    if (this.bedtimePlayer === 'ANIA') {
      return 'assets/img/10y_old_girl_laying-on_bed.png';
    } else {
      return 'assets/img/10yr_old_boy_laying_on_bed.png';
    }
  }

  startBedtimeGame(): void {
    this.currentPlayer = this.bedtimePlayer;
    this.showBedtimeModal = false;
    this.currentView = 'bedtime';
  }

  onBedtimeCompleted(): void {
    const player = this.currentPlayer as 'ANIA' | 'MICHAL';
    this.bedtimeService.incrementBedtimes(player);
  }

  showTeethBrushingImage(player: 'ANIA' | 'MICHAL'): void {
    this.teethPlayer = player;
    this.showTeethModal = true;
  }

  closeTeethModal(): void {
    this.showTeethModal = false;
  }

  getTeethImage(): string {
    if (this.teethPlayer === 'ANIA') {
      return 'assets/img/10yr_old_girl_brushing_teeth.png';
    } else {
      return 'assets/img/10yr_old_boy_brushing_teeth.png';
    }
  }

  startTeethBrushingGame(): void {
    this.currentPlayer = this.teethPlayer;
    this.showTeethModal = false;
    this.currentView = 'teeth';
  }

  onTeethBrushed(): void {
    const player = this.currentPlayer as 'ANIA' | 'MICHAL';
    this.teethBrushingService.incrementTeethBrushed(player);
  }

  showVegetablesImage(player: 'ANIA' | 'MICHAL'): void {
    this.vegetablesPlayer = player;
    this.showVegetablesModal = true;
  }

  closeVegetablesModal(): void {
    this.showVegetablesModal = false;
  }

  getVegetablesImage(): string {
    if (this.vegetablesPlayer === 'ANIA') {
      return 'assets/img/10yr_old_girl_broccoli.png';
    } else {
      return 'assets/img/10yr_old_boy_broccoli.png';
    }
  }

  startVegetablesGame(): void {
    this.currentPlayer = this.vegetablesPlayer;
    this.showVegetablesModal = false;
    this.currentView = 'vegetables';
  }
}
