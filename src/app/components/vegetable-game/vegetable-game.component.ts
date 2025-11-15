import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface FloatingVegetable {
  id: number;
  left: number;
  top: number;
  emoji: string;
  shot: boolean;
  animationDuration: number;
  falling?: boolean;
  fallSpeed?: number;
  isBad?: boolean; // True for bad objects (reduce counter), false for vegetables
}

interface Arrow {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
}

interface Crossbow {
  corner: string;
  x: number;
  y: number;
  angle: number;
  power: number; // 1-10, affects arrow speed
}

@Component({
  selector: 'app-vegetable-game',
  template: `
    <div class="vegetable-game-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">{{ translate('eating_vegetables_game') }} 🥦🏹</h1>
        <div class="score-counter">{{ vegetablesShot }} / {{ targetVegetables }}</div>
      </div>

      <div class="game-instructions">
        <p class="instruction-text">🎯 {{ translate('rotate_and_shoot_instruction') }}</p>
        <p class="warning-text">⚠️ {{ translate('avoid_junk_food') }}</p>
      </div>

      <div class="game-area" *ngIf="!gameCompleted">
        <!-- Crossbows in corners with rotation controls -->
        <div *ngFor="let crossbow of crossbows"
             class="crossbow-container"
             [ngClass]="'position-' + crossbow.corner">
          <div class="crossbow-controls">
            <button class="rotate-btn" (click)="rotateCrossbow(crossbow, -15)">⟲</button>
            <div class="crossbow"
                 [class.active]="activeCrossbowCorner === crossbow.corner"
                 [class.selected]="selectedCrossbow === crossbow"
                 [style.transform]="'rotate(' + (crossbow.angle + CROSSBOW_VISUAL_OFFSET) + 'deg)'"
                 (click)="toggleSelectCrossbow(crossbow)">
              🏹
            </div>
            <button class="rotate-btn" (click)="rotateCrossbow(crossbow, 15)">⟳</button>
          </div>
          <button class="shoot-from-selected-btn"
                  *ngIf="selectedCrossbow === crossbow"
                  (click)="shootFromSelected($event)">
            🎯 {{ translate('shoot') }}
          </button>
          <div class="power-control">
            <label>💪 {{ translate('power') }}:</label>
            <input type="range"
                   min="1"
                   max="10"
                   [(ngModel)]="crossbow.power"
                   class="power-slider">
            <span class="power-value">{{ crossbow.power }}</span>
          </div>
        </div>

        <!-- Flying arrows -->
        <div *ngFor="let arrow of arrows"
             class="arrow"
             [style.left.px]="arrow.x"
             [style.top.px]="arrow.y"
             [style.transform]="'rotate(' + arrow.angle + 'deg)'">
          ➤
        </div>

        <!-- Floating Vegetables -->
        <div *ngFor="let vegetable of vegetables"
             class="floating-vegetable"
             [class.shot]="vegetable.shot"
             [class.falling]="vegetable.falling"
             [class.bad-object]="vegetable.isBad"
             [style.left.%]="vegetable.left"
             [style.top.%]="vegetable.top"
             [style.animation-duration.s]="vegetable.animationDuration">
          <span class="vegetable-emoji">{{ vegetable.emoji }}</span>
          <span class="fire-effect" *ngIf="vegetable.shot && !vegetable.isBad">🔥</span>
          <span class="bad-effect" *ngIf="vegetable.shot && vegetable.isBad">💢</span>
        </div>
      </div>

      <!-- Success Screen -->
      <div class="success-screen" *ngIf="gameCompleted">
        <div class="success-content">
          <div class="success-icon">🎯🏹🥦🥕🌽</div>
          <h2 class="success-title">{{ translate('excellent_work') }}</h2>
          <p class="success-message">You shot {{ vegetablesShot }} vegetables!</p>
          <p class="success-message">Great shooting skills! 🎯</p>
          <div class="success-actions">
            <button class="action-btn play-again-btn" (click)="playAgain()">
              {{ translate('play_vegetable_game') }} 🔄
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
    .vegetable-game-container {
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .ania-theme {
      background: linear-gradient(135deg, #ff6b9d 0%, #ffa5c8 100%);
    }

    .michal-theme {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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
      margin-bottom: 20px;
      position: relative;
      z-index: 10;
    }

    .game-title {
      font-size: 48px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 0 0 10px 0;
    }

    .game-instructions {
      text-align: center;
      margin: 20px auto;
      max-width: 900px;
    }

    .instruction-text {
      font-size: 22px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin: 8px 0;
      background: rgba(0, 0, 0, 0.4);
      padding: 12px 25px;
      border-radius: 15px;
      display: inline-block;
    }

    .warning-text {
      font-size: 20px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      margin: 8px 0;
      background: rgba(255, 87, 34, 0.6);
      border: 2px solid #ff5722;
      padding: 12px 25px;
      border-radius: 15px;
      display: inline-block;
      font-weight: bold;
    }

    .score-counter {
      font-size: 32px;
      color: #ffeb3b;
      background: rgba(0, 0, 0, 0.5);
      display: inline-block;
      padding: 10px 30px;
      border-radius: 20px;
      font-weight: bold;
      border: 2px solid #ffeb3b;
    }

    .game-area {
      position: relative;
      height: 550px;
      margin: 0 auto;
      max-width: 1000px;
      border: 3px solid rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
    }

    .crossbow-container {
      position: absolute;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .crossbow-container.position-top-left {
      top: 10px;
      left: 10px;
    }

    .crossbow-container.position-top-right {
      top: 10px;
      right: 10px;
    }

    .crossbow-container.position-bottom-left {
      bottom: 10px;
      left: 10px;
    }

    .crossbow-container.position-bottom-right {
      bottom: 10px;
      right: 10px;
    }

    .crossbow-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 5px 10px;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .crossbow {
      font-size: 50px;
      transition: all 0.2s ease;
      filter: drop-shadow(0 0 10px rgba(255, 235, 59, 0.8));
      cursor: pointer;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .crossbow.selected {
      filter: drop-shadow(0 0 20px rgba(76, 175, 80, 1));
      animation: pulse-selected 1.5s ease-in-out infinite;
      transform: scale(1.1);
    }

    @keyframes pulse-selected {
      0%, 100% {
        filter: drop-shadow(0 0 20px rgba(76, 175, 80, 1));
      }
      50% {
        filter: drop-shadow(0 0 30px rgba(76, 175, 80, 1));
      }
    }

    .crossbow.active {
      animation: crossbowFire 0.3s ease;
    }

    @keyframes crossbowFire {
      0% {
        filter: drop-shadow(0 0 10px rgba(255, 235, 59, 0.8));
      }
      50% {
        filter: drop-shadow(0 0 30px rgba(255, 100, 0, 1)) brightness(1.5);
      }
      100% {
        filter: drop-shadow(0 0 10px rgba(255, 235, 59, 0.8));
      }
    }

    .shoot-from-selected-btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 4px 10px rgba(76, 175, 80, 0.4);
      animation: glow-shoot-btn 1.5s ease-in-out infinite;
    }

    @keyframes glow-shoot-btn {
      0%, 100% {
        box-shadow: 0 4px 10px rgba(76, 175, 80, 0.4);
      }
      50% {
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.8);
      }
    }

    .shoot-from-selected-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 15px rgba(76, 175, 80, 0.6);
    }

    .shoot-from-selected-btn:active {
      transform: scale(0.95);
    }

    .rotate-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .rotate-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }

    .rotate-btn:active {
      transform: scale(0.95);
    }

    .shoot-btn {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 8px 16px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Quicksand', sans-serif;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .shoot-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }

    .shoot-btn:active {
      transform: scale(0.95);
    }

    .angle-display {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 6px 12px;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      font-size: 14px;
      font-weight: bold;
    }

    .angle-label {
      color: #666;
    }

    .angle-value {
      color: #667eea;
      font-size: 16px;
      min-width: 45px;
      text-align: center;
    }

    .power-control {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 12px;
      border-radius: 15px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .power-control label {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .power-slider {
      width: 100px;
      height: 6px;
      border-radius: 3px;
      outline: none;
      -webkit-appearance: none;
      background: linear-gradient(to right, #4CAF50 0%, #FFC107 50%, #F44336 100%);
    }

    .power-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: 3px solid #667eea;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .power-slider::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: 3px solid #667eea;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    }

    .power-value {
      font-size: 16px;
      font-weight: bold;
      color: #667eea;
      min-width: 25px;
      text-align: center;
    }

    .arrow {
      position: absolute;
      font-size: 30px;
      color: #8B4513;
      z-index: 60;
      pointer-events: none;
      filter: drop-shadow(0 0 5px rgba(139, 69, 19, 0.8));
      transition: all 0.05s linear;
    }

    .floating-vegetable {
      position: absolute;
      font-size: 45px;
      animation: float linear infinite;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
      transition: all 0.2s ease;
      z-index: 40;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .floating-vegetable.shot {
      animation: none !important;
      pointer-events: none;
    }

    .floating-vegetable.bad-object {
      filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.7));
      animation: pulse-red 2s ease-in-out infinite;
    }

    @keyframes pulse-red {
      0%, 100% {
        filter: drop-shadow(0 0 15px rgba(255, 0, 0, 0.7));
      }
      50% {
        filter: drop-shadow(0 0 25px rgba(255, 0, 0, 1));
      }
    }

    .floating-vegetable.falling {
      animation: fall-down 1s ease-in forwards;
      filter: brightness(0.5) drop-shadow(0 0 20px rgba(255, 100, 0, 0.8));
    }

    .floating-vegetable.bad-object.falling {
      filter: brightness(0.5) drop-shadow(0 0 20px rgba(128, 0, 128, 0.8));
    }

    .vegetable-emoji {
      position: relative;
      z-index: 1;
    }

    .fire-effect {
      position: absolute;
      font-size: 40px;
      animation: burn 0.3s ease-out infinite;
      z-index: 2;
    }

    .bad-effect {
      position: absolute;
      font-size: 40px;
      animation: bad-hit 0.3s ease-out infinite;
      z-index: 2;
    }

    @keyframes burn {
      0%, 100% {
        transform: scale(1) rotate(-10deg);
        opacity: 1;
      }
      50% {
        transform: scale(1.3) rotate(10deg);
        opacity: 0.8;
      }
    }

    @keyframes bad-hit {
      0%, 100% {
        transform: scale(1) rotate(-15deg);
        opacity: 1;
      }
      50% {
        transform: scale(1.4) rotate(15deg);
        opacity: 0.9;
      }
    }

    @keyframes fall-down {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(600px) rotate(720deg);
        opacity: 0;
      }
    }

    @keyframes float {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
      }
      25% {
        transform: translateY(-30px) translateX(20px) rotate(90deg);
      }
      50% {
        transform: translateY(-60px) translateX(0) rotate(180deg);
      }
      75% {
        transform: translateY(-30px) translateX(-20px) rotate(270deg);
      }
      100% {
        transform: translateY(0) translateX(0) rotate(360deg);
      }
    }


    .success-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 107, 157, 0.95), rgba(255, 165, 200, 0.95));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    }

    .michal-theme .success-screen {
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.95), rgba(0, 242, 254, 0.95));
    }

    .success-content {
      background: white;
      border: 3px solid #ffeb3b;
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
      animation: bounce 1s ease infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .success-title {
      font-size: 48px;
      color: #4CAF50;
      margin: 0 0 15px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    .success-message {
      font-size: 24px;
      color: #666;
      margin: 10px 0;
    }

    .success-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
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
export class VegetableGameComponent implements OnInit, OnDestroy {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();
  @Output() vegetablesCompleted = new EventEmitter<void>();

  vegetables: FloatingVegetable[] = [];
  arrows: Arrow[] = [];
  crossbows: Crossbow[] = [];
  vegetablesShot: number = 0;
  targetVegetables: number = 20;
  gameCompleted: boolean = false;
  nextVegetableId: number = 0;
  nextArrowId: number = 0;
  spawnInterval: any;
  arrowUpdateInterval: any;
  activeCrossbowCorner: string = '';
  selectedCrossbow: Crossbow | null = null;

  vegetableEmojis: string[] = ['🥕', '🥦', '🌽', '🍅', '🥒', '🌶️', '🧄', '🧅', '🥬', '🍆'];
  badObjectEmojis: string[] = ['🍭', '🍬', '🍫', '🍩', '🍰', '🍪', '🧁', '🍦', '🍔', '🍕']; // Candy and junk food

  // Game area dimensions
  readonly GAME_WIDTH = 1000;
  readonly GAME_HEIGHT = 550;
  readonly ARROW_SPEED = 5; // pixels per frame
  readonly ARROW_SIZE = 30;
  readonly VEGETABLE_SIZE = 45; // Reduced from 60 for harder difficulty
  readonly CROSSBOW_VISUAL_OFFSET = 40; // Offset to align crossbow emoji with arrow direction

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.startGame();
  }

  ngOnDestroy(): void {
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
    if (this.arrowUpdateInterval) {
      clearInterval(this.arrowUpdateInterval);
    }
  }

  startGame(): void {
    this.vegetables = [];
    this.arrows = [];
    this.vegetablesShot = 0;
    this.gameCompleted = false;
    this.nextVegetableId = 0;
    this.nextArrowId = 0;

    // Initialize crossbows (angles in degrees: 0=right, 90=down, 180=left, -90=up)
    this.crossbows = [
      { corner: 'top-left', x: 80, y: 80, angle: 0, power: 5 },      // Start pointing right
      { corner: 'top-right', x: this.GAME_WIDTH - 80, y: 80, angle: 180, power: 5 }, // Start pointing left
      { corner: 'bottom-left', x: 80, y: this.GAME_HEIGHT - 80, angle: 0, power: 5 }, // Start pointing right
      { corner: 'bottom-right', x: this.GAME_WIDTH - 80, y: this.GAME_HEIGHT - 80, angle: 180, power: 5 } // Start pointing left
    ];

    // Spawn vegetables periodically
    this.spawnInterval = setInterval(() => {
      if (!this.gameCompleted && this.vegetables.filter(v => !v.shot).length < 10) {
        this.spawnVegetable();
      }
    }, 2000);

    // Update arrow positions
    this.arrowUpdateInterval = setInterval(() => {
      this.updateArrows();
    }, 50); // 20 FPS

    // Spawn initial vegetables
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.spawnVegetable(), i * 400);
    }
  }

  spawnVegetable(): void {
    // 20% chance to spawn a bad object
    const isBad = Math.random() < 0.2;
    const emojiArray = isBad ? this.badObjectEmojis : this.vegetableEmojis;

    const vegetable: FloatingVegetable = {
      id: this.nextVegetableId++,
      left: Math.random() * 70 + 15, // 15% to 85%
      top: Math.random() * 60 + 20, // 20% to 80%
      emoji: emojiArray[Math.floor(Math.random() * emojiArray.length)],
      shot: false,
      animationDuration: Math.random() * 3 + 4, // 4-7 seconds (faster movement)
      isBad: isBad
    };
    this.vegetables.push(vegetable);

    // Remove vegetable after animation completes if not shot
    setTimeout(() => {
      const index = this.vegetables.findIndex(v => v.id === vegetable.id);
      if (index !== -1 && !this.vegetables[index].shot) {
        this.vegetables.splice(index, 1);
      }
    }, vegetable.animationDuration * 1000 + 1000);
  }

  rotateCrossbow(crossbow: Crossbow, degrees: number): void {
    crossbow.angle += degrees;
    // Normalize angle to -180 to 180
    if (crossbow.angle > 180) crossbow.angle -= 360;
    if (crossbow.angle < -180) crossbow.angle += 360;
  }

  toggleSelectCrossbow(crossbow: Crossbow): void {
    if (this.selectedCrossbow === crossbow) {
      // Deselect if clicking the same crossbow
      this.selectedCrossbow = null;
    } else {
      // Select the crossbow
      this.selectedCrossbow = crossbow;
    }
  }

  shootFromSelected(event: MouseEvent): void {
    if (this.selectedCrossbow) {
      this.shootArrow(this.selectedCrossbow, event);
    }
  }

  shootArrow(crossbow: Crossbow, event: MouseEvent): void {
    if (this.gameCompleted) return;

    // Activate crossbow animation
    this.activeCrossbowCorner = crossbow.corner;
    setTimeout(() => {
      this.activeCrossbowCorner = '';
    }, 300);

    // Get the actual crossbow element position
    const button = event.currentTarget as HTMLElement;
    const container = button.closest('.crossbow-container') as HTMLElement;
    const crossbowElement = container?.querySelector('.crossbow') as HTMLElement;
    const gameArea = container?.closest('.game-area') as HTMLElement;

    if (!crossbowElement || !gameArea) return;

    // Get positions relative to game area
    const gameRect = gameArea.getBoundingClientRect();
    const crossbowRect = crossbowElement.getBoundingClientRect();

    // Calculate center of crossbow relative to game area
    const startX = crossbowRect.left - gameRect.left + crossbowRect.width / 2;
    const startY = crossbowRect.top - gameRect.top + crossbowRect.height / 2;

    // Calculate arrow velocity based on angle and power
    const angleRad = (crossbow.angle * Math.PI) / 180;
    const speed = this.ARROW_SPEED * (crossbow.power / 5); // Scale speed by power

    const arrow: Arrow = {
      id: this.nextArrowId++,
      x: startX,
      y: startY,
      angle: crossbow.angle,
      velocityX: Math.cos(angleRad) * speed,
      velocityY: Math.sin(angleRad) * speed,
      active: true
    };

    this.arrows.push(arrow);
  }

  updateArrows(): void {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const arrow = this.arrows[i];

      if (!arrow.active) continue;

      // Update arrow position
      arrow.x += arrow.velocityX;
      arrow.y += arrow.velocityY;

      // Check collision with vegetables - returns true if arrow hit something
      const hitSomething = this.checkArrowCollisions(arrow);

      // Remove arrow if it hit something or goes out of bounds
      if (hitSomething ||
          arrow.x < -50 || arrow.x > this.GAME_WIDTH + 50 ||
          arrow.y < -50 || arrow.y > this.GAME_HEIGHT + 50) {
        this.arrows.splice(i, 1);
      }
    }
  }

  checkArrowCollisions(arrow: Arrow): boolean {
    for (const vegetable of this.vegetables) {
      if (vegetable.shot) continue;

      // Calculate vegetable position in pixels
      const vegX = (vegetable.left / 100) * this.GAME_WIDTH;
      const vegY = (vegetable.top / 100) * this.GAME_HEIGHT;

      // Check collision (simple circular collision)
      const distance = Math.sqrt(
        Math.pow(arrow.x - vegX, 2) + Math.pow(arrow.y - vegY, 2)
      );

      const hitRadius = (this.ARROW_SIZE + this.VEGETABLE_SIZE) / 2;

      if (distance < hitRadius) {
        // Hit detected!
        vegetable.shot = true;
        vegetable.falling = true;

        // Check if it's a bad object
        if (vegetable.isBad) {
          // Hitting bad object reduces score by 2
          this.vegetablesShot = Math.max(0, this.vegetablesShot - 2);
        } else {
          // Hitting vegetable increases score
          this.vegetablesShot++;
        }

        // Remove vegetable after falling animation
        setTimeout(() => {
          const index = this.vegetables.findIndex(v => v.id === vegetable.id);
          if (index !== -1) {
            this.vegetables.splice(index, 1);
          }
        }, 1000);

        // Check for game completion
        if (this.vegetablesShot >= this.targetVegetables) {
          clearInterval(this.spawnInterval);
          clearInterval(this.arrowUpdateInterval);
          setTimeout(() => {
            this.gameCompleted = true;
            this.vegetablesCompleted.emit();
          }, 500);
        }

        // Arrow hit something, return true to remove it
        return true;
      }
    }

    // Arrow didn't hit anything
    return false;
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
