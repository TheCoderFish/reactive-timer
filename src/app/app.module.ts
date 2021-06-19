import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    HeaderComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
