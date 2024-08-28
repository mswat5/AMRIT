import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:map/Map";
import { thash } "mo:map/Map";

import AdminCanister "AdminCanister";
import AmbulanceCanister "AmbulanceCanister";
import FacilityCanister "FacilityCanister";
import PatientCanister "PatientCanister";
import ReportCanister "ReportCanister";
import Types "Types";

actor class AccidentCanister() {

    type AccidentReport = Types.AccidentReport;
    type Report = Types.Report;
    type Result<T, E> = Result.Result<T, E>;

    type FacilityCanister = FacilityCanister.FacilityCanister;
    type ReportCanister = ReportCanister.ReportCanister;
    type AmbulanceCanister = AmbulanceCanister.AmbulanceCanister;
    type PatientCanister = PatientCanister.PatientCanister;
    type AdminCanister = AdminCanister.AdminCanister;

    let facilityCanister : FacilityCanister = actor ("br5f7-7uaaa-aaaaa-qaaca-cai");
    let reportCanister : ReportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai");
    let ambulanceCanister : AmbulanceCanister = actor ("be2us-64aaa-aaaaa-qaabq-cai");
    let patientCanister : PatientCanister = actor ("b77ix-eeaaa-aaaaa-qaada-cai");
    let adminCanister : AdminCanister = actor ("bd3sg-teaaa-aaaaa-qaaba-cai");

    private stable var nextAccidentId : Nat = 1;
    private stable var accidents = Map.new<Text, AccidentReport>();
    private stable var facilityAccidents = Map.new<Text, [Text]>();

    // Define an array of permitted principals
    private let permittedPrincipals : [Principal] = [
        Principal.fromText("br5f7-7uaaa-aaaaa-qaaca-cai"),
        Principal.fromText("by6od-j4aaa-aaaaa-qaadq-cai"),
        Principal.fromText("b77ix-eeaaa-aaaaa-qaada-cai"),
        Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai"),
        Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai"),
        Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai"),

    ];

    public shared ({ caller }) func createAccidentReport(details : Types.AccidentDetails, file : ?Blob, inchargeIds : [Text]) : async Result<Text, Text> {

        switch (await adminCanister.areAllIdsPresent(inchargeIds)) {
            case (false) {
                return #err(
                    "Incharge IDs are wrong, some incharge with IDs are not present"
                );
            };
            case (true) {};
        };

        let accidentId = Nat.toText(nextAccidentId);

        let resultReportingFacilityID = await facilityCanister.getFacilityId(caller);
        switch (resultReportingFacilityID) {
            case (#ok(value)) {
                let newDetails : Types.AccidentDetails = {
                    reportingFacilityId = value;
                    currentFacilityId = value;

                    severity = details.severity;
                    description = details.description;
                    location = details.location;
                };

                let newReport : AccidentReport = {
                    id = accidentId;
                    details = newDetails;
                    status = #Reported;
                    timestamp = Time.now();
                };

                Map.set(accidents, thash, accidentId, newReport);

                // Update facilityAccidents
                switch (Map.get(facilityAccidents, thash, newDetails.reportingFacilityId)) {
                    case null {
                        Map.set(facilityAccidents, thash, newDetails.reportingFacilityId, [accidentId]);
                    };
                    case (?existingIds) {
                        Map.set(facilityAccidents, thash, newDetails.reportingFacilityId, Array.append(existingIds, [accidentId]));
                    };
                };

                let report : Types.Report = {
                    id = ""; // Will be assigned by ReportCanister
                    accidentId = accidentId;
                    patientId = ""; // No patient associated yet
                    facilityId = value;
                    reportType = #AccidentReport;
                    timestamp = Time.now();
                    file = file;
                    details = "New Iccident reported";
                };

                switch (await reportCanister.generateReport(report)) {
                    case (#ok(reportId)) {
                        switch (await adminCanister.notifySpecificIncharges("Accident registered with ID: " # accidentId, accidentId, inchargeIds, report)) {
                            case (#ok(value)) {
                                nextAccidentId += 1;
                                #ok("Accident report created successfully with ID: " # accidentId # ". Report ID: " # reportId);
                            };
                            case (#err(error)) {
                                #err("Failed to notify but other task successfully passed" # error);
                            };
                        };
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the accident report creation
                        #ok("Accident report created successfully with ID: " # accidentId # ", but report generation failed: " # error);
                    };
                };
            };
            case (#err(error)) {
                return #err(error);
            };
        };

    };

    public shared ({ caller }) func assignPatientToAccident(accidentId : Text, patientId : Text, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to assign patients to accidents");
        };

        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) {
                // Update patient record

                let patientUpdateResult = await patientCanister.updatePatientStatus(patientId, #UnderTreatment, file);

                switch (patientUpdateResult) {
                    case (#err(error)) {
                        return #err("Error updating patient status: " # error);
                    };
                    case (#ok(_)) {
                        // Continue with report generation
                    };
                };

                let report : Types.Report = {
                    id = ""; // Will be assigned by ReportCanister
                    accidentId = accidentId;
                    patientId = patientId;
                    facilityId = accident.details.reportingFacilityId;
                    reportType = #AccidentReport;
                    timestamp = Time.now();
                    file = file;
                    details = "Patient assigned to accident";
                };

                switch (await reportCanister.generateReport(report)) {
                    case (#ok(reportId)) {
                        #ok("Patient assigned to accident successfully. Report ID: " # reportId);
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the patient assignment
                        #ok("Patient assigned to accident successfully, but report generation failed: " # error);
                    };
                };
            };
        };
    };

    public query func getAccidentReport(accidentId : Text) : async Result<AccidentReport, Text> {

        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) { #ok(accident) };
        };
    };

    public shared ({ caller }) func closeAccidentCase(accidentId : Text, file : ?Blob, patientID : Text, inchargeIds : [Text]) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to close accident cases");
        };

        switch (await adminCanister.areAllIdsPresent(inchargeIds)) {
            case (false) {
                return #err(
                    "Incharge IDs are wrong, some incharge with IDs are not present"
                );
            };
            case (true) {};
        };

        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) {

                let facilityResult = await facilityCanister.getFacilityId(caller);
                switch (facilityResult) {
                    case (#err(error)) {
                        return #err("Error verifying facility: " # error);
                    };
                    case (#ok(callerFacilityId)) {
                        // Get the patient's current facility

                        let patientResult = await patientCanister.getPatientCurrentFacility(patientID);
                        switch (patientResult) {
                            case (#err(error)) {
                                return #err("Error getting patient's current facility: " # error);
                            };
                            case (#ok(patientFacilityId)) {
                                if (callerFacilityId != patientFacilityId) {
                                    return #err("Only the facility where the patient is currently admitted can close this accident case");
                                };
                            };
                        };

                        let closedAccident : AccidentReport = {
                            accident with
                            status = #Resolved;
                        };
                        Map.set(accidents, thash, accidentId, closedAccident);

                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = accidentId;
                            patientId = patientID; // Include the patient ID in the closure report
                            facilityId = callerFacilityId;
                            reportType = #AccidentReport;
                            timestamp = Time.now();
                            file = file;
                            details = "Accident case closed";
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {

                                switch (await adminCanister.notifySpecificIncharges("Accident case closed with ID: " # accidentId, accidentId, inchargeIds, report)) {
                                    case (#ok(value)) {
                                        #ok("Accident case closed successfully. Report ID: " # reportId);

                                    };
                                    case (#err(error)) {
                                        #err(error);
                                    };
                                };

                            };
                            case (#err(error)) {
                                #ok("Accident case closed successfully, but report generation failed: " # error);
                            };
                        };
                    };
                };

            };
        };
    };

    public shared ({ caller }) func reassignAmbulance(accidentId : Text, newAmbulanceId : Text, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to reassign ambulances");
        };

        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) {
                // Call AmbulanceCanister to reassign the ambulance

                switch (await ambulanceCanister.assignAmbulance(newAmbulanceId, accidentId)) {
                    case (#ok(message)) {

                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = accidentId;
                            patientId = ""; // No specific patient
                            facilityId = accident.details.reportingFacilityId;
                            reportType = #AccidentReport;
                            timestamp = Time.now();
                            file = file;
                            details = "Ambulance reassigned. New Ambulance ID: " # newAmbulanceId;
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {
                                #ok("Ambulance reassigned successfully. " # message # " Report ID: " # reportId);
                            };
                            case (#err(error)) {
                                #ok("Ambulance reassigned successfully, but report generation failed: " # error);
                            };
                        };
                    };
                    case (#err(error)) {
                        #err("Error reassigning ambulance: " # error);
                    };
                };
            };
        };
    };

    public query func getAccidentsByFacility(facilityId : Text) : async Result<[AccidentReport], Text> {
        switch (Map.get(facilityAccidents, thash, facilityId)) {
            case null { #ok([]) }; // No accidents found for this facility
            case (?accidentIds) {
                let facilityAccidents = Array.mapFilter<Text, AccidentReport>(
                    accidentIds,
                    func(id : Text) : ?AccidentReport {
                        Map.get(accidents, thash, id);
                    },
                );
                #ok(facilityAccidents);
            };
        };
    };

    public query func listActiveAccidents() : async Result.Result<[AccidentReport], Text> {

        switch (Iter.toArray(Map.vals(accidents))) {
            case ((value)) { #ok(value) };
            case ((error)) { #err("Error gettinng the active accidents") };
        };
    };

    public shared ({ caller }) func getAccidentDetails(accidentId : Text) : async Result<AccidentReport, Text> {
        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to get accident details");
        };
        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) { #ok(accident) };
        };
    };

    public query func getActiveAccidentsCount() : async Nat {
        Map.size(accidents);
    };

    public func getAccidentTimeline(accidentId : Text) : async Result<[Types.TimelineEvent], Text> {
        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?accident) {
                var timeline : [Types.TimelineEvent] = [];

                // Add initial event
                timeline := Array.append(timeline, [{ timestamp = accident.timestamp; status = debug_show (accident.status); details = "Accident Reported" }]);

                // Get all reports for this accident

                let reports = await reportCanister.listReportsForAccident(accidentId);

                // Add events for each report
                for (report in reports.vals()) {
                    timeline := Array.append(timeline, [{ timestamp = report.timestamp; status = getStatusFromReport(report); details = report.details }]);
                };

                // Sort timeline by timestamp
                timeline := Array.sort<Types.TimelineEvent>(
                    timeline,
                    func(a : Types.TimelineEvent, b : Types.TimelineEvent) : Order.Order {
                        if (a.timestamp < b.timestamp) { #less } else if (a.timestamp > b.timestamp) {
                            #greater;
                        } else { #equal };
                    },
                );

                #ok(timeline);
            };
        };
    };

    private func getStatusFromReport(report : Report) : Text {
        switch (report.reportType) {
            case (#AccidentReport) { "Accident Update" };
            case (#TreatmentReport) { "Treatment Update" };
            case (#TransferReport) { "Patient Transfer" };
        };
    };

    public func checkPermitted(caller : Principal) : async Bool {
        let result = Array.indexOf<Principal>(caller, permittedPrincipals, Principal.equal);
        switch (result) {
            case (?value) { return true };
            case (null) { return false };
        };
    };

};
