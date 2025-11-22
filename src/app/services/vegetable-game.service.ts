import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VegetableStats {
  vegetablesCompleted: number;
}

@Injectable({
  providedIn: 'root'
})
export class VegetableGameService {
  private readonly STORAGE_KEY_ANIA = 'ania-vegetables-completed';
  private readonly STORAGE_KEY_NADIA = 'nadia-vegetables-completed';
  private readonly STORAGE_KEY_MICHAL = 'michal-vegetables-completed';

  private aniaVegetablesSubject = new BehaviorSubject<VegetableStats>(this.loadStats('ANIA'));
  private nadiaVegetablesSubject = new BehaviorSubject<VegetableStats>(this.loadStats('NADIA'));
  private michalVegetablesSubject = new BehaviorSubject<VegetableStats>(this.loadStats('MICHAL'));

  public aniaVegetables$: Observable<VegetableStats> = this.aniaVegetablesSubject.asObservable();
  public nadiaVegetables$: Observable<VegetableStats> = this.nadiaVegetablesSubject.asObservable();
  public michalVegetables$: Observable<VegetableStats> = this.michalVegetablesSubject.asObservable();

  constructor() { }

  private loadStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): VegetableStats {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : player === 'NADIA' ? this.STORAGE_KEY_NADIA : this.STORAGE_KEY_MICHAL;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return { vegetablesCompleted: 0 };
  }

  private saveStats(player: 'ANIA' | 'NADIA' | 'MICHAL', stats: VegetableStats): void {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : player === 'NADIA' ? this.STORAGE_KEY_NADIA : this.STORAGE_KEY_MICHAL;
    localStorage.setItem(key, JSON.stringify(stats));
  }

  getVegetableStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): VegetableStats {
    return this.loadStats(player);
  }

  incrementVegetablesCompleted(player: 'ANIA' | 'NADIA' | 'MICHAL'): void {
    const currentStats = this.loadStats(player);
    currentStats.vegetablesCompleted++;
    this.saveStats(player, currentStats);

    if (player === 'ANIA') {
      this.aniaVegetablesSubject.next(currentStats);
    } else if (player === 'NADIA') {
      this.nadiaVegetablesSubject.next(currentStats);
    } else {
      this.michalVegetablesSubject.next(currentStats);
    }
  }
}
