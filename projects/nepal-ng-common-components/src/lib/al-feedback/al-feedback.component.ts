import { Component } from '@angular/core';

@Component({
    selector: 'al-feedback',
    templateUrl: './al-feedback.component.html',
    styleUrls: ['./al-feedback.component.scss']
})

export class AlFeedbackComponent {
    public feedbackReason: any;
    public reasons = [
        { label: 'Select a reason', value: null },
        { label: "Reason 1", value: 1 },
        { label: "Reason 2", value: 2 },
        { label: "Reason 3", value: 3 },
        { label: "Reason 4", value: 4 }
    ];
    public showFeedbackDialog: boolean = false;
    public feedbackText: string;
    public showFeedbackOption = false;

    constructor() { }

    show(){
        this.showFeedbackOption = true;
    }

    hide(){
        this.showFeedbackOption = false;
    }

    toogleFeedbackDialog(): void {
        this.showFeedbackDialog = !this.showFeedbackDialog;
        this.resetInputs();
    }

    isDisabledSubmit(): boolean {
        let disabled = true;
        if (this.feedbackText && this.feedbackText !== "" && this.feedbackReason) {
            disabled = false;
        }
        return disabled;
    }

    resetInputs(): void {
        this.feedbackText = null;
        this.feedbackReason = null;
    }

    submitFeedback(): void {
        console.log("TEXT:   ", this.feedbackText);
        console.log("REASON: ", this.feedbackReason);
        this.toogleFeedbackDialog();
    }
}
