
import { Directive, TemplateRef, ChangeDetectorRef, Input } from '@angular/core';
import { AlNavigationService } from '../services/al-navigation.service';
import { AlNavigationRouteMounted } from '../types/navigation.types';

@Directive({
    selector: '[alNavigationCustomSidenav]'
})
export class AlNavigationCustomSidenav {

    @Input()
    contentRef:TemplateRef<any> =   null;

    constructor(public alNavigation:AlNavigationService, public ref: ChangeDetectorRef) {
        this.alNavigation.events.attach( 'AlNavigationRouteMounted', this.onNavigationRouteMounted );
    }

    onNavigationRouteMounted = ( event:AlNavigationRouteMounted ) => {
        if ( event.container ) {
            if ( event.contentOutlet === 'sidenav' ) {
                this.ref.detectChanges();
                event.respond( this.contentRef );
            }
        }
    }

}
