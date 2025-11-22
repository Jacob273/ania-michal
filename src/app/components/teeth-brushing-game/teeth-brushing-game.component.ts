import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface Tooth {
  id: number;
  row: 'top' | 'bottom';
  position: number;
  cleanliness: number; // 0 = dirty, 100 = clean
}

@Component({
  selector: 'app-teeth-brushing-game',
  template: `
    <div class="teeth-game-container" [class.ania-theme]="playerName === 'ANIA'" [class.nadia-theme]="playerName === 'NADIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">{{ translate('brush_your_teeth') }} 🦷</h1>
        <p class="game-instruction" *ngIf="gameState === 'apply-paste'">
          {{ translate('squeeze_toothpaste') }}
        </p>
        <p class="game-instruction" *ngIf="gameState === 'brushing'">
          {{ translate('brush_teeth_instruction') }}
        </p>
        <p class="game-instruction warning" *ngIf="gameState === 'need-rinse' && !tapRunning">
          {{ translate('rinse_brush') }} - {{ translate('click_tap_to_start') }}
        </p>
        <p class="game-instruction warning" *ngIf="gameState === 'need-rinse' && tapRunning">
          {{ translate('drag_brush_to_water') }} 💧
        </p>
      </div>

      <div class="game-area" *ngIf="!gameComplete">
        <!-- Stats Display -->
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">{{ translate('teeth_cleaned') }}:</span>
            <span class="stat-value">{{ cleanedTeethCount }} / 28</span>
          </div>
          <div class="stat">
            <span class="stat-label">{{ translate('brush_cleanliness') }}:</span>
            <div class="brush-meter">
              <div class="brush-meter-fill" [style.width.%]="brushCleanliness"></div>
            </div>
          </div>
        </div>

        <!-- Teeth Display -->
        <div class="teeth-container">
          <!-- Top Teeth -->
          <div class="teeth-row top-teeth">
            <div class="row-label">{{ translate('top_teeth') }}</div>
            <div class="teeth-grid">
              <div *ngFor="let tooth of topTeeth"
                   class="tooth"
                   [class.dirty]="tooth.cleanliness < 50"
                   [class.clean]="tooth.cleanliness >= 100"
                   [class.partially-clean]="tooth.cleanliness >= 50 && tooth.cleanliness < 100"
                   [attr.data-tooth-id]="tooth.id"
                   (mouseenter)="brushTooth(tooth)"
                   (touchmove)="handleTouchBrush($event)">
                <div class="tooth-shine" *ngIf="tooth.cleanliness >= 100">✨</div>
              </div>
            </div>
          </div>

          <!-- Bottom Teeth -->
          <div class="teeth-row bottom-teeth">
            <div class="teeth-grid">
              <div *ngFor="let tooth of bottomTeeth"
                   class="tooth"
                   [class.dirty]="tooth.cleanliness < 50"
                   [class.clean]="tooth.cleanliness >= 100"
                   [class.partially-clean]="tooth.cleanliness >= 50 && tooth.cleanliness < 100"
                   [attr.data-tooth-id]="tooth.id"
                   (mouseenter)="brushTooth(tooth)"
                   (touchmove)="handleTouchBrush($event)">
                <div class="tooth-shine" *ngIf="tooth.cleanliness >= 100">✨</div>
              </div>
            </div>
            <div class="row-label">{{ translate('bottom_teeth') }}</div>
          </div>
        </div>

        <!-- Interactive Elements -->
        <div class="tools-area">
          <!-- Toothpaste Tube -->
          <div class="toothpaste-tube"
               *ngIf="gameState === 'apply-paste'"
               [class.squeezing]="isSqueezing"
               (mousedown)="startSqueeze()"
               (mouseup)="endSqueeze()"
               (touchstart)="startSqueeze()"
               (touchend)="endSqueeze()">
            <div class="tube-body">🧴</div>
            <div class="paste-drop" *ngIf="isSqueezing" [style.top.px]="pasteDropY">
              <span class="paste-emoji">💧</span>
            </div>
          </div>

          <!-- Toothbrush -->
          <div class="toothbrush"
               [class.has-paste]="hasPaste"
               [class.dirty-brush]="brushCleanliness < 30"
               [class.can-brush]="gameState === 'brushing'"
               [class.need-rinse]="gameState === 'need-rinse'"
               [class.rinsing]="isRinsing"
               [class.dragging]="isDraggingBrush"
               [style.left.px]="isDraggingBrush ? brushX : null"
               [style.top.px]="isDraggingBrush ? brushY : null"
               (mousedown)="startDragBrush($event)"
               (touchstart)="startDragBrushTouch($event)">
            <div class="brush-handle">🧹</div>
          </div>

          <!-- Water Tap -->
          <div class="water-tap"
               *ngIf="gameState === 'need-rinse'"
               [class.water-running]="tapRunning"
               (click)="toggleTap()">
            <div class="tap-icon">🚰</div>
            <div class="water-stream" *ngIf="tapRunning">💧💧💧</div>
          </div>
        </div>
      </div>

      <!-- Success Screen -->
      <div class="success-screen" *ngIf="gameComplete">
        <div class="success-content">
          <div class="success-icon">😁✨🦷✨😁</div>
          <h2 class="success-title">{{ translate('great_job') }}</h2>
          <p class="success-message">{{ translate('all_teeth_clean') }}</p>
          <div class="success-actions">
            <button class="action-btn play-again-btn" (click)="playAgain()">
              {{ translate('brush_again') }} 🔄
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
    .teeth-game-container {
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

    .nadia-theme {
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
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
      margin: 0;
      padding: 10px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 15px;
      display: inline-block;
    }

    .game-instruction.warning {
      background: rgba(255, 165, 0, 0.8);
      animation: pulse 1s infinite;
    }

    .stats-bar {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 20px;
    }

    .stat {
      background: white;
      padding: 15px 25px;
      border-radius: 15px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-label {
      font-weight: bold;
      color: #666;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }

    .brush-meter {
      width: 150px;
      height: 20px;
      background: #ddd;
      border-radius: 10px;
      overflow: hidden;
    }

    .brush-meter-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff6b6b 0%, #4CAF50 100%);
      transition: width 0.3s ease;
    }

    .teeth-container {
      background: linear-gradient(135deg, #ffb6c1 0%, #ff9eb5 100%);
      border-radius: 50% 50% 40% 40% / 30% 30% 70% 70%;
      padding: 40px 30px 30px 30px;
      margin: 20px auto;
      max-width: 800px;
      box-shadow: inset 0 10px 30px rgba(0, 0, 0, 0.2),
                  0 8px 20px rgba(0, 0, 0, 0.2);
      border: 5px solid #ff85a1;
      position: relative;
    }

    .teeth-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(ellipse at center, rgba(255, 182, 193, 0.3) 0%, transparent 70%);
      border-radius: inherit;
      pointer-events: none;
    }

    .teeth-row {
      margin: 15px 0;
      padding: 15px 10px;
      background: rgba(255, 220, 230, 0.4);
      border-radius: 20px;
      position: relative;
    }

    .teeth-row.top-teeth {
      border-bottom: 3px solid rgba(255, 150, 180, 0.5);
    }

    .teeth-row.bottom-teeth {
      border-top: 3px solid rgba(255, 150, 180, 0.5);
      margin-top: 10px;
    }

    .teeth-row.top-teeth .teeth-grid {
      transform: perspective(400px) rotateX(-5deg);
    }

    .teeth-row.bottom-teeth .teeth-grid {
      transform: perspective(400px) rotateX(5deg);
    }

    .row-label {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin-bottom: 10px;
    }

    .teeth-grid {
      display: grid;
      grid-template-columns: repeat(14, 1fr);
      gap: 8px;
      justify-content: center;
      padding: 10px 5px;
    }

    /* Natural tooth angles - create a curved jaw appearance */
    .teeth-grid .tooth:nth-child(1) { transform: rotate(-15deg) translateY(5px); }
    .teeth-grid .tooth:nth-child(2) { transform: rotate(-10deg) translateY(3px); }
    .teeth-grid .tooth:nth-child(3) { transform: rotate(-7deg) translateY(1px); }
    .teeth-grid .tooth:nth-child(4) { transform: rotate(-4deg); }
    .teeth-grid .tooth:nth-child(5) { transform: rotate(-2deg); }
    .teeth-grid .tooth:nth-child(6) { transform: rotate(-1deg); }
    .teeth-grid .tooth:nth-child(7) { transform: rotate(0deg); }
    .teeth-grid .tooth:nth-child(8) { transform: rotate(0deg); }
    .teeth-grid .tooth:nth-child(9) { transform: rotate(1deg); }
    .teeth-grid .tooth:nth-child(10) { transform: rotate(2deg); }
    .teeth-grid .tooth:nth-child(11) { transform: rotate(4deg); }
    .teeth-grid .tooth:nth-child(12) { transform: rotate(7deg) translateY(1px); }
    .teeth-grid .tooth:nth-child(13) { transform: rotate(10deg) translateY(3px); }
    .teeth-grid .tooth:nth-child(14) { transform: rotate(15deg) translateY(5px); }

    /* Keep hover transform for interactivity */
    .tooth:hover:not(.clean) {
      transform: scale(1.15) !important;
    }

    .tooth {
      width: 40px;
      height: 55px;
      background: #f5f5dc;
      border-radius: 10px 10px 25px 25px;
      border: 3px solid #8B7355;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 -3px 5px rgba(0, 0, 0, 0.1),
                  0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .tooth::before {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 35px;
      height: 12px;
      background: rgba(255, 150, 180, 0.6);
      border-radius: 0 0 10px 10px;
      z-index: -1;
    }

    .tooth.dirty {
      background: linear-gradient(180deg, #D4AF37 0%, #9A7B4F 100%);
      border-color: #654321;
    }

    .tooth.partially-clean {
      background: linear-gradient(180deg, #f5f5dc 0%, #D4AF37 100%);
      border-color: #A0826D;
    }

    .tooth.clean {
      background: linear-gradient(180deg, #ffffff 0%, #f5f5dc 100%);
      border-color: #B0B0B0;
      animation: sparkle 2s infinite;
    }

    .tooth-shine {
      font-size: 16px;
      animation: twinkle 1.5s infinite;
    }

    @keyframes sparkle {
      0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
      50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
    }

    @keyframes twinkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }

    .tools-area {
      position: relative;
      height: 300px;
      margin-top: 30px;
    }

    .toothpaste-tube {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      user-select: none;
      z-index: 10;
    }

    .toothpaste-tube.squeezing {
      animation: squeeze 0.5s ease;
    }

    @keyframes squeeze {
      0%, 100% { transform: translateX(-50%) scale(1); }
      50% { transform: translateX(-50%) scale(0.95, 1.05); }
    }

    .tube-body {
      font-size: 80px;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
    }

    .paste-drop {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
      animation: fall 1s linear;
    }

    @keyframes fall {
      from { top: 80px; opacity: 1; }
      to { top: 250px; opacity: 0.5; }
    }

    .toothbrush {
      position: absolute;
      left: 50%;
      top: 150px;
      transform: translateX(-50%);
      font-size: 80px;
      cursor: move;
      transition: filter 0.3s ease;
      user-select: none;
      z-index: 20;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
    }

    .toothbrush.dragging {
      position: fixed;
      transform: translate(-50%, -50%);
      pointer-events: none; /* Allow brush to pass through for better collision detection */
      z-index: 9999;
    }

    .toothbrush.has-paste::after {
      content: '💙';
      position: absolute;
      top: -10px;
      right: 0;
      font-size: 20px;
    }

    .toothbrush.dirty-brush {
      filter: brightness(0.7) saturate(0.6);
    }

    .toothbrush.can-brush {
      cursor: grab;
      animation: bounce-hint 2s infinite;
    }

    .toothbrush.can-brush.dragging {
      cursor: grabbing;
      animation: none;
    }

    .toothbrush.need-rinse {
      filter: brightness(0.5) sepia(0.8) hue-rotate(-20deg);
      animation: shake 0.5s infinite;
    }

    .toothbrush.rinsing {
      filter: brightness(1.2) saturate(1.3);
      animation: cleaning 0.3s ease infinite;
    }

    @keyframes bounce-hint {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(-50%) rotate(0deg); }
      25% { transform: translateX(-50%) rotate(-5deg); }
      75% { transform: translateX(-50%) rotate(5deg); }
    }

    @keyframes cleaning {
      0%, 100% { transform: rotate(-2deg) scale(1); }
      50% { transform: rotate(2deg) scale(1.05); }
    }

    .water-tap {
      position: absolute;
      top: 50px;
      left: calc(50% + 350px);
      cursor: pointer;
      user-select: none;
      z-index: 15;
    }

    .tap-icon {
      font-size: 70px;
      transition: transform 0.3s ease;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.3));
    }

    .water-tap:hover .tap-icon {
      transform: scale(1.1);
    }

    .water-stream {
      font-size: 30px;
      animation: flow 1s linear infinite;
      position: absolute;
      top: 60px;
      left: 15px;
    }

    @keyframes flow {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0.3; transform: translateY(40px); }
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
      from { transform: scale(0.5); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .success-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: bounce 1s ease infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
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
export class TeethBrushingGameComponent implements OnInit {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();
  @Output() teethBrushed = new EventEmitter<void>();

  gameState: 'apply-paste' | 'brushing' | 'need-rinse' = 'apply-paste';
  topTeeth: Tooth[] = [];
  bottomTeeth: Tooth[] = [];

  isSqueezing: boolean = false;
  hasPaste: boolean = false;
  pasteDropY: number = 80;

  brushX: number = 0; // Will be centered using CSS initially
  brushY: number = 0;
  brushCleanliness: number = 100;
  teethCleanedSinceRinse: number = 0;

  tapRunning: boolean = false;
  gameComplete: boolean = false;
  isRinsing: boolean = false; // Track if brush is actively being rinsed

  isDraggingBrush: boolean = false;
  dragOffsetX: number = 0;
  dragOffsetY: number = 0;

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {
    this.initializeTeeth();
  }

  initializeTeeth(): void {
    // Clear existing teeth arrays
    this.topTeeth = [];
    this.bottomTeeth = [];

    // Create 14 top teeth
    for (let i = 0; i < 14; i++) {
      this.topTeeth.push({
        id: i,
        row: 'top',
        position: i,
        cleanliness: 0 // Start dirty
      });
    }

    // Create 14 bottom teeth
    for (let i = 0; i < 14; i++) {
      this.bottomTeeth.push({
        id: i + 14,
        row: 'bottom',
        position: i,
        cleanliness: 0 // Start dirty
      });
    }
  }


  translate(key: string): string {
    return this.translationService.translate(key);
  }

  startSqueeze(): void {
    if (this.gameState !== 'apply-paste') return;

    this.isSqueezing = true;

    // Animate paste dropping
    setTimeout(() => {
      this.hasPaste = true;
      this.isSqueezing = false;
      this.gameState = 'brushing';
    }, 1000);
  }

  endSqueeze(): void {
    // Paste application handled in startSqueeze timeout
  }

  startDragBrush(event: MouseEvent): void {
    if (this.gameState !== 'brushing' && this.gameState !== 'need-rinse') return;

    event.preventDefault();

    // Set brush position to cursor position (will be centered by CSS transform)
    this.brushX = event.clientX;
    this.brushY = event.clientY;

    // Now enable dragging mode
    this.isDraggingBrush = true;

    document.addEventListener('mousemove', this.onDragBrush);
    document.addEventListener('mouseup', this.onStopDragBrush);
  }

  onDragBrush = (event: MouseEvent): void => {
    if (!this.isDraggingBrush) return;

    // Position brush at cursor (CSS centers it)
    this.brushX = event.clientX;
    this.brushY = event.clientY;

    // Check what element is under the cursor
    const elementUnderBrush = document.elementFromPoint(event.clientX, event.clientY);

    if (this.gameState === 'brushing' && elementUnderBrush && elementUnderBrush.classList.contains('tooth')) {
      const toothId = parseInt(elementUnderBrush.getAttribute('data-tooth-id') || '0');
      const tooth = this.findToothById(toothId);
      if (tooth) {
        this.brushTooth(tooth);
      }
    }

    // Check if brush is over tap for rinsing
    if (this.gameState === 'need-rinse' && this.tapRunning) {
      this.checkBrushOverTap();
    }
  };

  onStopDragBrush = (): void => {
    this.isDraggingBrush = false;
    document.removeEventListener('mousemove', this.onDragBrush);
    document.removeEventListener('mouseup', this.onStopDragBrush);
  };

  startDragBrushTouch(event: TouchEvent): void {
    if (this.gameState !== 'brushing' && this.gameState !== 'need-rinse') return;

    event.preventDefault();

    const touch = event.touches[0];

    // Set brush position to touch position (will be centered by CSS transform)
    this.brushX = touch.clientX;
    this.brushY = touch.clientY;

    // Now enable dragging mode
    this.isDraggingBrush = true;

    document.addEventListener('touchmove', this.onDragBrushTouch);
    document.addEventListener('touchend', this.onStopDragBrushTouch);
  }

  onDragBrushTouch = (event: TouchEvent): void => {
    if (!this.isDraggingBrush) return;

    const touch = event.touches[0];

    // Position brush at touch point (CSS centers it)
    this.brushX = touch.clientX;
    this.brushY = touch.clientY;

    // Check what element is under the touch point
    const elementUnderBrush = document.elementFromPoint(touch.clientX, touch.clientY);

    if (this.gameState === 'brushing' && elementUnderBrush && elementUnderBrush.classList.contains('tooth')) {
      const toothId = parseInt(elementUnderBrush.getAttribute('data-tooth-id') || '0');
      const tooth = this.findToothById(toothId);
      if (tooth) {
        this.brushTooth(tooth);
      }
    }

    if (this.gameState === 'need-rinse' && this.tapRunning) {
      this.checkBrushOverTap();
    }
  };

  onStopDragBrushTouch = (): void => {
    this.isDraggingBrush = false;
    document.removeEventListener('touchmove', this.onDragBrushTouch);
    document.removeEventListener('touchend', this.onStopDragBrushTouch);
  };

  brushTooth(tooth: Tooth): void {
    if (this.gameState !== 'brushing') return;
    if (!this.isDraggingBrush) return;
    if (tooth.cleanliness >= 100) return;

    // Increase tooth cleanliness (in smaller increments for smoother progress)
    tooth.cleanliness += 25;
    if (tooth.cleanliness > 100) tooth.cleanliness = 100;

    // If tooth just became fully clean, decrease brush cleanliness
    if (tooth.cleanliness === 100) {
      this.brushCleanliness -= 25;
      this.teethCleanedSinceRinse++;

      // Check if brush needs rinsing (after 4 teeth)
      if (this.teethCleanedSinceRinse >= 4) {
        this.gameState = 'need-rinse';
        this.teethCleanedSinceRinse = 0;
      }

      // Check if all teeth are clean
      if (this.allTeethClean()) {
        setTimeout(() => {
          this.gameComplete = true;
          this.teethBrushed.emit();
        }, 500);
      }
    }
  }

  handleTouchBrush(event: TouchEvent): void {
    if (this.gameState !== 'brushing' || !this.isDraggingBrush) return;

    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.classList.contains('tooth')) {
      const toothId = parseInt(element.getAttribute('data-tooth-id') || '0');
      const tooth = this.findToothById(toothId);
      if (tooth) {
        this.brushTooth(tooth);
      }
    }
  }

  findToothById(id: number): Tooth | undefined {
    return [...this.topTeeth, ...this.bottomTeeth].find(t => t.id === id);
  }

  toggleTap(): void {
    this.tapRunning = !this.tapRunning;

    if (this.tapRunning) {
      // Start checking if brush is under tap
      const checkInterval = setInterval(() => {
        if (!this.tapRunning) {
          clearInterval(checkInterval);
          return;
        }
        this.checkBrushOverTap();
      }, 100);
    }
  }

  checkBrushOverTap(): void {
    // Get tap position from DOM instead of hardcoding
    const tapElement = document.querySelector('.water-tap') as HTMLElement;
    if (!tapElement) return;

    const tapRect = tapElement.getBoundingClientRect();
    const tapCenterX = tapRect.left + tapRect.width / 2;
    const tapCenterY = tapRect.top + tapRect.height / 2;

    // Calculate distance from brush to tap center
    const distance = Math.sqrt(
      Math.pow(this.brushX - tapCenterX, 2) +
      Math.pow(this.brushY - tapCenterY, 2)
    );

    // Increased proximity range for easier cleaning
    if (distance < 150) {
      this.isRinsing = true;
      // Rinse brush faster for better feedback
      this.brushCleanliness += 15;
      if (this.brushCleanliness >= 100) {
        this.brushCleanliness = 100;
        this.gameState = 'brushing';
        this.tapRunning = false;
        this.isRinsing = false;
      }
    } else {
      this.isRinsing = false;
    }
  }

  allTeethClean(): boolean {
    return [...this.topTeeth, ...this.bottomTeeth].every(t => t.cleanliness >= 100);
  }

  get cleanedTeethCount(): number {
    return [...this.topTeeth, ...this.bottomTeeth].filter(t => t.cleanliness >= 100).length;
  }

  playAgain(): void {
    this.gameComplete = false;
    this.gameState = 'apply-paste';
    this.hasPaste = false;
    this.brushCleanliness = 100;
    this.teethCleanedSinceRinse = 0;
    this.tapRunning = false;
    this.isRinsing = false;
    this.isDraggingBrush = false;
    this.initializeTeeth();
  }

  goBack(): void {
    this.backToHome.emit();
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.onDragBrush);
    document.removeEventListener('mouseup', this.onStopDragBrush);
    document.removeEventListener('touchmove', this.onDragBrushTouch);
    document.removeEventListener('touchend', this.onStopDragBrushTouch);
  }
}
