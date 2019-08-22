import { Component, ViewChild, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { AlNavigationService } from '../../services/al-navigation.service';
import { ALSession, AlSessionEndedEvent, AlActingAccountResolvedEvent } from '@al/session';

@Component({
  selector: 'al-archipeligo17-header',
  templateUrl: './al-archipeligo17-header.component.html',
  styleUrls: [ './al-archipeligo17-header.component.scss' ]
})
export class AlArchipeligo17HeaderComponent implements OnInit, OnDestroy, OnChanges {

    public authenticated:boolean = false;

    protected subscriptions = [];

    constructor( public alNavigation:AlNavigationService ) {
    }

    ngOnInit() {
        this.authenticated = ALSession.isActive();
        this.subscriptions.push( this.alNavigation.events.attach( "AlActingAccountResolved", this.onActingAccountResolved ) );
        this.subscriptions.push( this.alNavigation.events.attach( "AlSessionEnded", this.onSessionEnded ) );
    }

    ngOnChanges( changes:SimpleChanges ) {
    }

    ngOnDestroy() {
        this.subscriptions.forEach( subscription => this.alNavigation.events.detach( subscription ) );
    }

    onSessionEnded = ( event:AlSessionEndedEvent ) => {
        this.authenticated = false;
    }

    onActingAccountResolved = ( event:AlActingAccountResolvedEvent ) => {
        this.authenticated = true;
    }
}
