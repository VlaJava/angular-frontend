import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleTranslateService } from '../../services/google-translate.service'; 

declare const google: any;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private googleTranslateService: GoogleTranslateService) { }

  ngOnInit(): void {
  
    (window as any).googleTranslateElementInit = () => {
      new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'en,es,pt',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element_footer'); 
    };


    this.googleTranslateService.loadScript();
  }
}
