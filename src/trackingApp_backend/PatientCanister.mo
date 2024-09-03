import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:map/Map";
import { thash } "mo:map/Map";

import AdminCanister "AdminCanister";
import FacilityCanister "FacilityCanister";
import ReportCanister "ReportCanister";
import Types "Types";

actor class PatientCanister() {
    type PatientRecord = Types.PatientRecord;
    type Result<T, E> = Result.Result<T, E>;
    type AdminCanister = AdminCanister.AdminCanister;
    type ReportCanister = ReportCanister.ReportCanister;

    type FacilityCanister = FacilityCanister.FacilityCanister;
    let adminCanister : AdminCanister = actor ("bd3sg-teaaa-aaaaa-qaaba-cai");
    let facilityCanister : FacilityCanister = actor ("br5f7-7uaaa-aaaaa-qaaca-cai");
    let reportCanister : ReportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai");

    let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
        getAccidentDetails : (Text) -> async Result<Types.AccidentReport, Text>;
        updateFacilityAccidentMap : (Text, Text) -> async Result<(), Text>;
    };

    private stable var nextPatientId : Nat = 1;
    private stable var patients = Map.new<Text, PatientRecord>();

    public shared ({ caller }) func createPatientRecord(record : PatientRecord, file : ?Blob, inchargeIds : [Text]) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to create patient records");
        };

        switch (await adminCanister.areAllIdsPresent(inchargeIds)) {
            case (false) {
                return #err(
                    "Incharge IDs are wrong, some incharge with IDs are not present"
                );
            };
            case (true) {};
        };

        let resultReportingFacilityID = await facilityCanister.getFacilityId(caller);
        switch (resultReportingFacilityID) {
            case (#err(err)) {
                #err("Your not registered as facility" # err);
            };
            case (#ok(facilityId)) {
                let accidentDetailsTemp = await accidentCanister.getAccidentDetails(record.accidentId);

                switch (accidentDetailsTemp) {
                    case (#err(error)) {
                        return (#err(error));
                    };
                    case (#ok(value)) {
                        if (value.status != #Reported) {
                            return #err("Patient record can only be created when accident status is Reported");
                        };
                        if (value.details.reportingFacilityId == facilityId or value.details.currentFacilityId == facilityId) {

                        } else (
                            return #err("You are not associated with this accident")
                        );
                    };

                };
                let patientId = Nat.toText(nextPatientId);
                nextPatientId += 1;

                let newRecord : PatientRecord = {
                    accidentId = record.accidentId;
                    name = record.name;
                    age = record.age;
                    treatmentDetails = record.treatmentDetails;
                    file = file;

                    id = patientId;
                    status = #Admitted;
                    currentFacilityId = facilityId;
                    admissionTimestamp = Time.now();
                    dischargeTimestamp = null;

                };

                Map.set(patients, thash, patientId, newRecord);

                // Generate admission report

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
                        ignore await adminCanister.notifySpecificIncharges("Patient record created successfully with ID: " # patientId # ". Report ID: " # reportId, reportId, inchargeIds, report);
                        #ok("Patient record created successfully with ID: " # patientId # ". Report ID: " # reportId);
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the patient record creation
                        // You might want to add some logging here
                        #ok("Patient record created successfully with ID: " # patientId # ", but report generation failed: " # error);
                    };
                };
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
                if (patient.status == #Discharged) {
                    return #err("Cannot update status of a discharged patient");
                };

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
                if (patient.status == #Discharged) {
                    return #err("Cannot update facility of a discharged patient");
                };
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

    public shared ({ caller }) func getPatientsForFacility() : async Result<[PatientRecord], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to get patient records");
        };

        // Get the caller's facility ID
        switch (await facilityCanister.getFacilityId(caller)) {
            case (#err(error)) {
                return #err("Error verifying caller's facility: " # error);
            };
            case (#ok(facilityId)) {
                // Check if the facility is registered
                switch (await facilityCanister.checkRegistrationStatus(facilityId)) {
                    case (#err(error)) {
                        return #err("Error checking facility registration: " # error);
                    };
                    case (#ok(status)) {
                        if (status != #Approved) {
                            return #err("Facility is not approved");
                        };
                    };
                };

                // Filter patients for the caller's facility
                let facilityPatients = Array.mapFilter<(Text, PatientRecord), PatientRecord>(
                    Iter.toArray(Map.entries(patients)),
                    func((_, patient) : (Text, PatientRecord)) : ?PatientRecord {
                        if (patient.currentFacilityId == facilityId) {
                            ?patient;
                        } else {
                            null;
                        };
                    },
                );

                #ok(facilityPatients);
            };
        };
    };

    public shared ({ caller }) func transferPatient(patientId : Text, newFacilityId : Text, file : ?Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to transfer patients");
        };

        switch (await facilityCanister.checkRegistrationStatus(newFacilityId)) {
            case (#err(err)) {
                return #err(err);
            };
            case (#ok(_value)) {
                switch (Map.get(patients, thash, patientId)) {
                    case null { #err("Patient not found") };
                    case (?patient) {
                        if (patient.status == #Discharged) {
                            return #err("Cannot transfer a discharged patient");
                        };
                        if (patient.currentFacilityId == newFacilityId) {
                            return #err("Patient is already in the specified facility");
                        };
                        switch (await facilityCanister.getFacilityId(caller)) {
                            case (#ok(value)) {
                                if (value == patient.currentFacilityId) {

                                } else {
                                    return #err("Patient is not currently with the facility");
                                };
                            };
                            case (#err(_error)) {
                                return #err("Patient is not currently with the facility");
                            };
                        };

                        // Update patient record
                        let updatedPatient : PatientRecord = {
                            patient with
                            currentFacilityId = newFacilityId;
                            status = #InTransit;
                        };
                        Map.set(patients, thash, patientId, updatedPatient);

                        // Update facility records
                        ignore await facilityCanister.updatePatientCount(patient.currentFacilityId, -1);
                        ignore await facilityCanister.updatePatientCount(newFacilityId, 1);

                        // Add entry in facility and accidents IDs map in accident canister
                        switch (await accidentCanister.updateFacilityAccidentMap(newFacilityId, patient.accidentId)) {
                            case (#err(error)) {
                                return #err("Failed to update facility-accident map: " # error);
                            };
                            case (#ok(_)) {
                                // Continue with report generation
                            };
                        };

                        // Generate transfer report
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
                                #err("Patient transferred and facility-accident map updated, but error generating transfer report: " # error);
                            };
                        };
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
