import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BedtimeStats {
  bedtimesCompleted: number;
}

@Injectable({
  providedIn: 'root'
})
export class BedtimeService {
  private readonly STORAGE_KEY_ANIA = 'ania-bedtimes';
  private readonly STORAGE_KEY_MICHAL = 'michal-bedtimes';

  private aniaBedtimesSubject = new BehaviorSubject<BedtimeStats>(this.loadStats('ANIA'));
  private michalBedtimesSubject = new BehaviorSubject<BedtimeStats>(this.loadStats('MICHAL'));

  public aniaBedtimes$: Observable<BedtimeStats> = this.aniaBedtimesSubject.asObservable();
  public michalBedtimes$: Observable<BedtimeStats> = this.michalBedtimesSubject.asObservable();

  constructor() { }

  private loadStats(player: 'ANIA' | 'MICHAL'): BedtimeStats {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : this.STORAGE_KEY_MICHAL;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return { bedtimesCompleted: 0 };
  }

  private saveStats(player: 'ANIA' | 'MICHAL', stats: BedtimeStats): void {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : this.STORAGE_KEY_MICHAL;
    localStorage.setItem(key, JSON.stringify(stats));
  }

  getBedtimeStats(player: 'ANIA' | 'MICHAL'): BedtimeStats {
    return this.loadStats(player);
  }

  incrementBedtimes(player: 'ANIA' | 'MICHAL'): void {
    const currentStats = this.loadStats(player);
    currentStats.bedtimesCompleted++;
    this.saveStats(player, currentStats);

    if (player === 'ANIA') {
      this.aniaBedtimesSubject.next(currentStats);
    } else {
      this.michalBedtimesSubject.next(currentStats);
    }
  }
}
