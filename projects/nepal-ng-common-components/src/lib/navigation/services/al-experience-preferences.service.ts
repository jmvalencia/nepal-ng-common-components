/**
 * SIEMlessPreferencesService
 * Service to save or get the Experience Preference via conduit (which uses localstorage)
 *
 * @author Bryan Tabarez <bryan.tabarez@alertlogic.com>
 *
 * @copyright Alert Logic, Inc 2019
 */
import { Injectable } from '@angular/core';
import { ALSession, AlConduitClient } from '@al/session';
import { ExperiencePreference } from '../types';

@Injectable({
    providedIn: 'root'
})
export class AlExperiencePreferencesService {
    protected conduit = new AlConduitClient();

    constructor( ) {
        this.conduit.start();
    }

    /**
     * Save the experience preference in localstorage through conduit to share it among the apps
     * @param value: string that stands for the experience preference setting to save
     */
    public saveExperiencePreferences(value: string): Promise<ExperiencePreference> {
        let expPreferences: ExperiencePreference;
        switch (value) {
            case 'initial':
            case 'back-default':
                this.deleteExperiencePreferences().then();
                break;
            case 'dismiss-beta':
                expPreferences = {
                    displayBetaNavigation: false,
                    dismissBetaForever: true
                };
                break;
            case 'not-right-now':
                expPreferences = {
                    displayBetaNavigation: false,
                    dismissBetaForever: false
                };
                break;
            case 'try-beta':
                expPreferences = {
                    displayBetaNavigation: true,
                    offerBetaTutorial: true
                };
                break;
            case 'beta-tutorial':
                expPreferences = {
                    displayBetaNavigation: true,
                    offerBetaTutorial: false
                };
                break;
            default:
                console.warn("AlExperiencePreferencesService: Ignoring unrecognized experience preference,: %s", value);
                return this.getExperiencePreferences();
        }

        return this.conduit.setGlobalSetting('experience_settings', expPreferences) as Promise<ExperiencePreference>;
    }

    public getExperiencePreferences(): Promise<ExperiencePreference> {
        return this.conduit.getGlobalSetting('experience_settings') as Promise<ExperiencePreference>;
    }

    public deleteExperiencePreferences(): Promise<boolean> {
        return this.conduit.deleteGlobalSetting('experience_settings') as Promise<boolean>;
    }

}
