import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:map/Map";
import { thash } "mo:map/Map";

import Types "Types";

actor class PatientCanister() {
    type PatientRecord = Types.PatientRecord;
    type Result<T, E> = Result.Result<T, E>;

    private stable var nextPatientId : Nat = 0;
    private stable var patients = Map.new<Text, PatientRecord>();

    // Notify Incharges
    private func notifyIncharges(details : Text, patientId : Text, inchargeIds : [Text]) : async () {
        let adminCanister = actor ("bd3sg-teaaa-aaaaa-qaaba-cai") : actor {
            notifySpecificIncharges : (Text, Text, [Text]) -> async ();
        };

        await adminCanister.notifySpecificIncharges(details, patientId, inchargeIds);
    };

    public shared ({ caller }) func createPatientRecord(record : PatientRecord, file : ?Blob, inchargeIds : [Text]) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to create patient records");
        };

        let patientId = Nat.toText(nextPatientId);
        nextPatientId += 1;

        let newRecord : PatientRecord = {
            id = patientId;
            accidentId = record.accidentId;
            name = record.name;
            age = record.age;
            currentFacilityId = record.currentFacilityId;
            status = #Admitted;
            treatmentDetails = "";

            admissionTimestamp = Time.now();
            dischargeTimestamp = null;
        };

        Map.set(patients, thash, patientId, newRecord);

        // Generate admission report
        let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
            generateReport : (Types.Report) -> async Result<Text, Text>;
        };
        let report : Types.Report = {
            id = ""; // Will be assigned by ReportCanister
            accidentId = record.accidentId;
            patientId = patientId;
            facilityId = record.currentFacilityId;
            reportType = #TreatmentReport;
            timestamp = Time.now();
            file = file;
            details = "Patient admitted to facility";
        };

        switch (await reportCanister.generateReport(report)) {
            case (#ok(reportId)) {
                await notifyIncharges("Patient admitted with ID: " # patientId, reportId, inchargeIds);
                #ok("Patient record created successfully with ID: " # patientId # ". Report ID: " # reportId);
            };
            case (#err(error)) {
                // Log the error, but don't fail the patient record creation
                // You might want to add some logging here
                #ok("Patient record created successfully with ID: " # patientId # ", but report generation failed: " # error);
            };
        };
    };

    public shared ({ caller }) func updatePatientStatus(patientId : Text, status : Types.PatientStatus, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update patient status");
        };

        switch (Map.get(patients, thash, patientId)) {
            case null { #err("Patient not found") };
            case (?patient) {
                let updatedPatient : PatientRecord = {
                    patient with
                    status = status;
                    dischargeTimestamp = if (status == #Discharged) ?Time.now() else patient.dischargeTimestamp;
                };
                Map.set(patients, thash, patientId, updatedPatient);

                // Generate status update report
                let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
                    generateReport : (Types.Report) -> async Result<Text, Text>;
                };
                let report : Types.Report = {
                    id = ""; // Will be assigned by ReportCanister
                    accidentId = patient.accidentId;
                    patientId = patientId;
                    facilityId = patient.currentFacilityId;
                    reportType = #TreatmentReport;
                    timestamp = Time.now();
                    file = file;
                    details = "Patient status updated to " # debug_show (status);
                };

                switch (await reportCanister.generateReport(report)) {
                    case (#ok(reportId)) {
                        #ok("Patient status updated successfully. Report ID: " # reportId);
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the status update
                        // You might want to add some logging here
                        #ok("Patient status updated successfully, but report generation failed: " # error);
                    };
                };
            };
        };
    };

    public shared ({ caller }) func updatePatientFacility(patientId : Text, newFacilityId : Text, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update patient facility");
        };

        switch (Map.get(patients, thash, patientId)) {
            case null { #err("Patient not found") };
            case (?patient) {
                let updatedPatient : PatientRecord = {
                    patient with
                    currentFacilityId = newFacilityId;
                    status = #InTransit;
                };
                Map.set(patients, thash, patientId, updatedPatient);

                // Generate facility transfer report
                let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
                    generateReport : (Types.Report) -> async Result<Text, Text>;
                };
                let report : Types.Report = {
                    id = ""; // Will be assigned by ReportCanister
                    accidentId = patient.accidentId;
                    patientId = patientId;
                    facilityId = newFacilityId;
                    reportType = #TransferReport;
                    timestamp = Time.now();
                    file = file;
                    details = "Patient transferred to new facility";
                };

                switch (await reportCanister.generateReport(report)) {
                    case (#ok(reportId)) {
                        #ok("Patient facility updated successfully. Report ID: " # reportId);
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the facility update
                        // You might want to add some logging here
                        #ok("Patient facility updated successfully, but report generation failed: " # error);
                    };
                };
            };
        };
    };

    public query func getPatientRecord(patientId : Text) : async Result<PatientRecord, Text> {
        switch (Map.get(patients, thash, patientId)) {
            case null { #err("Patient not found") };
            case (?patient) { #ok(patient) };
        };
    };

    public shared ({ caller }) func transferPatient(patientId : Text, newFacilityId : Text, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to transfer patients");
        };

        switch (Map.get(patients, thash, patientId)) {
            case null { #err("Patient not found") };
            case (?patient) {
                if (patient.currentFacilityId == newFacilityId) {
                    return #err("Patient is already in the specified facility");
                };

                // Update patient record
                let updatedPatient : PatientRecord = {
                    patient with
                    currentFacilityId = newFacilityId;
                    status = #InTransit;
                };
                Map.set(patients, thash, patientId, updatedPatient);

                // Update facility records
                let facilityCanister = actor ("br5f7-7uaaa-aaaaa-qaaca-cai") : actor {
                    updatePatientCount : (Text, Int) -> async Result<Text, Text>;
                };

                // Decrease patient count in the old facility
                ignore await facilityCanister.updatePatientCount(patient.currentFacilityId, -1);

                // Increase patient count in the new facility
                ignore await facilityCanister.updatePatientCount(newFacilityId, 1);

                // Generate transfer report
                let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
                    generateReport : (Types.Report) -> async Result<Text, Text>;
                };
                let report : Types.Report = {
                    id = ""; // Will be assigned by ReportCanister
                    accidentId = patient.accidentId;
                    patientId = patientId;
                    facilityId = newFacilityId;
                    reportType = #TransferReport;
                    timestamp = Time.now();
                    file = file;
                    details = "Patient transferred from facility " # patient.currentFacilityId # " to facility " # newFacilityId;
                };

                switch (await reportCanister.generateReport(report)) {
                    case (#ok(reportId)) {
                        #ok("Patient transferred successfully. Transfer report ID: " # reportId);
                    };
                    case (#err(error)) {
                        #err("Patient transferred, but error generating transfer report: " # error);
                    };
                };
            };
        };
    };

    public query func getTotalPatients() : async Nat {
        Map.size(patients);
    };
    public query func getPatientCurrentFacility(patientId : Text) : async Result<Text, Text> {
        switch (Map.get(patients, thash, patientId)) {
            case null { #err("Patient not found") };
            case (?patient) { #ok(patient.currentFacilityId) };
        };
    };
};
