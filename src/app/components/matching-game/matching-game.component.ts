import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { ProgressService, WordPair } from '../../services/progress.service';

interface GameWord {
  word: string;
  id: number;
  matched: boolean;
  originalIndex: number;
}

@Component({
  selector: 'app-matching-game',
  template: `
    <div class="game-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="game-header">
        <h1 class="player-name">{{ playerName }}</h1>
        <h2 class="game-title">{{ translate('match_words') }}</h2>
      </div>

      <div class="game-content" *ngIf="!isComplete">
        <div class="words-column">
          <h3>English</h3>
          <div class="word-list">
            <div
              *ngFor="let word of englishWords"
              class="word-card"
              [class.selected]="selectedEnglish?.id === word.id"
              [class.matched]="word.matched"
              [class.disabled]="isProcessing && !word.matched"
              (click)="selectEnglish(word)">
              {{ word.word }}
            </div>
          </div>
        </div>

        <div class="words-column">
          <h3>Polski</h3>
          <div class="word-list">
            <div
              *ngFor="let word of polishWords"
              class="word-card"
              [class.selected]="selectedPolish?.id === word.id"
              [class.matched]="word.matched"
              [class.disabled]="isProcessing && !word.matched"
              (click)="selectPolish(word)">
              {{ word.word }}
            </div>
          </div>
        </div>
      </div>

      <div class="completion-screen" *ngIf="isComplete">
        <div class="celebration">🎉</div>
        <h2 class="success-message">{{ translate('great_job') }}</h2>
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <button class="play-again-button" (click)="resetGame()">
          {{ translate('try_again') }}
        </button>
      </div>

      <div class="feedback correct-feedback" *ngIf="showCorrectFeedback" [class.show]="showCorrectFeedback">
        {{ translate('correct') }} ✓
      </div>

      <div class="feedback wrong-feedback" *ngIf="showWrongFeedback" [class.show]="showWrongFeedback">
        Try Again! ✗
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
      position: relative;
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
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .game-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .player-name {
      font-size: 48px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 10px 0;
      letter-spacing: 4px;
    }

    .game-title {
      font-size: 24px;
      color: white;
      margin: 10px 0;
    }

    .game-content {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex: 1;
      align-items: flex-start;
      padding-top: 20px;
    }

    .words-column {
      background: white;
      border-radius: 20px;
      padding: 30px;
      min-width: 300px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .words-column h3 {
      text-align: center;
      font-size: 28px;
      color: #333;
      margin-bottom: 20px;
    }

    .word-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .word-card {
      background: #f0f0f0;
      border: 3px solid transparent;
      border-radius: 15px;
      padding: 20px;
      font-size: 22px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
      color: #555;
    }

    .word-card:hover:not(.matched) {
      background: #ffd700;
      transform: scale(1.05);
    }

    .word-card.selected {
      border-color: #ff6b9d;
      background: #ffe4ec;
      transform: scale(1.05);
    }

    .word-card.matched {
      background: #90ee90;
      border-color: #4caf50;
      opacity: 0.7;
      cursor: default;
      pointer-events: none;
    }

    .word-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    .completion-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .celebration {
      font-size: 120px;
      animation: bounce 1s infinite;
    }

    .success-message {
      font-size: 42px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 20px 0;
      text-align: center;
    }

    .stars {
      font-size: 60px;
      margin: 20px 0;
      animation: sparkle 1.5s infinite;
    }

    .play-again-button {
      background: white;
      border: none;
      border-radius: 30px;
      padding: 20px 40px;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
      margin-top: 20px;
    }

    .play-again-button:hover {
      transform: scale(1.1);
    }

    .feedback {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      color: white;
      padding: 30px 50px;
      border-radius: 20px;
      font-size: 36px;
      font-weight: bold;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .correct-feedback {
      background: #4caf50;
    }

    .wrong-feedback {
      background: #f44336;
    }

    .feedback.show {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-30px); }
    }

    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
  `]
})
export class MatchingGameComponent implements OnInit {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();

  englishWords: GameWord[] = [];
  polishWords: GameWord[] = [];
  selectedEnglish: GameWord | null = null;
  selectedPolish: GameWord | null = null;
  isComplete: boolean = false;
  showCorrectFeedback: boolean = false;
  showWrongFeedback: boolean = false;
  isProcessing: boolean = false;

  wordPairs: WordPair[] = [];
  currentStartIndex: number = 0;
  wordsPerRound: number = 8;

  constructor(
    public translationService: TranslationService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.loadNextWords();
  }

  loadNextWords(): void {
    const player = this.playerName as 'ANIA' | 'MICHAL';
    const progress = this.progressService.getProgress(player);
    this.currentStartIndex = progress.currentWordIndex;

    this.wordPairs = this.progressService.getNextWords(player, this.wordsPerRound);
    this.initializeGame();
  }

  initializeGame(): void {
    // Create English words
    this.englishWords = this.wordPairs.map((pair, index) => ({
      word: pair.english,
      id: index,
      matched: false,
      originalIndex: this.currentStartIndex + index
    }));

    // Create Polish words (shuffled)
    this.polishWords = this.shuffleArray(
      this.wordPairs.map((pair, index) => ({
        word: pair.polish,
        id: index,
        matched: false,
        originalIndex: this.currentStartIndex + index
      }))
    );
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectEnglish(word: GameWord): void {
    if (word.matched || this.isProcessing) return;
    this.selectedEnglish = word;
    this.checkMatch();
  }

  selectPolish(word: GameWord): void {
    if (word.matched || this.isProcessing) return;
    this.selectedPolish = word;
    this.checkMatch();
  }

  checkMatch(): void {
    if (this.selectedEnglish && this.selectedPolish && !this.isProcessing) {
      // Set processing flag to prevent rapid clicks
      this.isProcessing = true;

      const player = this.playerName as 'ANIA' | 'MICHAL';
      const englishWord = this.selectedEnglish;
      const polishWord = this.selectedPolish;

      // Immediately clear selections to prevent duplicate processing
      this.selectedEnglish = null;
      this.selectedPolish = null;

      if (englishWord.id === polishWord.id) {
        // Match found!
        englishWord.matched = true;
        polishWord.matched = true;

        // Mark word as correct in progress service
        this.progressService.markWordCorrect(player, englishWord.originalIndex);

        this.showCorrectFeedbackMessage();

        // Check if all matched
        if (this.englishWords.every(w => w.matched)) {
          setTimeout(() => {
            this.progressService.completeRound(player, this.wordsPerRound);
            this.isComplete = true;
            this.isProcessing = false;
          }, 1000);
        } else {
          // Reset processing flag after a short delay
          setTimeout(() => {
            this.isProcessing = false;
          }, 500);
        }
      } else {
        // Wrong match - mark as failed and show feedback
        this.progressService.markWordFailed(player, englishWord.originalIndex);
        this.showWrongFeedbackMessage();

        // Reset processing flag after showing feedback
        setTimeout(() => {
          this.isProcessing = false;
        }, 800);
      }
    }
  }

  showCorrectFeedbackMessage(): void {
    this.showCorrectFeedback = true;
    setTimeout(() => {
      this.showCorrectFeedback = false;
    }, 1000);
  }

  showWrongFeedbackMessage(): void {
    this.showWrongFeedback = true;
    setTimeout(() => {
      this.showWrongFeedback = false;
    }, 1000);
  }

  resetGame(): void {
    this.isComplete = false;
    this.selectedEnglish = null;
    this.selectedPolish = null;
    this.isProcessing = false;
    this.loadNextWords();
  }

  goBack(): void {
    this.backToHome.emit();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
