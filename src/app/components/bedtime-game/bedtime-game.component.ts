import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface FallingStar {
  id: number;
  left: number;
  top: number;
  caught: boolean;
  animationDuration: number;
}

@Component({
  selector: 'app-bedtime-game',
  template: `
    <div class="bedtime-game-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">{{ translate('catch_the_stars') }} ⭐</h1>
        <p class="game-instruction">{{ translate('catch_stars_instruction') }}</p>
        <div class="stars-counter">{{ starsCaught }} / {{ targetStars }}</div>
      </div>

      <div class="game-area" *ngIf="!gameCompleted">
        <!-- Moon in the corner -->
        <div class="moon">🌙</div>

        <!-- Falling Stars -->
        <div *ngFor="let star of stars"
             class="falling-star"
             [class.caught]="star.caught"
             [style.left.%]="star.left"
             [style.top.%]="star.top"
             [style.animation-duration.s]="star.animationDuration"
             (click)="catchStar(star)">
          ⭐
        </div>

        <!-- Calming message -->
        <div class="calming-message">
          <div class="breathing-circle"></div>
          <p>Relax and catch the stars... 💫</p>
        </div>
      </div>

      <!-- Success Screen -->
      <div class="success-screen" *ngIf="gameCompleted">
        <div class="success-content">
          <div class="success-icon">🌟✨🌙✨🌟</div>
          <h2 class="success-title">{{ translate('sleep_well') }}</h2>
          <p class="success-message">{{ translate('ready_for_bed') }}</p>
          <div class="goodnight-animation">😴💤</div>
          <div class="success-actions">
            <button class="action-btn play-again-btn" (click)="playAgain()">
              {{ translate('play_bedtime_game') }} 🔄
            </button>
            <button class="action-btn menu-btn" (click)="goBack()">
              {{ translate('back_to_menu') }} 🏠
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bedtime-game-container {
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .ania-theme {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    }

    .michal-theme {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .back-button {
      background: white;
      border: none;
      border-radius: 25px;
      padding: 12px 24px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      margin-bottom: 20px;
      z-index: 100;
      position: relative;
    }

    .back-button:hover {
      transform: scale(1.05);
    }

    .game-header {
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      z-index: 10;
    }

    .game-title {
      font-size: 48px;
      color: #ffd700;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
      margin: 0 0 10px 0;
      animation: glow 2s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% {
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.5);
      }
      50% {
        text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.8);
      }
    }

    .game-instruction {
      font-size: 24px;
      color: #e0e0e0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin: 0 0 20px 0;
    }

    .stars-counter {
      font-size: 32px;
      color: #ffd700;
      background: rgba(0, 0, 0, 0.5);
      display: inline-block;
      padding: 10px 30px;
      border-radius: 20px;
      font-weight: bold;
      border: 2px solid #ffd700;
    }

    .game-area {
      position: relative;
      height: 500px;
      margin: 0 auto;
      max-width: 900px;
    }

    .moon {
      position: absolute;
      top: 20px;
      right: 50px;
      font-size: 80px;
      animation: moonGlow 3s ease-in-out infinite;
      filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
    }

    @keyframes moonGlow {
      0%, 100% {
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
      }
      50% {
        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.8));
      }
    }

    .falling-star {
      position: absolute;
      font-size: 50px;
      cursor: pointer;
      animation: fall linear infinite;
      filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
      transition: all 0.3s ease;
      z-index: 50;
    }

    .falling-star:hover {
      transform: scale(1.3) rotate(180deg);
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1));
    }

    .falling-star.caught {
      animation: catch 0.5s ease-out forwards;
      pointer-events: none;
    }

    @keyframes fall {
      0% {
        transform: translateY(-100px) rotate(0deg);
      }
      100% {
        transform: translateY(600px) rotate(360deg);
      }
    }

    @keyframes catch {
      0% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
      50% {
        transform: scale(2) rotate(180deg);
        opacity: 0.8;
      }
      100% {
        transform: scale(0) rotate(360deg);
        opacity: 0;
      }
    }

    .calming-message {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      z-index: 10;
    }

    .breathing-circle {
      width: 100px;
      height: 100px;
      margin: 0 auto 20px;
      background: radial-gradient(circle, rgba(135, 206, 250, 0.4), rgba(135, 206, 250, 0.1));
      border-radius: 50%;
      animation: breathe 4s ease-in-out infinite;
    }

    @keyframes breathe {
      0%, 100% {
        transform: scale(1);
        opacity: 0.6;
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
      }
    }

    .calming-message p {
      color: #87CEEB;
      font-size: 20px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin: 0;
    }

    .success-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(44, 62, 80, 0.95));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    }

    .success-content {
      background: linear-gradient(135deg, #2c3e50, #34495e);
      border: 3px solid #ffd700;
      border-radius: 30px;
      padding: 50px;
      text-align: center;
      max-width: 500px;
      animation: zoomIn 0.5s ease;
    }

    @keyframes zoomIn {
      from {
        transform: scale(0.5);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .success-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: twinkle 1.5s ease infinite;
    }

    @keyframes twinkle {
      0%, 100% {
        opacity: 0.8;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }

    .success-title {
      font-size: 48px;
      color: #ffd700;
      margin: 0 0 15px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .success-message {
      font-size: 24px;
      color: #e0e0e0;
      margin: 0 0 30px 0;
    }

    .goodnight-animation {
      font-size: 60px;
      margin-bottom: 30px;
      animation: sleep 2s ease-in-out infinite;
    }

    @keyframes sleep {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .success-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .action-btn {
      padding: 15px 30px;
      border: none;
      border-radius: 15px;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
    }

    .play-again-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .menu-btn {
      background: #f0f0f0;
      color: #333;
    }

    .action-btn:hover {
      transform: scale(1.1);
    }
  `]
})
export class BedtimeGameComponent implements OnInit, OnDestroy {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();
  @Output() bedtimeCompleted = new EventEmitter<void>();

  stars: FallingStar[] = [];
  starsCaught: number = 0;
  targetStars: number = 15;
  gameCompleted: boolean = false;
  nextStarId: number = 0;
  spawnInterval: any;

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
  }

  startGame(): void {
    this.stars = [];
    this.starsCaught = 0;
    this.gameCompleted = false;
    this.nextStarId = 0;

    // Spawn stars periodically
    this.spawnInterval = setInterval(() => {
      if (!this.gameCompleted && this.stars.filter(s => !s.caught).length < 8) {
        this.spawnStar();
      }
    }, 1500);

    // Spawn initial stars
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.spawnStar(), i * 500);
    }
  }

  spawnStar(): void {
    const star: FallingStar = {
      id: this.nextStarId++,
      left: Math.random() * 85 + 5, // 5% to 90%
      top: -10,
      caught: false,
      animationDuration: Math.random() * 3 + 4 // 4-7 seconds
    };
    this.stars.push(star);

    // Remove star after it falls off screen
    setTimeout(() => {
      const index = this.stars.findIndex(s => s.id === star.id);
      if (index !== -1 && !this.stars[index].caught) {
        this.stars.splice(index, 1);
      }
    }, star.animationDuration * 1000 + 1000);
  }

  catchStar(star: FallingStar): void {
    if (!star.caught) {
      star.caught = true;
      this.starsCaught++;

      if (this.starsCaught >= this.targetStars) {
        clearInterval(this.spawnInterval);
        setTimeout(() => {
          this.gameCompleted = true;
          this.bedtimeCompleted.emit();
        }, 500);
      }
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  playAgain(): void {
    this.startGame();
  }

  goBack(): void {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    this.backToHome.emit();
  }
}
