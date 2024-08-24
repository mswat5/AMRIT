import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {

    public type InchargeType = {
        #DistrictHubCoordinator;
        #HubIncharge;
        #ClusterManager;
    };

    public type InchargeDetails = {
        id : Text;
        principal : Principal;
        name : Text;
        contactInfo : ContactInfo;
        inchargeType : InchargeType;
        registrationStatus : RegistrationStatus;
        certificationID : Text;
        location : Location;
    };

    public type ReportNotification = {
        reportId : Text;
        inchargeId : Text;
        timestamp : Time.Time;
        details : Text;
    };

    public type FacilityRegistration = {
        principal : Principal;
        name : Text;
        location : Location;
        services : [Text];
        capacity : Nat;
        contactInfo : ContactInfo;
        certificationID : Text;
    };

    public type Facility = {
        id : Text;
        principal : Principal;
        name : Text;
        location : Location;
        services : [Text];
        capacity : Nat;
        availableBeds : Nat;
        contactInfo : ContactInfo;
        registrationStatus : RegistrationStatus;
        certificationID : Text;
    };

    public type Location = {
        latitude : Float;
        longitude : Float;
        address : Text;
    };

    public type ContactInfo = {
        phoneNumber : Text;
        email : Text;
    };

    public type AccidentDetails = {
        location : Location;
        description : Text;
        severity : AccidentSeverity;
        reportingFacilityId : Text;
        currentFacilityId : Text;

    };

    public type AccidentSeverity = {
        #Minor;
        #Moderate;
        #Severe;
        #Critical;
    };

    public type AccidentStatus = {
        #Reported;
        #ServiceAssigned;
        #InProgress;
        #Resolved;
    };

    public type AccidentReport = {
        id : Text;
        details : AccidentDetails;
        status : AccidentStatus;
        timestamp : Time.Time;
    };

    public type PatientRecord = {
        id : Text;
        accidentId : Text;
        name : Text;
        age : Nat;
        currentFacilityId : Text;
        status : PatientStatus;
        treatmentDetails : Text;
        admissionTimestamp : Time.Time;
        dischargeTimestamp : ?Time.Time;
    };

    public type PatientStatus = {
        #Admitted;
        #UnderTreatment;
        #Stable;
        #Critical;
        #InTransit;
        #Discharged;
    };

    public type Ambulance = {
        id : Text;
        principal : Principal;
        name : Text;
        status : AmbulanceStatus;
        currentLocation : Location;
        assignedAccidentId : ?Text;
        registrationStatus : RegistrationStatus;
        certificationID : Text;
    };

    public type AmbulanceStatus = {
        #Available;
        #Assigned;
        #EnRoute;
        #OnSite;
        #Returning;
    };

    public type ReportType = {
        #AccidentReport;
        #TreatmentReport;
        #TransferReport;
    };

    public type Report = {
        id : Text;
        accidentId : Text;
        patientId : Text;
        facilityId : Text;
        reportType : ReportType;
        timestamp : Time.Time;
        details : Text;
        file : ?Blob; //
    };
    public type RegistrationStatus = {
        #Pending;
        #Approved;
        #Rejected;
    };

    public type UserDetails = {
        id : Text;
        principal : Principal;
        userType : { #Admin; #Facility; #Ambulance; #Incharge };
        name : Text;
        registrationStatus : RegistrationStatus;
        certificationID : Text;
    };

    public type AmbulanceRegistration = {
        principal : Principal;
        name : Text;
        location : Location;
        contactInfo : ContactInfo;
        certificationID : Text;
    };

    public type SystemOverview = {
        totalFacilities : Nat;
        totalAmbulances : Nat;
        totalPatients : Nat;
        activeAccidents : Nat;
    };

    public type TimelineEvent = {
        timestamp : Time.Time;
        status : Text;
        details : Text;
    };

    public type HttpRequestArgs = {
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [HttpHeader];
        body : ?[Nat8];
        method : HttpMethod;
        transform : ?TransformRawResponseFunction;
    };

    public type HttpHeader = {
        name : Text;
        value : Text;
    };

    public type HttpMethod = {
        #get;
        #post;
        #head;
    };

    public type HttpResponsePayload = {
        status : Nat;
        headers : [HttpHeader];
        body : [Nat8];
    };

    public type TransformRawResponseFunction = {
        function : shared query TransformArgs -> async HttpResponsePayload;
        context : Blob;
    };

    public type TransformArgs = {
        response : HttpResponsePayload;
        context : Blob;
    };

    public type CanisterHttpResponsePayload = {
        status : Nat;
        headers : [HttpHeader];
        body : [Nat8];
    };

    public type TransformContext = {
        function : shared query TransformArgs -> async HttpResponsePayload;
        context : Blob;
    };

    public type IC = actor {
        http_request : HttpRequestArgs -> async HttpResponsePayload;
    };
};
