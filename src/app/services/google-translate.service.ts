import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {
  private scriptId = 'google-translate-script';

  loadScript(): void {
    // Evita carregar o script múltiplas vezes
    if (document.getElementById(this.scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = this.scriptId;
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }
}
