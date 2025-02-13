import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FooterComponent } from './components/footer/footer.component';

import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
import { environment } from '../environments/environment';

// Import Google Maps Module
import { GoogleMapsModule } from '@angular/google-maps';
import { DevicesRegisterComponent } from './components/devices-register/devices-register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { PostComponent } from './components/post/post.component';
import { PostInteractionComponent } from './components/post-interaction/post-interaction.component';
import { SavedPostsComponent } from './components/saved-posts/saved-posts.component';
import { DashboardDetailComponent } from './components/dashboard-detail/dashboard-detail.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    MapComponent,
    DevicesRegisterComponent,
    ProfileComponent,
    CreateProfileComponent,
    PostComponent,
    PostInteractionComponent,
    SavedPostsComponent,
    DashboardDetailComponent,
    AboutUsComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    HttpClientModule,
    MatIconModule,
    MatCardModule,
    GoogleMapsModule  // Add GoogleMapsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
