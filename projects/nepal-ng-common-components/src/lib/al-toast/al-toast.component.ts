import { Input, Component, Output, EventEmitter } from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'al-toast',
    templateUrl: './al-toast.component.html',
    styleUrls: ['./al-toast.component.scss']
})


export class AlToastComponent {

    @Input() key = 'al-toast';
    @Input() position = 'bottom-center';

    @Output() buttonClicked = new EventEmitter<any>();

    constructor(private messageService: MessageService) { }

    clickEvent($event) {
        this.buttonClicked.emit($event);
    }

    /**
     * Send a notification to the toast component
     * @param title Title of the toast message
     * @param message Message of the toast
     * @param data Additional data of the toast
     */
    public showMessage(title: string, message: string, data: AlToastMessage = {}) {
        this.messageService.add(
            {
                summary: title,
                detail: message,
                key: this.key,
                sticky: data.sticky,
                closable: data.closable,
                data: {
                    iconClass: data.iconClass,
                    buttons: data.buttons,
                    textAlign: data.textAlign
                }
            });
    }

    public close() {
        this.messageService.clear(this.key);
    }
}

export interface AlToastMessage {
    sticky?: boolean;
    closable?: boolean;
    life?: number;
    buttons?: Array<AlToastButtonDescriptor>;
    iconClass?: string;
    textAlign?: string;
}

export interface AlToastButtonDescriptor {
    key: string;
    label: string;
    class?: string;
    textAlign?: string;
    disable?: boolean;
}
