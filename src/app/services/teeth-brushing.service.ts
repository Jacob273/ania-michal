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
  private nadiaTeeth = new BehaviorSubject<TeethBrushingStats>({ teethBrushed: 0 });
  private michalTeeth = new BehaviorSubject<TeethBrushingStats>({ teethBrushed: 0 });

  public aniaTeeth$: Observable<TeethBrushingStats> = this.aniaTeeth.asObservable();
  public nadiaTeeth$: Observable<TeethBrushingStats> = this.nadiaTeeth.asObservable();
  public michalTeeth$: Observable<TeethBrushingStats> = this.michalTeeth.asObservable();

  constructor() {
    this.loadStats();
  }

  private loadStats(): void {
    const aniaData = localStorage.getItem('aniaTeethBrushing');
    const nadiaData = localStorage.getItem('nadiaTeethBrushing');
    const michalData = localStorage.getItem('michalTeethBrushing');

    if (aniaData) {
      this.aniaTeeth.next(JSON.parse(aniaData));
    }

    if (nadiaData) {
      this.nadiaTeeth.next(JSON.parse(nadiaData));
    }

    if (michalData) {
      this.michalTeeth.next(JSON.parse(michalData));
    }
  }

  private saveStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      localStorage.setItem('aniaTeethBrushing', JSON.stringify(this.aniaTeeth.value));
    } else if (player === 'NADIA') {
      localStorage.setItem('nadiaTeethBrushing', JSON.stringify(this.nadiaTeeth.value));
    } else {
      localStorage.setItem('michalTeethBrushing', JSON.stringify(this.michalTeeth.value));
    }
  }

  incrementTeethBrushed(player: 'ANIA' | 'NADIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      const current = this.aniaTeeth.value;
      this.aniaTeeth.next({ teethBrushed: current.teethBrushed + 1 });
    } else if (player === 'NADIA') {
      const current = this.nadiaTeeth.value;
      this.nadiaTeeth.next({ teethBrushed: current.teethBrushed + 1 });
    } else {
      const current = this.michalTeeth.value;
      this.michalTeeth.next({ teethBrushed: current.teethBrushed + 1 });
    }
    this.saveStats(player);
  }

  getStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): TeethBrushingStats {
    return player === 'ANIA' ? this.aniaTeeth.value : player === 'NADIA' ? this.nadiaTeeth.value : this.michalTeeth.value;
  }
}
