import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'pl';

interface Translations {
  [key: string]: {
    en: string;
    pl: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<Language>('en');
  public currentLanguage$: Observable<Language> = this.currentLanguage.asObservable();

  private translations: Translations = {
    'favorite_things': {
      en: 'My Favorite Things',
      pl: 'Moje Ulubione Rzeczy'
    },
    'stars_earned': {
      en: 'Stars Earned',
      pl: 'Zdobyte Gwiazdki'
    },
    'drawing_painting': {
      en: 'Drawing & Painting',
      pl: 'Rysowanie i Malowanie'
    },
    'reading_books': {
      en: 'Reading Books',
      pl: 'Czytanie Książek'
    },
    'playing_games': {
      en: 'Playing Games',
      pl: 'Granie w Gry'
    },
    'making_crafts': {
      en: 'Making Crafts',
      pl: 'Robienie Rękodzieła'
    },
    'video_games': {
      en: 'Video Games',
      pl: 'Gry Wideo'
    },
    'sports_soccer': {
      en: 'Sports & Soccer',
      pl: 'Sport i Piłka Nożna'
    },
    'building_legos': {
      en: 'Building Legos',
      pl: 'Budowanie z Klocków'
    },
    'science_projects': {
      en: 'Science Projects',
      pl: 'Projekty Naukowe'
    },
    'learning_english': {
      en: 'Learning English',
      pl: 'Nauka Angielskiego'
    },
    'switch_language': {
      en: 'Switch to Polish',
      pl: 'Przełącz na Angielski'
    },
    'back_home': {
      en: 'Back to Home',
      pl: 'Powrót do Strony Głównej'
    },
    'match_words': {
      en: 'Match the English words with Polish translations!',
      pl: 'Dopasuj angielskie słowa do polskich tłumaczeń!'
    },
    'great_job': {
      en: 'Great Job! You matched them all!',
      pl: 'Świetna robota! Udało Ci się!'
    },
    'try_again': {
      en: 'Try Again',
      pl: 'Spróbuj Ponownie'
    },
    'correct': {
      en: 'Correct!',
      pl: 'Dobrze!'
    },
    'unfavorite_things': {
      en: 'Things I Don\'t Like',
      pl: 'Rzeczy Których Nie Lubię'
    },
    'cleaning_room': {
      en: 'Cleaning My Room',
      pl: 'Sprzątanie Pokoju'
    },
    'doing_homework': {
      en: 'Doing Homework',
      pl: 'Odrabianie Lekcji'
    },
    'going_to_bed_early': {
      en: 'Going to Bed Early',
      pl: 'Wczesne Kładzenie Się Spać'
    },
    'eating_vegetables': {
      en: 'Eating Vegetables',
      pl: 'Jedzenie Warzyw'
    },
    'brushing_teeth': {
      en: 'Brushing Teeth',
      pl: 'Mycie Zębów'
    },
    'book_collection': {
      en: '\'s Book Collection',
      pl: ' - Kolekcja Książek'
    },
    'add_new_book': {
      en: '+ Add New Book',
      pl: '+ Dodaj Nową Książkę'
    },
    'currently_reading': {
      en: 'Currently Reading',
      pl: 'Obecnie Czytam'
    },
    'completed_books': {
      en: 'Completed Books',
      pl: 'Przeczytane Książki'
    },
    'no_books_yet': {
      en: 'No Books Yet!',
      pl: 'Jeszcze Brak Książek!'
    },
    'start_tracking': {
      en: 'Click "Add New Book" to start tracking your reading journey.',
      pl: 'Kliknij "Dodaj Nową Książkę" aby zacząć śledzić swoją przygodę czytelniczą.'
    },
    'book_title': {
      en: 'Book Title',
      pl: 'Tytuł Książki'
    },
    'author': {
      en: 'Author',
      pl: 'Autor'
    },
    'completion_date': {
      en: 'Completion Date',
      pl: 'Data Ukończenia'
    },
    'rating': {
      en: 'Rating (1-5 stars)',
      pl: 'Ocena (1-5 gwiazdek)'
    },
    'add_book': {
      en: 'Add Book',
      pl: 'Dodaj Książkę'
    },
    'complete_book': {
      en: 'Complete Book',
      pl: 'Ukończ Książkę'
    },
    'mark_complete': {
      en: 'Mark as Complete',
      pl: 'Oznacz jako Przeczytane'
    },
    'in_progress': {
      en: 'In Progress',
      pl: 'W Trakcie'
    },
    'completed': {
      en: 'Completed',
      pl: 'Ukończone'
    },
    'finished': {
      en: 'Finished',
      pl: 'Ukończono'
    },
    'by_author': {
      en: 'by',
      pl: 'autor:'
    },
    'cancel': {
      en: 'Cancel',
      pl: 'Anuluj'
    },
    'delete_confirm': {
      en: 'Are you sure you want to delete this book?',
      pl: 'Czy na pewno chcesz usunąć tę książkę?'
    },
    'fill_required': {
      en: 'Please fill in title and author',
      pl: 'Proszę wypełnić tytuł i autora'
    },
    'enter_title': {
      en: 'Enter book title',
      pl: 'Wpisz tytuł książki'
    },
    'enter_author': {
      en: 'Enter author name',
      pl: 'Wpisz nazwisko autora'
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'en' || savedLang === 'pl') {
      this.currentLanguage.next(savedLang);
    }
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      return key;
    }
    return translation[this.currentLanguage.value];
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage.value;
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage.value === 'en' ? 'pl' : 'en';
    this.currentLanguage.next(newLang);
    localStorage.setItem('language', newLang);
  }
}
