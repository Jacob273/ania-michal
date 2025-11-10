import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WordPair {
  english: string;
  polish: string;
}

interface PlayerProgress {
  wordsLearned: number;
  currentWordIndex: number;
  failedWords: number[];
  shuffledIndices: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private aniaProgress = new BehaviorSubject<PlayerProgress>({
    wordsLearned: 0,
    currentWordIndex: 0,
    failedWords: [],
    shuffledIndices: []
  });
  private michalProgress = new BehaviorSubject<PlayerProgress>({
    wordsLearned: 0,
    currentWordIndex: 0,
    failedWords: [],
    shuffledIndices: []
  });

  public aniaProgress$: Observable<PlayerProgress> = this.aniaProgress.asObservable();
  public michalProgress$: Observable<PlayerProgress> = this.michalProgress.asObservable();

  // 100 word pairs for learning
  private allWordPairs: WordPair[] = [
    { english: 'Cat', polish: 'Kot' },
    { english: 'Dog', polish: 'Pies' },
    { english: 'Sun', polish: 'Słońce' },
    { english: 'Moon', polish: 'Księżyc' },
    { english: 'Star', polish: 'Gwiazda' },
    { english: 'House', polish: 'Dom' },
    { english: 'Tree', polish: 'Drzewo' },
    { english: 'Water', polish: 'Woda' },
    { english: 'Fire', polish: 'Ogień' },
    { english: 'Book', polish: 'Książka' },
    { english: 'Table', polish: 'Stół' },
    { english: 'Chair', polish: 'Krzesło' },
    { english: 'Window', polish: 'Okno' },
    { english: 'Door', polish: 'Drzwi' },
    { english: 'Car', polish: 'Samochód' },
    { english: 'Bike', polish: 'Rower' },
    { english: 'Ball', polish: 'Piłka' },
    { english: 'Flower', polish: 'Kwiat' },
    { english: 'Bird', polish: 'Ptak' },
    { english: 'Fish', polish: 'Ryba' },
    { english: 'Apple', polish: 'Jabłko' },
    { english: 'Bread', polish: 'Chleb' },
    { english: 'Milk', polish: 'Mleko' },
    { english: 'Juice', polish: 'Sok' },
    { english: 'Cheese', polish: 'Ser' },
    { english: 'Egg', polish: 'Jajko' },
    { english: 'Meat', polish: 'Mięso' },
    { english: 'Soup', polish: 'Zupa' },
    { english: 'Cake', polish: 'Ciasto' },
    { english: 'Cookie', polish: 'Ciasteczko' },
    { english: 'Red', polish: 'Czerwony' },
    { english: 'Blue', polish: 'Niebieski' },
    { english: 'Green', polish: 'Zielony' },
    { english: 'Yellow', polish: 'Żółty' },
    { english: 'White', polish: 'Biały' },
    { english: 'Black', polish: 'Czarny' },
    { english: 'Big', polish: 'Duży' },
    { english: 'Small', polish: 'Mały' },
    { english: 'Hot', polish: 'Gorący' },
    { english: 'Cold', polish: 'Zimny' },
    { english: 'Happy', polish: 'Szczęśliwy' },
    { english: 'Sad', polish: 'Smutny' },
    { english: 'Fast', polish: 'Szybki' },
    { english: 'Slow', polish: 'Wolny' },
    { english: 'Strong', polish: 'Silny' },
    { english: 'Weak', polish: 'Słaby' },
    { english: 'Good', polish: 'Dobry' },
    { english: 'Bad', polish: 'Zły' },
    { english: 'New', polish: 'Nowy' },
    { english: 'Old', polish: 'Stary' },
    { english: 'Mother', polish: 'Mama' },
    { english: 'Father', polish: 'Tata' },
    { english: 'Sister', polish: 'Siostra' },
    { english: 'Brother', polish: 'Brat' },
    { english: 'Friend', polish: 'Przyjaciel' },
    { english: 'Baby', polish: 'Dziecko' },
    { english: 'Boy', polish: 'Chłopiec' },
    { english: 'Girl', polish: 'Dziewczynka' },
    { english: 'Man', polish: 'Mężczyzna' },
    { english: 'Woman', polish: 'Kobieta' },
    { english: 'Hand', polish: 'Ręka' },
    { english: 'Foot', polish: 'Stopa' },
    { english: 'Eye', polish: 'Oko' },
    { english: 'Ear', polish: 'Ucho' },
    { english: 'Nose', polish: 'Nos' },
    { english: 'Mouth', polish: 'Usta' },
    { english: 'Head', polish: 'Głowa' },
    { english: 'Heart', polish: 'Serce' },
    { english: 'Day', polish: 'Dzień' },
    { english: 'Night', polish: 'Noc' },
    { english: 'Morning', polish: 'Ranek' },
    { english: 'Evening', polish: 'Wieczór' },
    { english: 'Week', polish: 'Tydzień' },
    { english: 'Month', polish: 'Miesiąc' },
    { english: 'Year', polish: 'Rok' },
    { english: 'Spring', polish: 'Wiosna' },
    { english: 'Summer', polish: 'Lato' },
    { english: 'Autumn', polish: 'Jesień' },
    { english: 'Winter', polish: 'Zima' },
    { english: 'Rain', polish: 'Deszcz' },
    { english: 'Snow', polish: 'Śnieg' },
    { english: 'Wind', polish: 'Wiatr' },
    { english: 'Cloud', polish: 'Chmura' },
    { english: 'Sky', polish: 'Niebo' },
    { english: 'Earth', polish: 'Ziemia' },
    { english: 'Mountain', polish: 'Góra' },
    { english: 'River', polish: 'Rzeka' },
    { english: 'Sea', polish: 'Morze' },
    { english: 'Beach', polish: 'Plaża' },
    { english: 'Forest', polish: 'Las' },
    { english: 'Garden', polish: 'Ogród' },
    { english: 'Grass', polish: 'Trawa' },
    { english: 'Stone', polish: 'Kamień' },
    { english: 'Sand', polish: 'Piasek' },
    { english: 'School', polish: 'Szkoła' },
    { english: 'Classroom', polish: 'Klasa' },
    { english: 'Teacher', polish: 'Nauczyciel' },
    { english: 'Student', polish: 'Uczeń' },
    { english: 'Pencil', polish: 'Ołówek' },
    { english: 'Paper', polish: 'Papier' }
  ];

  constructor() {
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
      this.michalProgress.next(progress);
    } else {
      // Create shuffled order for new player
      const progress = this.michalProgress.value;
      progress.shuffledIndices = this.createShuffledIndices();
      this.michalProgress.next(progress);
    }
  }

  private createShuffledIndices(): number[] {
    // Create array of indices [0, 1, 2, ..., 99]
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

  getNextWords(player: 'ANIA' | 'MICHAL'): WordPair[] {
    const progress = this.getProgress(player);
    const words: WordPair[] = [];

    // First, add failed words if any
    if (progress.failedWords.length > 0) {
      const failedToRetry = progress.failedWords.slice(0, 5);
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

    // Otherwise, get next 5 words from current index using shuffled order
    let currentIdx = progress.currentWordIndex;
    for (let i = 0; i < 5 && currentIdx < progress.shuffledIndices.length; i++) {
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

  completeRound(player: 'ANIA' | 'MICHAL'): void {
    const progress = this.getProgress(player);
    const updatedProgress = { ...progress };

    // Move to next set of words (only if not retrying failed words)
    if (progress.failedWords.length === 0) {
      updatedProgress.currentWordIndex = Math.min(
        progress.currentWordIndex + 5,
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
      shuffledIndices: this.createShuffledIndices()
    };
    this.updateProgress(player, resetData);
  }
}
