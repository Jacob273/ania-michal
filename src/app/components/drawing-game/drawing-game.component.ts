import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

interface DrawingTool {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-drawing-game',
  template: `
    <div class="drawing-container" [class.ania-theme]="playerName === 'ANIA'" [class.nadia-theme]="playerName === 'NADIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="game-title">🎨 {{ translate('drawing_painting') }} 🖌️</h1>
        <p class="game-instruction">{{ translate('draw_anything') }}</p>
      </div>

      <div class="drawing-area">
        <!-- Toolbar -->
        <div class="toolbar">
          <!-- Tool Selection -->
          <div class="tool-section">
            <h3 class="section-title">{{ translate('tools') }}</h3>
            <div class="tool-buttons">
              <button
                *ngFor="let tool of tools"
                class="tool-btn"
                [class.active]="currentTool === tool.name"
                (click)="selectTool(tool.name)">
                {{ tool.icon }}
              </button>
            </div>
          </div>

          <!-- Brush Size -->
          <div class="tool-section">
            <h3 class="section-title">{{ translate('brush_size') }}</h3>
            <div class="size-slider">
              <input
                type="range"
                min="1"
                max="50"
                [(ngModel)]="brushSize"
                class="slider">
              <span class="size-value">{{ brushSize }}px</span>
            </div>
          </div>

          <!-- Color Palette -->
          <div class="tool-section">
            <h3 class="section-title">{{ translate('colors') }}</h3>
            <div class="color-palette">
              <div
                *ngFor="let color of colors"
                class="color-swatch"
                [style.background-color]="color"
                [class.active]="currentColor === color"
                (click)="selectColor(color)">
              </div>
            </div>
          </div>

          <!-- Shapes -->
          <div class="tool-section">
            <h3 class="section-title">{{ translate('shapes') }}</h3>
            <div class="shape-buttons">
              <button
                *ngFor="let shape of shapes"
                class="shape-btn"
                [class.active]="currentShape === shape.name"
                (click)="selectShape(shape.name)">
                {{ shape.icon }}
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="tool-section">
            <button class="action-btn clear-btn" (click)="showClearModal()">
              🗑️ {{ translate('clear') }}
            </button>
            <button class="action-btn save-btn" (click)="saveDrawing()">
              💾 {{ translate('save') }}
            </button>
          </div>
        </div>

        <!-- Canvas -->
        <div class="canvas-wrapper">
          <canvas
            #drawingCanvas
            (mousedown)="startDrawing($event)"
            (mousemove)="draw($event)"
            (mouseup)="stopDrawing()"
            (mouseleave)="stopDrawing()"
            (touchstart)="startDrawingTouch($event)"
            (touchmove)="drawTouch($event)"
            (touchend)="stopDrawing()">
          </canvas>
        </div>
      </div>

      <!-- Clear Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showClearConfirm" (click)="closeClearModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-icon">🗑️</div>
          <h2 class="modal-title">{{ translate('clear_drawing_title') }}</h2>
          <p class="modal-message">{{ translate('clear_drawing_message') }}</p>
          <div class="modal-buttons">
            <button class="modal-btn cancel-btn" (click)="closeClearModal()">
              {{ translate('cancel') }}
            </button>
            <button class="modal-btn confirm-btn" (click)="confirmClear()">
              {{ translate('yes_clear') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Save Success Modal -->
      <div class="modal-overlay" *ngIf="showSaveSuccess" (click)="closeSaveModal()">
        <div class="modal-content success-modal" (click)="$event.stopPropagation()">
          <div class="modal-icon success-icon">🎨</div>
          <h2 class="modal-title">{{ translate('drawing_saved_title') }}</h2>
          <p class="modal-message">{{ translate('drawing_saved_message') }}</p>
          <button class="modal-btn confirm-btn" (click)="closeSaveModal()">
            {{ translate('awesome') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawing-container {
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
      position: relative;
      overflow: auto;
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
    }

    .drawing-area {
      display: flex;
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .toolbar {
      background: white;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      width: 250px;
      flex-shrink: 0;
    }

    .tool-section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin: 0 0 10px 0;
    }

    .tool-buttons, .shape-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .tool-btn, .shape-btn {
      background: #f0f0f0;
      border: 2px solid transparent;
      border-radius: 10px;
      padding: 12px;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tool-btn:hover, .shape-btn:hover {
      background: #e0e0e0;
      transform: scale(1.1);
    }

    .tool-btn.active, .shape-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: #667eea;
      transform: scale(1.1);
    }

    .size-slider {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .slider {
      width: 100%;
      height: 8px;
      border-radius: 5px;
      background: #d3d3d3;
      outline: none;
      -webkit-appearance: none;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
    }

    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      border: none;
    }

    .size-value {
      text-align: center;
      font-weight: bold;
      color: #667eea;
      font-size: 16px;
    }

    .color-palette {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .color-swatch {
      width: 45px;
      height: 45px;
      border-radius: 10px;
      cursor: pointer;
      border: 3px solid transparent;
      transition: all 0.3s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .color-swatch:hover {
      transform: scale(1.15);
    }

    .color-swatch.active {
      border-color: #333;
      transform: scale(1.15);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    .action-btn {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      margin-bottom: 10px;
    }

    .clear-btn {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
      color: white;
    }

    .clear-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(255, 107, 107, 0.4);
    }

    .save-btn {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      color: white;
    }

    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
    }

    .canvas-wrapper {
      flex: 1;
      background: white;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    canvas {
      border: 3px solid #ddd;
      border-radius: 10px;
      cursor: crosshair;
      background: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
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

    .modal-content {
      background: white;
      border-radius: 25px;
      padding: 40px;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: slideIn 0.3s ease;
      position: relative;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .success-icon {
      animation: rotate 0.6s ease;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg) scale(0);
      }
      to {
        transform: rotate(360deg) scale(1);
      }
    }

    .modal-title {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin: 0 0 15px 0;
    }

    .modal-message {
      font-size: 18px;
      color: #666;
      margin: 0 0 30px 0;
      line-height: 1.5;
    }

    .modal-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .modal-btn {
      padding: 15px 35px;
      border: none;
      border-radius: 15px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      min-width: 120px;
    }

    .cancel-btn {
      background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
      color: white;
    }

    .cancel-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(149, 165, 166, 0.4);
    }

    .confirm-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .confirm-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
    }

    .success-modal {
      background: linear-gradient(135deg, #f6f9fc 0%, #e9f0f7 100%);
      border: 3px solid #667eea;
    }

    @media (max-width: 1024px) {
      .drawing-area {
        flex-direction: column;
      }

      .toolbar {
        width: 100%;
      }

      .tool-buttons, .shape-buttons {
        grid-template-columns: repeat(5, 1fr);
      }

      .color-palette {
        grid-template-columns: repeat(8, 1fr);
      }
    }
  `]
})
export class DrawingGameComponent implements OnInit, AfterViewInit {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();

  @ViewChild('drawingCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;

  currentTool: string = 'brush';
  currentColor: string = '#000000';
  currentShape: string = 'none';
  brushSize: number = 5;
  showClearConfirm: boolean = false;
  showSaveSuccess: boolean = false;

  tools: DrawingTool[] = [
    { name: 'brush', icon: '🖌️' },
    { name: 'pencil', icon: '✏️' },
    { name: 'eraser', icon: '🧽' },
    { name: 'spray', icon: '💨' },
    { name: 'marker', icon: '🖊️' },
    { name: 'fill', icon: '🎨' }
  ];

  colors: string[] = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00',
    '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#FFD700', '#4B0082', '#00CED1'
  ];

  shapes: { name: string; icon: string }[] = [
    { name: 'circle', icon: '⭕' },
    { name: 'square', icon: '⬜' },
    { name: 'triangle', icon: '🔺' },
    { name: 'star', icon: '⭐' },
    { name: 'heart', icon: '❤️' },
    { name: 'none', icon: '🚫' }
  ];

  constructor(public translationService: TranslationService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;

    // Set canvas size
    this.canvas.width = 800;
    this.canvas.height = 600;

    // Initialize canvas with white background
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  selectTool(tool: string): void {
    this.currentTool = tool;
    this.currentShape = 'none';
  }

  selectColor(color: string): void {
    this.currentColor = color;
  }

  selectShape(shape: string): void {
    this.currentShape = shape;
    this.currentTool = 'shape';
  }

  startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.lastX = event.clientX - rect.left;
    this.lastY = event.clientY - rect.top;

    if (this.currentTool === 'shape' && this.currentShape !== 'none') {
      this.drawShape(this.lastX, this.lastY);
      this.isDrawing = false;
    } else if (this.currentTool === 'fill') {
      this.fillArea(this.lastX, this.lastY);
      this.isDrawing = false;
    }
  }

  draw(event: MouseEvent): void {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);

    if (this.currentTool === 'eraser') {
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = this.brushSize * 2;
    } else if (this.currentTool === 'spray') {
      this.drawSpray(x, y);
      this.lastX = x;
      this.lastY = y;
      return;
    } else if (this.currentTool === 'marker') {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.globalAlpha = 0.5;
      this.ctx.lineWidth = this.brushSize * 2;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.globalAlpha = 1;
      this.ctx.lineWidth = this.brushSize;
    }

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;

    this.lastX = x;
    this.lastY = y;
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  startDrawingTouch(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    this.isDrawing = true;
    this.lastX = touch.clientX - rect.left;
    this.lastY = touch.clientY - rect.top;

    if (this.currentTool === 'shape' && this.currentShape !== 'none') {
      this.drawShape(this.lastX, this.lastY);
      this.isDrawing = false;
    }
  }

  drawTouch(event: TouchEvent): void {
    if (!this.isDrawing) return;
    event.preventDefault();

    const touch = event.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);

    if (this.currentTool === 'eraser') {
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = this.brushSize * 2;
    } else if (this.currentTool === 'spray') {
      this.drawSpray(x, y);
      this.lastX = x;
      this.lastY = y;
      return;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
    }

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    this.lastX = x;
    this.lastY = y;
  }

  drawSpray(x: number, y: number): void {
    const density = 20;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * this.brushSize * 2;
      const offsetY = (Math.random() - 0.5) * this.brushSize * 2;
      this.ctx.fillStyle = this.currentColor;
      this.ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  }

  drawShape(x: number, y: number): void {
    const size = this.brushSize * 5;
    this.ctx.fillStyle = this.currentColor;
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = 2;

    switch (this.currentShape) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case 'square':
        this.ctx.fillRect(x - size, y - size, size * 2, size * 2);
        break;

      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x - size, y + size);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'star':
        this.drawStar(x, y, 5, size, size / 2);
        break;

      case 'heart':
        this.drawHeart(x, y, size);
        break;
    }
  }

  drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawHeart(x: number, y: number, size: number): void {
    this.ctx.beginPath();
    const topCurveHeight = size * 0.3;
    this.ctx.moveTo(x, y + topCurveHeight);

    // Left side
    this.ctx.bezierCurveTo(
      x, y,
      x - size / 2, y,
      x - size / 2, y + topCurveHeight
    );
    this.ctx.bezierCurveTo(
      x - size / 2, y + (size + topCurveHeight) / 2,
      x, y + (size + topCurveHeight) / 2,
      x, y + size
    );

    // Right side
    this.ctx.bezierCurveTo(
      x, y + (size + topCurveHeight) / 2,
      x + size / 2, y + (size + topCurveHeight) / 2,
      x + size / 2, y + topCurveHeight
    );
    this.ctx.bezierCurveTo(
      x + size / 2, y,
      x, y,
      x, y + topCurveHeight
    );

    this.ctx.closePath();
    this.ctx.fill();
  }

  fillArea(x: number, y: number): void {
    // Simple flood fill - fills entire canvas with color for now
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  showClearModal(): void {
    this.showClearConfirm = true;
  }

  closeClearModal(): void {
    this.showClearConfirm = false;
  }

  confirmClear(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.closeClearModal();
  }

  clearCanvas(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  saveDrawing(): void {
    const link = document.createElement('a');
    link.download = `drawing-${this.playerName}-${Date.now()}.png`;
    link.href = this.canvas.toDataURL();
    link.click();
    this.showSaveSuccess = true;
  }

  closeSaveModal(): void {
    this.showSaveSuccess = false;
  }

  goBack(): void {
    this.backToHome.emit();
  }
}
