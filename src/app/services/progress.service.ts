import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WordDatabaseService } from './word-database.service';

export interface WordPair {
  english: string;
  polish: string;
}

interface PlayerProgress {
  wordsLearned: number;
  currentWordIndex: number;
  failedWords: number[];
  shuffledIndices: number[];
  learnedWordIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private aniaProgress = new BehaviorSubject<PlayerProgress>({
    wordsLearned: 0,
    currentWordIndex: 0,
    failedWords: [],
    shuffledIndices: [],
    learnedWordIds: []
  });
  private michalProgress = new BehaviorSubject<PlayerProgress>({
    wordsLearned: 0,
    currentWordIndex: 0,
    failedWords: [],
    shuffledIndices: [],
    learnedWordIds: []
  });

  public aniaProgress$: Observable<PlayerProgress> = this.aniaProgress.asObservable();
  public michalProgress$: Observable<PlayerProgress> = this.michalProgress.asObservable();

  private allWordPairs: WordPair[] = [];

  constructor(private wordDatabase: WordDatabaseService) {
    // Get all 2000 words from the database
    const dbWords = this.wordDatabase.getAllWords();
    this.allWordPairs = dbWords.map(word => ({
      english: word.english,
      polish: word.polish
    }));

    this.loadProgress();
  }

  private loadProgress(): void {
    const aniaData = localStorage.getItem('aniaProgress');
    const michalData = localStorage.getItem('michalProgress');

    if (aniaData) {
      const progress = JSON.parse(aniaData);
      // Initialize shuffled indices if not present
      if (!progress.shuffledIndices || progress.shuffledIndices.length === 0) {
        progress.shuffledIndices = this.createShuffledIndices();
      }
      // Initialize learnedWordIds if not present (backward compatibility)
      if (!progress.learnedWordIds) {
        progress.learnedWordIds = [];
      }
      this.aniaProgress.next(progress);
    } else {
      // Create shuffled order for new player
      const progress = this.aniaProgress.value;
      progress.shuffledIndices = this.createShuffledIndices();
      this.aniaProgress.next(progress);
    }

    if (michalData) {
      const progress = JSON.parse(michalData);
      // Initialize shuffled indices if not present
      if (!progress.shuffledIndices || progress.shuffledIndices.length === 0) {
        progress.shuffledIndices = this.createShuffledIndices();
      }
      // Initialize learnedWordIds if not present (backward compatibility)
      if (!progress.learnedWordIds) {
        progress.learnedWordIds = [];
      }
      this.michalProgress.next(progress);
    } else {
      // Create shuffled order for new player
      const progress = this.michalProgress.value;
      progress.shuffledIndices = this.createShuffledIndices();
      this.michalProgress.next(progress);
    }
  }

  private createShuffledIndices(): number[] {
    // Create array of indices [0, 1, 2, ..., 1999] for all 2000 words
    const indices = Array.from({ length: this.allWordPairs.length }, (_, i) => i);
    // Shuffle using Fisher-Yates algorithm
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  }

  private saveProgress(player: 'ANIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      localStorage.setItem('aniaProgress', JSON.stringify(this.aniaProgress.value));
    } else {
      localStorage.setItem('michalProgress', JSON.stringify(this.michalProgress.value));
    }
  }

  getProgress(player: 'ANIA' | 'MICHAL'): PlayerProgress {
    return player === 'ANIA' ? this.aniaProgress.value : this.michalProgress.value;
  }

  getNextWords(player: 'ANIA' | 'MICHAL', count: number = 8): WordPair[] {
    const progress = this.getProgress(player);
    const words: WordPair[] = [];

    // First, add failed words if any
    if (progress.failedWords.length > 0) {
      const failedToRetry = progress.failedWords.slice(0, count);
      failedToRetry.forEach(shuffledIndex => {
        const actualIndex = progress.shuffledIndices[shuffledIndex];
        words.push(this.allWordPairs[actualIndex]);
      });

      // Remove these from failed list
      const updatedProgress = { ...progress };
      updatedProgress.failedWords = progress.failedWords.filter(idx => !failedToRetry.includes(idx));
      this.updateProgress(player, updatedProgress);

      return words;
    }

    // Otherwise, get next words from current index using shuffled order
    let currentIdx = progress.currentWordIndex;
    for (let i = 0; i < count && currentIdx < progress.shuffledIndices.length; i++) {
      const shuffledIndex = progress.shuffledIndices[currentIdx];
      words.push(this.allWordPairs[shuffledIndex]);
      currentIdx++;
    }

    return words;
  }

  markWordCorrect(player: 'ANIA' | 'MICHAL', wordIndex: number): void {
    const progress = this.getProgress(player);
    const updatedProgress = { ...progress };
    updatedProgress.wordsLearned += 1;

    this.updateProgress(player, updatedProgress);
  }

  markWordFailed(player: 'ANIA' | 'MICHAL', wordIndex: number): void {
    const progress = this.getProgress(player);
    const updatedProgress = { ...progress };

    // Add to failed words if not already there
    if (!updatedProgress.failedWords.includes(wordIndex)) {
      updatedProgress.failedWords.push(wordIndex);
    }

    this.updateProgress(player, updatedProgress);
  }

  completeRound(player: 'ANIA' | 'MICHAL', wordsInRound: number = 8): void {
    const progress = this.getProgress(player);
    const updatedProgress = { ...progress };

    // Move to next set of words (only if not retrying failed words)
    if (progress.failedWords.length === 0) {
      updatedProgress.currentWordIndex = Math.min(
        progress.currentWordIndex + wordsInRound,
        progress.shuffledIndices.length
      );
    }

    this.updateProgress(player, updatedProgress);
  }

  private updateProgress(player: 'ANIA' | 'MICHAL', progress: PlayerProgress): void {
    if (player === 'ANIA') {
      this.aniaProgress.next(progress);
    } else {
      this.michalProgress.next(progress);
    }
    this.saveProgress(player);
  }

  getTotalWords(): number {
    return this.allWordPairs.length;
  }

  resetProgress(player: 'ANIA' | 'MICHAL'): void {
    const resetData: PlayerProgress = {
      wordsLearned: 0,
      currentWordIndex: 0,
      failedWords: [],
      shuffledIndices: this.createShuffledIndices(),
      learnedWordIds: []
    };
    this.updateProgress(player, resetData);
  }
}
