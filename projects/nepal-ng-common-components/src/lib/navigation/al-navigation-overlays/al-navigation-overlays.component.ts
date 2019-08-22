import { Input, Component, AfterViewInit, ViewChild } from '@angular/core';
import { AlManageExperienceService } from '../../navigation/services/al-manage-experience.service';
import { AlFeedbackComponent } from '../../al-feedback/al-feedback.component';
import { AlTutorialComponent } from '../../al-tutorial/al-tutorial.component';

@Component({
    selector: 'al-navigation-overlays',
    templateUrl: './al-navigation-overlays.component.html',
    styleUrls: ['./al-navigation-overlays.component.scss']
})

export class AlNavigationOverlaysComponent implements AfterViewInit {

    @ViewChild(AlFeedbackComponent) feedback: AlFeedbackComponent;
    @ViewChild(AlTutorialComponent) betaTutorial: AlTutorialComponent;

    constructor(public experienceManager: AlManageExperienceService) { }

    ngAfterViewInit() {
        this.experienceManager.setFeedbackComponent(this.feedback);
        this.experienceManager.setBetaTutorial(this.betaTutorial);
        this.experienceManager.loadNavigationExperience();
    }
}
