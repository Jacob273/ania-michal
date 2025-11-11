import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface TeethBrushingStats {
  teethBrushed: number;
}

@Injectable({
  providedIn: 'root'
})
export class TeethBrushingService {
  private aniaTeeth = new BehaviorSubject<TeethBrushingStats>({ teethBrushed: 0 });
  private michalTeeth = new BehaviorSubject<TeethBrushingStats>({ teethBrushed: 0 });

  public aniaTeeth$: Observable<TeethBrushingStats> = this.aniaTeeth.asObservable();
  public michalTeeth$: Observable<TeethBrushingStats> = this.michalTeeth.asObservable();

  constructor() {
    this.loadStats();
  }

  private loadStats(): void {
    const aniaData = localStorage.getItem('aniaTeethBrushing');
    const michalData = localStorage.getItem('michalTeethBrushing');

    if (aniaData) {
      this.aniaTeeth.next(JSON.parse(aniaData));
    }

    if (michalData) {
      this.michalTeeth.next(JSON.parse(michalData));
    }
  }

  private saveStats(player: 'ANIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      localStorage.setItem('aniaTeethBrushing', JSON.stringify(this.aniaTeeth.value));
    } else {
      localStorage.setItem('michalTeethBrushing', JSON.stringify(this.michalTeeth.value));
    }
  }

  incrementTeethBrushed(player: 'ANIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      const current = this.aniaTeeth.value;
      this.aniaTeeth.next({ teethBrushed: current.teethBrushed + 1 });
    } else {
      const current = this.michalTeeth.value;
      this.michalTeeth.next({ teethBrushed: current.teethBrushed + 1 });
    }
    this.saveStats(player);
  }

  getStats(player: 'ANIA' | 'MICHAL'): TeethBrushingStats {
    return player === 'ANIA' ? this.aniaTeeth.value : this.michalTeeth.value;
  }
}
