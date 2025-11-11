import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BookTrackingService, Book } from '../../services/book-tracking.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-book-tracker',
  template: `
    <div class="book-tracker-container" [class.ania-theme]="playerName === 'ANIA'" [class.michal-theme]="playerName === 'MICHAL'">
      <button class="back-button" (click)="goBack()">
        ← {{ translate('back_home') }}
      </button>

      <div class="tracker-header">
        <h1 class="player-name">{{ playerName }}{{ translate('book_collection') }} 📚</h1>
      </div>

      <button class="add-book-button" (click)="openAddModal()">
        {{ translate('add_new_book') }}
      </button>

      <div class="books-container">
        <!-- In Progress Books -->
        <div class="book-section" *ngIf="inProgressBooks.length > 0">
          <h2 class="section-title">📖 {{ translate('currently_reading') }}</h2>
          <div class="books-grid">
            <div *ngFor="let book of inProgressBooks" class="book-card in-progress">
              <div class="book-header">
                <h3 class="book-title">{{ book.title }}</h3>
                <button class="delete-btn" (click)="deleteBook(book.id)">×</button>
              </div>
              <p class="book-author">{{ translate('by_author') }} {{ book.author }}</p>
              <div class="book-status">
                <span class="status-badge in-progress-badge">📖 {{ translate('in_progress') }}</span>
              </div>
              <button class="complete-btn" (click)="openEditModal(book)">
                {{ translate('mark_complete') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Completed Books -->
        <div class="book-section" *ngIf="completedBooks.length > 0">
          <h2 class="section-title">✅ {{ translate('completed_books') }}</h2>
          <div class="books-grid">
            <div *ngFor="let book of completedBooks" class="book-card completed">
              <div class="book-header">
                <h3 class="book-title">{{ book.title }}</h3>
                <button class="delete-btn" (click)="deleteBook(book.id)">×</button>
              </div>
              <p class="book-author">{{ translate('by_author') }} {{ book.author }}</p>
              <div class="book-rating" *ngIf="book.rating">
                <span *ngFor="let star of getStars(book.rating)" class="star">⭐</span>
              </div>
              <p class="book-date" *ngIf="book.endDate">
                {{ translate('finished') }}: {{ book.endDate }}
              </p>
              <div class="book-status">
                <span class="status-badge completed-badge">✅ {{ translate('completed') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="books.length === 0">
          <div class="empty-icon">📚</div>
          <h3>{{ translate('no_books_yet') }}</h3>
          <p>{{ translate('start_tracking') }}</p>
        </div>
      </div>

      <!-- Add/Edit Book Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2>{{ editingBook ? translate('complete_book') : translate('add_new_book') }}</h2>

          <div class="form-group" *ngIf="!editingBook">
            <label>{{ translate('book_title') }} *</label>
            <input type="text" [(ngModel)]="formData.title" [placeholder]="translate('enter_title')">
          </div>

          <div class="form-group" *ngIf="!editingBook">
            <label>{{ translate('author') }} *</label>
            <input type="text" [(ngModel)]="formData.author" [placeholder]="translate('enter_author')">
          </div>

          <div class="form-group" *ngIf="editingBook">
            <label>{{ translate('completion_date') }}</label>
            <input type="date" [(ngModel)]="formData.endDate">
          </div>

          <div class="form-group">
            <label>{{ translate('rating') }}</label>
            <div class="star-rating">
              <span
                *ngFor="let star of [1,2,3,4,5]"
                class="rating-star"
                [class.selected]="star <= (formData.rating || 0)"
                (click)="setRating(star)">
                {{ star <= (formData.rating || 0) ? '⭐' : '☆' }}
              </span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" (click)="closeModal()">{{ translate('cancel') }}</button>
            <button class="save-btn" (click)="saveBook()">{{ editingBook ? translate('complete_book') : translate('add_book') }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .book-tracker-container {
      min-height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      font-family: 'Quicksand', sans-serif;
    }

    .ania-theme {
      background: linear-gradient(135deg, #ff6b9d 0%, #ffa5c8 100%);
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
    }

    .back-button:hover {
      transform: scale(1.05);
    }

    .tracker-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .player-name {
      font-size: 48px;
      color: white;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
      margin: 0;
    }

    .add-book-button {
      display: block;
      margin: 0 auto 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 30px;
      padding: 15px 40px;
      font-size: 22px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
    }

    .add-book-button:hover {
      transform: scale(1.1);
    }

    .books-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .book-section {
      margin-bottom: 40px;
    }

    .section-title {
      color: white;
      font-size: 32px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin-bottom: 20px;
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .book-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .book-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }

    .book-title {
      font-size: 20px;
      color: #333;
      margin: 0;
      flex: 1;
    }

    .delete-btn {
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
      transition: all 0.3s ease;
    }

    .delete-btn:hover {
      background: #ff5252;
      transform: scale(1.2);
    }

    .book-author {
      color: #666;
      font-size: 16px;
      margin: 5px 0 15px 0;
      font-style: italic;
    }

    .book-rating {
      font-size: 24px;
      margin: 10px 0;
    }

    .book-date {
      color: #888;
      font-size: 14px;
      margin: 10px 0;
    }

    .book-status {
      margin-top: 15px;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 14px;
      font-weight: bold;
    }

    .in-progress-badge {
      background: #fff3cd;
      color: #856404;
    }

    .completed-badge {
      background: #d4edda;
      color: #155724;
    }

    .complete-btn {
      width: 100%;
      margin-top: 15px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
    }

    .complete-btn:hover {
      background: #45a049;
      transform: scale(1.05);
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      color: #333;
      font-size: 28px;
      margin-bottom: 10px;
    }

    .empty-state p {
      color: #666;
      font-size: 18px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 30px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }

    .modal-content h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #333;
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .form-group input[type="text"],
    .form-group input[type="date"] {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 10px;
      font-size: 16px;
      font-family: 'Quicksand', sans-serif;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .star-rating {
      display: flex;
      gap: 10px;
      font-size: 36px;
    }

    .rating-star {
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .rating-star:hover {
      transform: scale(1.2);
    }

    .modal-actions {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .cancel-btn, .save-btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Quicksand', sans-serif;
    }

    .cancel-btn {
      background: #f0f0f0;
      color: #333;
    }

    .cancel-btn:hover {
      background: #e0e0e0;
    }

    .save-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .save-btn:hover {
      transform: scale(1.05);
    }
  `]
})
export class BookTrackerComponent implements OnInit {
  @Input() playerName: string = 'ANIA';
  @Output() backToHome = new EventEmitter<void>();

  books: Book[] = [];
  inProgressBooks: Book[] = [];
  completedBooks: Book[] = [];

  showModal: boolean = false;
  editingBook: Book | null = null;
  formData: any = {
    title: '',
    author: '',
    endDate: '',
    rating: 0
  };

  constructor(
    private bookService: BookTrackingService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    const player = this.playerName as 'ANIA' | 'MICHAL';
    this.books = this.bookService.getBooks(player);
    this.categorizeBooks();

    // Subscribe to changes
    if (player === 'ANIA') {
      this.bookService.aniaBooks$.subscribe(books => {
        this.books = books;
        this.categorizeBooks();
      });
    } else {
      this.bookService.michalBooks$.subscribe(books => {
        this.books = books;
        this.categorizeBooks();
      });
    }
  }

  categorizeBooks(): void {
    this.inProgressBooks = this.books.filter(book => book.status === 'in-progress');
    this.completedBooks = this.books.filter(book => book.status === 'completed');
  }

  openAddModal(): void {
    this.editingBook = null;
    this.formData = {
      title: '',
      author: '',
      endDate: '',
      rating: 0
    };
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.editingBook = book;
    this.formData = {
      title: book.title,
      author: book.author,
      endDate: book.endDate || this.getTodayDate(),
      rating: book.rating || 0
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBook = null;
  }

  saveBook(): void {
    const player = this.playerName as 'ANIA' | 'MICHAL';

    if (this.editingBook) {
      // Update existing book (mark as complete)
      this.bookService.updateBook(player, this.editingBook.id, {
        endDate: this.formData.endDate,
        rating: this.formData.rating
      });
    } else {
      // Add new book
      if (!this.formData.title || !this.formData.author) {
        alert(this.translate('fill_required'));
        return;
      }
      this.bookService.addBook(player, {
        title: this.formData.title,
        author: this.formData.author,
        endDate: this.formData.endDate,
        rating: this.formData.rating || undefined,
        status: this.formData.endDate ? 'completed' : 'in-progress'
      });
    }

    this.closeModal();
  }

  deleteBook(bookId: string): void {
    if (confirm(this.translate('delete_confirm'))) {
      const player = this.playerName as 'ANIA' | 'MICHAL';
      this.bookService.deleteBook(player, bookId);
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  setRating(rating: number): void {
    this.formData.rating = rating;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  goBack(): void {
    this.backToHome.emit();
  }
}
