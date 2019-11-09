import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { WINDOW } from '@datatypes/injection-token.datatypes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AccessibilityModule } from './modules/accessibility';
import { ActivityModule } from './modules/activity';
import { DialogModule } from './modules/dialog';
import { HelpCenterComponent } from './pages/help-center/help-center.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    HelpCenterComponent,
    FooterComponent,
    NavigationComponent
  ],
  imports: [
    AccessibilityModule,
    ActivityModule,
    AppRoutingModule,
    BrowserModule,
    DialogModule,
    FormsModule
  ],
  providers: [
    { provide: WINDOW, useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
