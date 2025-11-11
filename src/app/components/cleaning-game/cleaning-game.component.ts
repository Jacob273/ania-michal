import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface CleaningItem {
  id: number;
  emoji: string;
  name: string;
  left: number;
  top: number;
  collected: boolean;
}

@Component({
  selector: 'app-cleaning-game',
  template: `
    <div class="cleaning-game-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">{{ translate('clean_my_room') }} 🧹</h1>
        <p class="game-instruction">{{ translate('drag_items') }}</p>
        <div class="items-counter">{{ collectedCount }} / {{ items.length }}</div>
      </div>

      <div class="game-area" *ngIf="!gameCompleted">
        <!-- Cleaning Items -->
        <div *ngFor="let item of items"
             class="cleaning-item"
             [class.collected]="item.collected"
             [class.dragging]="item.id === touchedItemId"
             [style.left.%]="item.left"
             [style.top.%]="item.top"
             draggable="true"
             (dragstart)="onDragStart($event, item)"
             (dragend)="onDragEnd($event)"
             (touchstart)="onTouchStart($event, item)"
             (touchmove)="onTouchMove($event, item)"
             (touchend)="onTouchEnd($event, item)">
          <span class="item-emoji">{{ item.emoji }}</span>
        </div>

        <!-- Collection Box -->
        <div class="collection-box"
             (dragover)="onDragOver($event)"
             (drop)="onDrop($event)">
          <div class="box-icon">📦</div>
          <div class="box-label">{{ translate('drag_items') }}</div>
        </div>
      </div>

      <!-- Success Screen -->
      <div class="success-screen" *ngIf="gameCompleted">
        <div class="success-content">
          <div class="success-icon">⭐✨🎉✨⭐</div>
          <h2 class="success-title">{{ translate('great_job') }}</h2>
          <p class="success-message">{{ translate('room_is_clean') }}</p>
          <div class="success-actions">
            <button class="action-btn play-again-btn" (click)="playAgain()">
              {{ translate('clean_again') }} 🔄
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
    .cleaning-game-container {
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Comic Sans MS', cursive;
      position: relative;
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
      font-family: 'Comic Sans MS', cursive;
      margin-bottom: 20px;
    }

    .back-button:hover {
      transform: scale(1.05);
    }

    .game-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .game-title {
      font-size: 48px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 0 0 10px 0;
    }

    .game-instruction {
      font-size: 24px;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin: 0 0 20px 0;
    }

    .items-counter {
      font-size: 32px;
      color: white;
      background: rgba(0, 0, 0, 0.3);
      display: inline-block;
      padding: 10px 30px;
      border-radius: 20px;
      font-weight: bold;
    }

    .game-area {
      position: relative;
      height: 500px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      margin: 0 auto;
      max-width: 900px;
      overflow: hidden;
    }

    .cleaning-item {
      position: absolute;
      font-size: 60px;
      cursor: grab;
      transition: all 0.3s ease;
      animation: float 3s ease-in-out infinite;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }

    .cleaning-item:active {
      cursor: grabbing;
    }

    .cleaning-item.dragging {
      opacity: 0.8;
      transform: scale(1.3);
      z-index: 1000;
      animation: none;
      transition: none;
    }

    .cleaning-item.collected {
      opacity: 0;
      pointer-events: none;
    }

    .cleaning-item:hover {
      transform: scale(1.2);
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-10px) rotate(5deg);
      }
    }

    .item-emoji {
      display: block;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
    }

    .collection-box {
      position: absolute;
      bottom: 30px;
      right: 30px;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.9);
      border: 5px dashed #666;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .collection-box.drag-over {
      background: rgba(255, 255, 100, 0.9);
      border-color: #ff6b9d;
      transform: scale(1.1);
    }

    .box-icon {
      font-size: 60px;
    }

    .box-label {
      font-size: 14px;
      color: #666;
      text-align: center;
      margin-top: 5px;
    }

    .success-screen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.5s ease;
    }

    .success-content {
      background: white;
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
      color: #333;
      margin: 0 0 15px 0;
    }

    .success-message {
      font-size: 24px;
      color: #666;
      margin: 0 0 40px 0;
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
      font-family: 'Comic Sans MS', cursive;
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
export class CleaningGameComponent implements OnInit {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();
  @Output() roomCleaned = new EventEmitter<void>();

  items: CleaningItem[] = [];
  collectedCount: number = 0;
  gameCompleted: boolean = false;
  draggedItem: CleaningItem | null = null;
  touchedItemId: number | null = null;
  gameAreaRect: DOMRect | null = null;
  initialTouchOffset = { x: 0, y: 0 };

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame(): void {
    this.items = [
      { id: 1, emoji: '👕', name: 'shirt', left: 15, top: 20, collected: false },
      { id: 2, emoji: '🧦', name: 'socks', left: 45, top: 15, collected: false },
      { id: 3, emoji: '📚', name: 'books', left: 70, top: 25, collected: false },
      { id: 4, emoji: '🎮', name: 'gamepad', left: 25, top: 60, collected: false },
      { id: 5, emoji: '🧸', name: 'teddy', left: 60, top: 65, collected: false }
    ];
    this.collectedCount = 0;
    this.gameCompleted = false;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  onDragStart(event: DragEvent, item: CleaningItem): void {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(event: DragEvent): void {
    this.draggedItem = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    const box = event.currentTarget as HTMLElement;
    box.classList.add('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const box = event.currentTarget as HTMLElement;
    box.classList.remove('drag-over');

    if (this.draggedItem && !this.draggedItem.collected) {
      this.draggedItem.collected = true;
      this.collectedCount++;

      if (this.collectedCount === this.items.length) {
        setTimeout(() => {
          this.gameCompleted = true;
          this.roomCleaned.emit();
        }, 500);
      }
    }
  }

  playAgain(): void {
    this.initializeGame();
  }

  // Touch event handlers for tablets/touchscreens
  onTouchStart(event: TouchEvent, item: CleaningItem): void {
    if (item.collected) return;

    event.preventDefault();
    this.touchedItemId = item.id;

    const touch = event.touches[0];
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Store the offset between touch point and item position
    this.initialTouchOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };

    // Get game area dimensions
    const gameArea = document.querySelector('.game-area') as HTMLElement;
    if (gameArea) {
      this.gameAreaRect = gameArea.getBoundingClientRect();
    }
  }

  onTouchMove(event: TouchEvent, item: CleaningItem): void {
    if (item.collected || this.touchedItemId !== item.id) return;

    event.preventDefault();

    if (!this.gameAreaRect) return;

    const touch = event.touches[0];

    // Calculate new position relative to game area
    const newLeft = ((touch.clientX - this.gameAreaRect.left - this.initialTouchOffset.x) / this.gameAreaRect.width) * 100;
    const newTop = ((touch.clientY - this.gameAreaRect.top - this.initialTouchOffset.y) / this.gameAreaRect.height) * 100;

    // Update item position (constrain within bounds)
    item.left = Math.max(0, Math.min(90, newLeft));
    item.top = Math.max(0, Math.min(90, newTop));
  }

  onTouchEnd(event: TouchEvent, item: CleaningItem): void {
    if (item.collected || this.touchedItemId !== item.id) return;

    event.preventDefault();
    this.touchedItemId = null;

    // Check if item was dropped on the collection box
    const boxElement = document.querySelector('.collection-box') as HTMLElement;
    if (!boxElement || !this.gameAreaRect) return;

    const boxRect = boxElement.getBoundingClientRect();
    const touch = event.changedTouches[0];

    // Check collision
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    if (touchX >= boxRect.left && touchX <= boxRect.right &&
        touchY >= boxRect.top && touchY <= boxRect.bottom) {
      // Item dropped in box
      item.collected = true;
      this.collectedCount++;

      if (this.collectedCount === this.items.length) {
        setTimeout(() => {
          this.gameCompleted = true;
          this.roomCleaned.emit();
        }, 500);
      }
    }
  }

  goBack(): void {
    this.backToHome.emit();
  }
}
