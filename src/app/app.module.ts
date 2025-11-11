import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MatchingGameComponent } from './components/matching-game/matching-game.component';
import { BookTrackerComponent } from './components/book-tracker/book-tracker.component';
import { LoginComponent } from './components/login/login.component';
import { CleaningGameComponent } from './components/cleaning-game/cleaning-game.component';
import { BedtimeGameComponent } from './components/bedtime-game/bedtime-game.component';
import { TeethBrushingGameComponent } from './components/teeth-brushing-game/teeth-brushing-game.component';
import { VegetableGameComponent } from './components/vegetable-game/vegetable-game.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchingGameComponent,
    BookTrackerComponent,
    LoginComponent,
    CleaningGameComponent,
    BedtimeGameComponent,
    TeethBrushingGameComponent,
    VegetableGameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
