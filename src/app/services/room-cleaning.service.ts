import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RoomStats {
  roomsCleaned: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomCleaningService {
  private readonly STORAGE_KEY_ANIA = 'ania-rooms-cleaned';
  private readonly STORAGE_KEY_NADIA = 'nadia-rooms-cleaned';
  private readonly STORAGE_KEY_MICHAL = 'michal-rooms-cleaned';

  private aniaRoomsSubject = new BehaviorSubject<RoomStats>(this.loadStats('ANIA'));
  private nadiaRoomsSubject = new BehaviorSubject<RoomStats>(this.loadStats('NADIA'));
  private michalRoomsSubject = new BehaviorSubject<RoomStats>(this.loadStats('MICHAL'));

  public aniaRooms$: Observable<RoomStats> = this.aniaRoomsSubject.asObservable();
  public nadiaRooms$: Observable<RoomStats> = this.nadiaRoomsSubject.asObservable();
  public michalRooms$: Observable<RoomStats> = this.michalRoomsSubject.asObservable();

  constructor() { }

  private loadStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): RoomStats {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : player === 'NADIA' ? this.STORAGE_KEY_NADIA : this.STORAGE_KEY_MICHAL;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return { roomsCleaned: 0 };
  }

  private saveStats(player: 'ANIA' | 'NADIA' | 'MICHAL', stats: RoomStats): void {
    const key = player === 'ANIA' ? this.STORAGE_KEY_ANIA : player === 'NADIA' ? this.STORAGE_KEY_NADIA : this.STORAGE_KEY_MICHAL;
    localStorage.setItem(key, JSON.stringify(stats));
  }

  getRoomStats(player: 'ANIA' | 'NADIA' | 'MICHAL'): RoomStats {
    return this.loadStats(player);
  }

  incrementRoomsCleaned(player: 'ANIA' | 'NADIA' | 'MICHAL'): void {
    const currentStats = this.loadStats(player);
    currentStats.roomsCleaned++;
    this.saveStats(player, currentStats);

    if (player === 'ANIA') {
      this.aniaRoomsSubject.next(currentStats);
    } else if (player === 'NADIA') {
      this.nadiaRoomsSubject.next(currentStats);
    } else {
      this.michalRoomsSubject.next(currentStats);
    }
  }
}
