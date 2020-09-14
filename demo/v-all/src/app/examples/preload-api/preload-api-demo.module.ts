import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { RecaptchaLoaderService, RecaptchaModule, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';

import { parseLangFromHref } from '../../parse-lang-from-href';
import { PreloadApiDemoComponent } from './preload-api-demo.component';
import { settings } from './preload-api-demo.data';

@Injectable()
export class PreloadedRecaptchaAPIService {
  public ready: Observable<ReCaptchaV2.ReCaptcha>;

  constructor() {
    const readySubject = new BehaviorSubject<ReCaptchaV2.ReCaptcha>(null);
    this.ready = readySubject.asObservable();

    if (typeof grecaptcha === 'undefined') {
      const recaptchaScript = document.createElement('script');
      recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      document.head.appendChild(recaptchaScript);
    }

    const interval = setInterval(() => {
      if (typeof grecaptcha === 'undefined' || !(grecaptcha.render instanceof Function)) {
        return;
      }

      clearInterval(interval);
      readySubject.next(grecaptcha);
    }, 50);
  }
}

export const service = new PreloadedRecaptchaAPIService();

const routes: Routes = [
  {
    path: '',
    component: PreloadApiDemoComponent,
    data: { page: settings },
  },
];

@NgModule({
  declarations: [PreloadApiDemoComponent],
  imports: [
    RouterModule.forChild(routes),
    RecaptchaModule,
    CommonModule,
  ],
  providers: [
    {
      provide: RecaptchaLoaderService,
      useValue: service,
    },
    { provide: RECAPTCHA_LANGUAGE, useValue: parseLangFromHref() },
  ],
})
export class DemoModule { }
