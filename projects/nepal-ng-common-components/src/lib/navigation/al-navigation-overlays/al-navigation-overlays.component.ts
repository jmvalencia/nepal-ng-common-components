import { Input, Component, AfterViewInit, ViewChild } from '@angular/core';
import { AlManageExperienceService } from '../../navigation/services/al-manage-experience.service';
import { AlFeedbackComponent } from '../../al-feedback/al-feedback.component';
import { AlBetaGetStartedComponent } from '../../al-beta-get-started/al-beta-get-started.component';

@Component({
    selector: 'al-navigation-overlays',
    templateUrl: './al-navigation-overlays.component.html',
    styleUrls: ['./al-navigation-overlays.component.scss']
})

export class AlNavigationOverlaysComponent implements AfterViewInit {

    @ViewChild(AlFeedbackComponent) feedback: AlFeedbackComponent;
    @ViewChild(AlBetaGetStartedComponent) betaTutorial: AlBetaGetStartedComponent;

    constructor(public experienceManager: AlManageExperienceService) { }

    ngAfterViewInit() {
        this.experienceManager.setFeedbackComponent(this.feedback);
        this.experienceManager.setBetaTutorial(this.betaTutorial);
        this.experienceManager.loadNavigationExperience();
    }
}
