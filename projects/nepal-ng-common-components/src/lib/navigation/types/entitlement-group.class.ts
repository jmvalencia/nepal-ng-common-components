
/**
 *  Shared groups of product families.  Meant to correspond with definitions from the metadata for ui-metadata's menu definitions.
 */

/* tslint:disable:variable-name */
export class EntitlementGroup {

    //  Log Manager
    public static LogManager:string     =   "log_manager|cloud_defender";

    //  Threat Manager
    public static ThreatManager:string  =   "threat_manager|cloud_defender";

    //  Full Suite
    public static CloudDefender:string  =   "cloud_defender";

    //  WAF
    public static WAF:string            =   "web_application_firewall";

    //  OOB (WAF)
    public static WAFOOB:string         =   "web_security_manager|cloud_defender";

    //  Log Manager or Threat Manager
    public static Dunkirk:string        =   "threat_manager|log_manager|cloud_defender";

    //  Usage access for TM and OOB WSM
    public static Usage:string        =   "threat_manager|web_security_manager|cloud_defender";

    //  Any Defender product (or full suite)
    public static AnyDefender:string    =   "log_manager|threat_manager|web_security_manager|cloud_defender";

    //  Cloud Insight (included in full suite)
    public static CloudInsight:string   =   "cloud_insight|cloud_defender";

    //  Literally anything, except for legacy features
    public static Anything:string       =   "cloud_insight|web_application_firewall|web_security_manager|cloud_defender|threat_manager|log_manager|detect|respond|assess";

    //  Incidents
    public static Incidents:string      =   "cloud_insight|cloud_defender|threat_manager|log_manager|detect|respond";

    //  Incidents Guardduty
    public static IncidentsGuardduty:string = "cloud_insight|cloud_defender&web_application_firewall|web_security_manager|cloud_defender|threat_manager|log_manager&!legacy:customer_facing_incidents";

    //  Incidents Cloud Insight Only
    public static IncidentsCloudInsightOnly:string = "cloud_insight&!web_application_firewall|web_security_manager|cloud_defender|threat_manager|log_manager|legacy:customer_facing_incidents";

    //  Incidents V2
    public static IncidentsV2:string = "legacy:customer_facing_incidents|respond|detect";

    // Incidents dashboard to exclude non-CI customers
    public static CloudInsightOnly:string = "cloud_insight&!active_watch_premier|web_security_managed|web_security_manager|cloud_defender|threat_manager|log_manager";

    //  LogReview
    public static LogReview:string      =   "cloud_defender|log_review";

    //  Literally anything, except for WAF features
    public static AnythingButWAF:string =   "cloud_insight|web_security_manager|cloud_defender|threat_manager|log_manager";

    //  Literally anything, except for WAF features
    public static AnythingButWAFIncidents:string =   "cloud_insight|web_security_manager|cloud_defender|threat_manager|log_manager|detect|respond";

    // WSM Deny Logs needs to be available for Inline WAF and OOB WSM customers
    public static WSMDenyLogs:string    =   "web_application_firewall";

    // LM Messages needs to be available for LM, Inline WAF and OOB WSM customers
    public static LogManagerMessages:string = "cloud_defender|log_manager|web_security_manager|web_application_manager|web_application_firewall&!detect|respond";

    // Search tab needs to be available for "NON CI ONLY"
    public static AnythingButCloudInsight:string = "web_application_firewall|web_security_manager|cloud_defender|threat_manager|log_manager|detect|respond";

    // ThreatManager or LogManager
    public static ThreatManagerOrLogManager:string = "threat_manager|log_manager|cloud_defender";

    /** PHOENIX aka Awareness-Detection-Response (Assess-Detect-Respond) */

    // Awareness - assess
    public static Awareness: string = "assess";

    // Detection - detect
    public static Detection: string = "detect";

    // Response - respond
    public static Response: string = "respond";

    // Any Phoenix product
    public static ADR: string = "assess|detect|respond";

    // Phoenix and migrated Phoenix product
    public static anyPhoenix: string = "assess|detect|respond|phoenix_migrated";

    // ThreatManagerDetectResponse for Events
    public static ThreatManagerDetectResponse: string = "threat_manager|cloud_defender|detect|respond";

    // AnythingButCloudInsightOrDetectResponse for cases
    public static AnythingButCloudInsightOrDetectResponse: string = "web_application_firewall|web_security_manager|cloud_defender|threat_manager|log_manager";

    // LogSearchBeta
    public static LogSearchBeta: string = "detect|respond&!cloud_defender|log_manager|web_security_manager|web_application_manager|web_application_firewall";

    // Remediations
    public static Remediations: string = "cloud_insight|cloud_defender|detect|respond|assess";
}
