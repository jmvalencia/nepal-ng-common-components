import { Injectable, EventEmitter } from '@angular/core';
import { AlToastMessage } from './types';

@Injectable({
    providedIn: 'root',
})
export class AlToastService
{
    private alToastButtonEmitters: any;
    private alToastShowEmitters: any;
    private alToastCloseEmitters: any;

    constructor() {
        this.alToastButtonEmitters = {};
        this.alToastShowEmitters = {};
        this.alToastCloseEmitters = {};
    }

    ngOnDestroy() {
        const keys = this.alToastShowEmitters.keys();
        keys.foreach((key: string) => {
            this.cleanEmitters(key);
        });
    }

    public getButtonEmitter(key: string): EventEmitter<any> {
        if(!this.alToastButtonEmitters.hasOwnProperty(key)) {
            this.alToastButtonEmitters[key] = new EventEmitter<any>();
        }
        return this.alToastButtonEmitters[key];
    }

    public getShowEmitter(key: string): EventEmitter<any> {
        if(!this.alToastShowEmitters.hasOwnProperty(key)) {
            this.alToastShowEmitters[key] = new EventEmitter<any>();
        }
        return this.alToastShowEmitters[key];
    }

    public getCloseEmitter(key: string): EventEmitter<any> {
        if(!this.alToastCloseEmitters.hasOwnProperty(key)) {
            this.alToastCloseEmitters[key] = new EventEmitter<any>();
        }
        return this.alToastCloseEmitters[key];
    }

    public showMessage(key: string, alToastMessage: AlToastMessage = {}) {
        alToastMessage.key = key;
        this.alToastShowEmitters[key].emit(alToastMessage);
    }

    public clearMessages(key: string) {
        this.alToastCloseEmitters[key].emit();
    }

    public emitButtonClicked(key: string, buttonClicked) {
        if(!this.alToastButtonEmitters.hasOwnProperty(key)) {
            this.alToastButtonEmitters[key] = new EventEmitter<any>();
        }
        this.alToastButtonEmitters[key].emit(buttonClicked);
    }

    public cleanEmitters(key: string) {
        if(!this.alToastButtonEmitters.hasOwnProperty(key)) {
            delete(this.alToastButtonEmitters[key]);
        }
        if(!this.alToastShowEmitters.hasOwnProperty(key)) {
            delete(this.alToastShowEmitters[key]);
        }
        if(!this.alToastCloseEmitters.hasOwnProperty(key)) {
            delete(this.alToastCloseEmitters[key]);
        }
    }
}
