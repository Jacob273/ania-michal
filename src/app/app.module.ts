import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MatchingGameComponent } from './components/matching-game/matching-game.component';
import { BookTrackerComponent } from './components/book-tracker/book-tracker.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchingGameComponent,
    BookTrackerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
