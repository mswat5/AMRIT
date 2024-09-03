import Array "mo:base/Array";
import Nat "mo:base/Nat";
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
    private stable var facilityAccidentMap = Map.new<Text, [Text]>();

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
                switch (Map.get(facilityAccidentMap, thash, value)) {
                    case null {
                        Map.set(facilityAccidentMap, thash, value, [accidentId]);
                    };
                    case (?accidentIds) {
                        if (Array.find(accidentIds, func(id : Text) : Bool { id == accidentId }) == null) {
                            Map.set(facilityAccidentMap, thash, value, Array.append(accidentIds, [accidentId]));
                        };
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

    public shared ({ caller }) func updateAccidentStatus(accidentId : Text, newStatus : Types.AccidentStatus) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update accident status");
        };

        if (newStatus == #Reported or newStatus == #Resolved) {
            return #err("Accident status cannot be changed to Reported or Closed");
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
                        if (callerFacilityId != accident.details.reportingFacilityId and callerFacilityId != accident.details.currentFacilityId) {
                            return #err("Only the reporting facility or the currently assigned facility can update accident status");
                        };

                        if (newStatus == #Reported or newStatus == #Resolved) {
                            return #err("Accident status cannot be changed to Reported or Closed");
                        };

                        let updatedAccident : AccidentReport = {
                            accident with
                            status = newStatus;
                        };

                        Map.set(accidents, thash, accidentId, updatedAccident);

                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = accidentId;
                            patientId = ""; // No specific patient for this update
                            facilityId = callerFacilityId;
                            reportType = #AccidentReport;
                            timestamp = Time.now();
                            file = null;
                            details = "Accident status updated to " # debug_show (newStatus);
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {
                                #ok("Accident status updated successfully. Report ID: " # reportId);
                            };
                            case (#err(error)) {
                                #ok("Accident status updated successfully, but report generation failed: " # error);
                            };
                        };
                    };
                };
            };
        };
    };

    public shared ({ caller }) func editAccidentDetails(accidentId : Text, newDetails : Types.AccidentDetails) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to edit accident details");
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
                        if (callerFacilityId != accident.details.reportingFacilityId and callerFacilityId != accident.details.currentFacilityId) {
                            return #err("Only the reporting facility or the currently assigned facility can edit accident details");
                        };

                        let updatedDetails : Types.AccidentDetails = {
                            reportingFacilityId = accident.details.reportingFacilityId;
                            currentFacilityId = accident.details.currentFacilityId;

                            severity = newDetails.severity;
                            description = newDetails.description;
                            location = newDetails.location;
                        };

                        let updatedAccident : AccidentReport = {
                            accident with
                            details = updatedDetails;
                        };

                        Map.set(accidents, thash, accidentId, updatedAccident);

                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = accidentId;
                            patientId = ""; // No specific patient for this update
                            facilityId = callerFacilityId;
                            reportType = #AccidentReport;
                            timestamp = Time.now();
                            file = null;
                            details = "Accident details updated";
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {
                                #ok("Accident details updated successfully. Report ID: " # reportId);
                            };
                            case (#err(error)) {
                                #ok("Accident details updated successfully, but report generation failed: " # error);
                            };
                        };
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
                if (accident.status == #Resolved) {
                    return #err("This accident case has already been resolved");
                };

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

                        // Change patient status to discharged
                        switch (await patientCanister.updatePatientStatus(patientID, #Discharged, null)) {
                            case (#err(error)) {
                                return #err("Error updating patient status: " # error);
                            };
                            case (#ok(_)) {};
                        };

                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = accidentId;
                            patientId = patientID; // Include the patient ID in the closure report
                            facilityId = callerFacilityId;
                            reportType = #AccidentReport;
                            timestamp = Time.now();
                            file = file;
                            details = "Accident case closed and patient discharged";
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {

                                switch (await adminCanister.notifySpecificIncharges("Accident case closed with ID: " # accidentId # " and patient discharged", accidentId, inchargeIds, report)) {
                                    case (#ok(_value)) {
                                        #ok("Accident case closed successfully and patient discharged. Report ID: " # reportId);

                                    };
                                    case (#err(error)) {
                                        #err(error);
                                    };
                                };

                            };
                            case (#err(error)) {
                                #ok("Accident case closed successfully and patient discharged, but report generation failed: " # error);
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

    public shared ({ caller }) func getAccidentsByFacility() : async Result<[AccidentReport], Text> {
        let facilityId = await facilityCanister.getFacilityId(caller);
        switch (facilityId) {
            case (#ok(value)) {
                switch (Map.get(facilityAccidentMap, thash, value)) {
                    case null { #err("No accidents found for this facility") }; // No accidents found for this facility
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
            case (#err(error)) {
                return (#err(error));
            };
        };

    };

    public shared ({ caller }) func listActiveAccidentsForFacility() : async Result.Result<[AccidentReport], Text> {
        let facilityId = await facilityCanister.getFacilityId(caller);
        switch (facilityId) {
            case (#ok(id)) {
                switch (Map.get(facilityAccidentMap, thash, id)) {
                    case null { #err("No accidents found for this facility") }; // No accidents found for this facility
                    case (?accidentIds) {
                        let activeAccidents = Array.mapFilter<Text, AccidentReport>(
                            accidentIds,
                            func(accidentId : Text) : ?AccidentReport {
                                switch (Map.get(accidents, thash, accidentId)) {
                                    case (?accident) {
                                        if (accident.status != #Resolved) {
                                            ?accident;
                                        } else {
                                            null;
                                        };
                                    };
                                    case null { null };
                                };
                            },
                        );
                        #ok(activeAccidents);
                    };
                };
            };
            case (#err(error)) {
                #err("Error getting facility ID: " # error);
            };
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

    public shared ({ caller }) func getAccidentTimeline(accidentId : Text) : async Result<[Types.TimelineEvent], Text> {
        // Check if caller is admin
        if (await adminCanister.checkAdmin(caller)) {
            return await generateTimeline(accidentId);
        };

        return await generateTimeline(accidentId);

        // Check if caller is from a facility associated with the accident
        // switch (await facilityCanister.getFacilityId(caller)) {
        //     case (#ok(facilityId)) {
        //         switch (Map.get(facilityAccidentMap, thash, facilityId)) {
        //             case (?accidentIds) {
        //                 if (Array.find(accidentIds, func(id : Text) : Bool { id == accidentId }) != null) {
        //                     return await generateTimeline(accidentId);
        //                 };
        //             };
        //             case (null) {
        //                 // Continue to error
        //             };
        //         };
        //     };
        //     case (#err(_)) {
        //         // Continue to error
        //     };
        // };

        #err("Not authorized to view this accident timeline");
    };

    private func generateTimeline(accidentId : Text) : async Result<[Types.TimelineEvent], Text> {
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
            case (?_value) { return true };
            case (null) { return false };
        };
    };

    public func updateFacilityAccidentMap(facilityId : Text, accidentId : Text) : async Result<(), Text> {
        switch (Map.get(accidents, thash, accidentId)) {
            case null { #err("Accident not found") };
            case (?_accident) {
                switch (Map.get(facilityAccidentMap, thash, facilityId)) {
                    case null {
                        Map.set(facilityAccidentMap, thash, facilityId, [accidentId]);
                    };
                    case (?accidentIds) {
                        if (Array.find(accidentIds, func(id : Text) : Bool { id == accidentId }) == null) {
                            Map.set(facilityAccidentMap, thash, facilityId, Array.append(accidentIds, [accidentId]));
                        };
                    };
                };
                #ok(());
            };
        };
    };

};
