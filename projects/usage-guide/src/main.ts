import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AlLocatorService, AlLocationDescriptor } from '@al/common/locator';

/**
 * Configure AlLocatorService
 */
const locations:AlLocationDescriptor[] = [  {
        locTypeId: "usage-guide",
        uri: window.location.origin,
        aliases: [ `http://localhost:*` ],
        environment: 'development'
    } ];
AlLocatorService.setLocations( locations );

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
