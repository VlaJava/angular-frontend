import { Component } from '@angular/core';

// import { RouterOutlet } from '@angular/router';

// Os imports de cada parte do app.
import { HeaderComponent } from './components/header/header.component';
import { TravelPackagesComponent } from './pages/home/travel-packages/travel-packages.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    //RouterOutlet,
    HeaderComponent,
    TravelPackagesComponent, 
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'viajava-app';
}
