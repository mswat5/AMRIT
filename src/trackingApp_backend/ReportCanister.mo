import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:map/Map";
import { thash } "mo:map/Map";

import Types "Types";

actor class ReportCanister() {

    type Report = Types.Report;
    type Result<T, E> = Result.Result<T, E>;

    private stable var nextReportId : Nat = 1;
    private stable var reports = Map.new<Text, Report>();

    // Define an array of permitted principals
    private let permittedPrincipals : [Principal] = [
        Principal.fromText("br5f7-7uaaa-aaaaa-qaaca-cai"),
        Principal.fromText("by6od-j4aaa-aaaaa-qaadq-cai"),
        Principal.fromText("b77ix-eeaaa-aaaaa-qaada-cai"),
        Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai"),
        Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai"),
        Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai"),

    ];

    public shared ({ caller }) func generateReport(report : Report) : async Result<Text, Text> {

        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to generate reports");
        };

        let reportId = Nat.toText(nextReportId);
        nextReportId += 1;

        let newReport : Report = {
            report with
            id = reportId;
            timestamp = Time.now();
        };

        Map.set(reports, thash, reportId, newReport);
        #ok("Report generated successfully with ID: " # reportId);
    };

    public shared ({ caller }) func getReport(reportId : Text) : async Result<Report, Text> {
        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to generate reports");
        };

        switch (Map.get(reports, thash, reportId)) {
            case null { #err("Report not found") };
            case (?report) { #ok(report) };
        };
    };

    public shared ({ caller }) func listReportsForAccident(accidentId : Text) : async [Report] {
        if (not (await checkPermitted(caller))) {
            Debug.print("This principals are not allowed to generate reports");
        };
        let allReports = Iter.toArray(Map.vals(reports));
        Array.filter<Report>(
            allReports,
            func(report) { report.accidentId == accidentId },
        );
    };

    public shared ({ caller }) func listReportsForPatient(patientId : Text) : async [Report] {
        if (not (await checkPermitted(caller))) {
            Debug.print("This principals are not allowed to generate reports");
        };
        let allReports = Iter.toArray(Map.vals(reports));
        Array.filter<Report>(
            allReports,
            func(report) { report.patientId == patientId },
        );
    };

    public shared ({ caller }) func listReportsForFacility(facilityId : Text) : async [Report] {
        if (not (await checkPermitted(caller))) {
            Debug.print("This principals are not allowed to generate reports");
        };
        let allReports = Iter.toArray(Map.vals(reports));
        Array.filter<Report>(
            allReports,
            func(report) { report.facilityId == facilityId },
        );
    };

    public query func getTotalReports() : async Nat {
        Map.size(reports);
    };

    public shared ({ caller }) func getReportsByType(reportType : Types.ReportType) : async [Report] {
        if (not (await checkPermitted(caller))) {
            Debug.print("This principals are not allowed to generate reports");
        };
        let allReports = Iter.toArray(Map.vals(reports));
        Array.filter<Report>(
            allReports,
            func(report) { report.reportType == reportType },
        );
    };

    public shared ({ caller }) func updateReport(reportId : Text, updatedDetails : Text) : async Result<Text, Text> {
        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to update reports");
        };

        switch (Map.get(reports, thash, reportId)) {
            case null { #err("Report not found") };
            case (?report) {
                let updatedReport : Report = {
                    report with
                    details = updatedDetails;
                };
                Map.set(reports, thash, reportId, updatedReport);
                #ok("Report updated successfully");
            };
        };
    };

    public query func checkPermitted(caller : Principal) : async Bool {
        let result = Array.indexOf<Principal>(caller, permittedPrincipals, Principal.equal);
        switch (result) {
            case (?value) { return true };
            case (null) { return false };
        };
    };
};
