import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Book {
  id: string;
  title: string;
  author: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  status: 'in-progress' | 'completed';
}

interface BookCollection {
  [player: string]: Book[];
}

@Injectable({
  providedIn: 'root'
})
export class BookTrackingService {
  private aniaBooks = new BehaviorSubject<Book[]>([]);
  private michalBooks = new BehaviorSubject<Book[]>([]);

  public aniaBooks$: Observable<Book[]> = this.aniaBooks.asObservable();
  public michalBooks$: Observable<Book[]> = this.michalBooks.asObservable();

  constructor() {
    this.loadBooks();
  }

  private loadBooks(): void {
    const aniaData = localStorage.getItem('aniaBooks');
    const michalData = localStorage.getItem('michalBooks');

    if (aniaData) {
      this.aniaBooks.next(JSON.parse(aniaData));
    }
    if (michalData) {
      this.michalBooks.next(JSON.parse(michalData));
    }
  }

  private saveBooks(player: 'ANIA' | 'MICHAL'): void {
    if (player === 'ANIA') {
      localStorage.setItem('aniaBooks', JSON.stringify(this.aniaBooks.value));
    } else {
      localStorage.setItem('michalBooks', JSON.stringify(this.michalBooks.value));
    }
  }

  getBooks(player: 'ANIA' | 'MICHAL'): Book[] {
    return player === 'ANIA' ? this.aniaBooks.value : this.michalBooks.value;
  }

  addBook(player: 'ANIA' | 'MICHAL', book: Omit<Book, 'id'>): void {
    const newBook: Book = {
      ...book,
      id: this.generateId(),
      status: book.endDate ? 'completed' : 'in-progress'
    };

    const books = this.getBooks(player);
    const updatedBooks = [...books, newBook];

    if (player === 'ANIA') {
      this.aniaBooks.next(updatedBooks);
    } else {
      this.michalBooks.next(updatedBooks);
    }

    this.saveBooks(player);
  }

  updateBook(player: 'ANIA' | 'MICHAL', bookId: string, updates: Partial<Book>): void {
    const books = this.getBooks(player);
    const updatedBooks = books.map(book => {
      if (book.id === bookId) {
        const updated = { ...book, ...updates };
        updated.status = updated.endDate ? 'completed' : 'in-progress';
        return updated;
      }
      return book;
    });

    if (player === 'ANIA') {
      this.aniaBooks.next(updatedBooks);
    } else {
      this.michalBooks.next(updatedBooks);
    }

    this.saveBooks(player);
  }

  deleteBook(player: 'ANIA' | 'MICHAL', bookId: string): void {
    const books = this.getBooks(player);
    const updatedBooks = books.filter(book => book.id !== bookId);

    if (player === 'ANIA') {
      this.aniaBooks.next(updatedBooks);
    } else {
      this.michalBooks.next(updatedBooks);
    }

    this.saveBooks(player);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
