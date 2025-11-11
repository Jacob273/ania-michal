import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-vegetable-game',
  template: `
    <div class="vegetable-game-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">{{ translate('eating_vegetables_game') }} 🥦🏹</h1>
        <p class="coming-soon">Coming Soon!</p>
      </div>

      <div class="placeholder-content">
        <div class="vegetables-icons">
          🥕 🥦 🌽 🍅 🥒 🫑
        </div>
        <div class="crossbow-icon">🏹</div>
        <p class="description">
          Get ready to shoot vegetables with your crossbow!<br>
          This exciting game is coming soon...
        </p>
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .ania-theme {
      background: linear-gradient(135deg, #ff6b9d 0%, #ffa5c8 100%);
    }

    .michal-theme {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .back-button {
      position: absolute;
      top: 20px;
      left: 20px;
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
    }

    .back-button:hover {
      transform: scale(1.05);
    }

    .game-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .game-title {
      font-size: 56px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 0 0 20px 0;
    }

    .coming-soon {
      font-size: 32px;
      color: #ffeb3b;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      font-weight: bold;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }

    .placeholder-content {
      background: white;
      border-radius: 30px;
      padding: 60px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
      max-width: 600px;
    }

    .vegetables-icons {
      font-size: 80px;
      margin-bottom: 30px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    .crossbow-icon {
      font-size: 100px;
      margin: 20px 0;
      animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .description {
      font-size: 24px;
      color: #666;
      line-height: 1.6;
      margin: 20px 0 0 0;
    }
  `]
})
export class VegetableGameComponent {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  goBack(): void {
    this.backToHome.emit();
  }
}
