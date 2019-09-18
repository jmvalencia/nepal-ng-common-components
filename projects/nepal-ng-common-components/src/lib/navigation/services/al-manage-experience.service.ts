/**
 * AlManageExperienceService
 *
 * @author Bryan Tabarez <bryan.tabarez@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Injectable } from '@angular/core';
import { AlExperiencePreferencesService } from './al-experience-preferences.service';
import { AlNavigationService } from './al-navigation.service';
import { AlToastService } from '../../al-toast/al-toast.service';
import { AlFeedbackComponent } from '../../al-feedback/al-feedback.component';
import { AlBetaGetStartedComponent } from '../../al-beta-get-started/al-beta-get-started.component';
import { AlGlobalizer } from '@al/common';
import { AlLocation, AlLocatorService } from '@al/common/locator';
import { ALSession, AlSessionEndedEvent } from '@al/session';
import { AlEntitlementCollection } from '@al/subscriptions';
import { ExperiencePreference } from '../types';

@Injectable({
    providedIn: 'root'
})
export class AlManageExperienceService {

    // toast setting to offer beta-navigation
    private toastBetaNav = {
        sticky: true,
        closable: false,
        data: {
            message: 'We have a new BETA experience for you to try. It includes all-new Dashboards and a new, '
                + 'action-centric navigation. Would you like to try it out?',
            buttons: [
                {
                    key: 'dismiss-beta',
                    label: 'don\'t show this message again',
                    class: 'p-col secondaryButton',
                    textAlign: 'left'
                },
                {
                    key: 'not-right-now',
                    label: 'not right now',
                    class: 'p-col-fixed',
                    textAlign: 'right'
                },
                {
                    key: 'try-beta',
                    label: 'yes!',
                    class: 'p-col-fixed',
                    textAlign: 'right'
                }
            ]
        }
    };

    // toast setting to offer a beta-navigation tutorial
    private toastBetaTutorial = {
        sticky: true,
        closable: false,
        data: {
            message: 'Want to know what to expect from the New Experience? For a refreshere later on, '
                + 'click “something” at the top of the page.',
            buttons: [
                {
                    key: 'beta-tutorial',
                    label: 'NO THANKS',
                    class: 'p-col secondaryButton',
                    textAlign: 'left'
                },
                {
                    key: 'show-beta-tutorial',
                    label: 'SHOW ME',
                    class: 'p-col-fixed',
                    textAlign: 'right'
                }
            ]
        }
    };

    // Feedback component
    private feedback;
    private betaTutorial;

    constructor(
        public experiencePreferences: AlExperiencePreferencesService,
        public alNavigation: AlNavigationService,
        public alToastService: AlToastService
    ) {
        this.alToastService.getButtonEmitter('global-toast').subscribe(button => {
            this.manageExperienceOption(button.key);
            this.alToastService.clearMessages('global-toast');
        });
        ALSession.notifyStream.attach( "AlSessionEnded", this.onSessionEnded );
        AlGlobalizer.expose( 'al.experienceManager', {
            routingHost: this,
            manageExperienceOption: (option: string) => {
                this.manageExperienceOption(option);
            }
        });
    }

    /**
     * Load the navigation experience - set experience, schema, feedback button, toast messages
     */
    public loadNavigationExperience() {
        ALSession.getPrimaryEntitlements().then((entitlements: AlEntitlementCollection) => {
            let hasBetaEntitlement = entitlements.evaluateExpression('beta_navigation');
            if (hasBetaEntitlement) {
                this.loadPreferences();
            } else {
                // it doesn't have the entitlement, set default or provided by inputs
                if (!this.alNavigation.getSchema()) {
                    this.alNavigation.setSchema("cie-plus2");
                }
                if (!this.alNavigation.getExperience()) {
                    this.alNavigation.setExperience("default");
                }
            }
        });
    }

    /**
     * Set the feedback component to interact
     */
    public setFeedbackComponent(feedback: AlFeedbackComponent) {
        this.feedback = feedback;
    }

    public setBetaTutorial(tutorial: AlBetaGetStartedComponent){
        this.betaTutorial  = tutorial;
    }

    /**
     * Save and load the experience preference selected through ToastComponent
     */
    public manageExperienceOption(option: string) {
        if (option === 'show-beta-tutorial') {
            this.betaTutorial.showTutorial();
            option = 'beta-tutorial';
        } else if (option === 'try-beta') {
            this.alNavigation.navigate.byNamedRoute('cd19:dashboards');
        } else if (option === 'back-default') {
            if ( AlLocatorService.getActingNode().locTypeId !== AlLocation.OverviewUI ) {
                this.alNavigation.navigate.byNamedRoute('cd17:overview');
            } else {
                // set schema/experience to default
                this.alNavigation.setSchema("cie-plus2");
                this.alNavigation.setExperience("default");
            }
        }
        this.experiencePreferences.saveExperiencePreferences(option).then(() => {
            this.loadNavigationExperience();
        });
    }

    protected onSessionEnded = (event: AlSessionEndedEvent) => {
        this.experiencePreferences.getExperiencePreferences().then((preferences: ExperiencePreference) => {
            // tslint:disable-next-line: no-boolean-literal-compare
            if (preferences && preferences.hasOwnProperty('dismissBetaForever') && preferences.dismissBetaForever === false) {
                console.warn("Removing experience_settings data from localstorage");
                this.experiencePreferences.deleteExperiencePreferences();
            }
        });
    }

    private loadPreferences() {
        this.experiencePreferences.getExperiencePreferences().then((preferences: ExperiencePreference) => {
            // check saved preferences if there are, otherwise, offer beta
            if (preferences) {
                if (preferences.displayBetaNavigation) {
                    this.alNavigation.setExperience('beta');
                    this.alNavigation.setSchema('siemless');
                    this.feedback.show();
                    if (preferences.offerBetaTutorial) {
                        this.alToastService.showMessage('global-toast', this.toastBetaTutorial);
                    }
                } else {
                    // displayBetaNavigation is false, set the default experience
                    if (!this.alNavigation.getSchema()) {
                      this.alNavigation.setSchema("cie-plus2");
                    }
                    if (!this.alNavigation.getExperience()) {
                        this.alNavigation.setExperience("default");
                    }
                }
            } else {
                // offer beta-nav as initial state
                if (!this.alNavigation.getSchema()) {
                  this.alNavigation.setSchema("cie-plus2");
                }
                if (!this.alNavigation.getExperience()) {
                    this.alNavigation.setExperience("default");
                }
                if (this.alNavigation.getExperience() === 'default' && this.alNavigation.getSchema() === 'cie-plus2') {
                  this.alToastService.showMessage('global-toast', this.toastBetaNav);
                  this.feedback.hide();
                }
            }
        });
    }

}
