import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:map/Map";
import { phash; thash } "mo:map/Map";

import Types "Types";

actor class FacilityCanister() {
    type Facility = Types.Facility;
    type FacilityRegistration = Types.FacilityRegistration;
    type AccidentDetails = Types.AccidentDetails;
    type Result<T, E> = Result.Result<T, E>;

    // Define an array of permitted principals
    private let permittedPrincipals : [Principal] = [
        Principal.fromText("br5f7-7uaaa-aaaaa-qaaca-cai"),
        Principal.fromText("by6od-j4aaa-aaaaa-qaadq-cai"),
        Principal.fromText("b77ix-eeaaa-aaaaa-qaada-cai"),
        Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai"),
        Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai"),
        Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")

    ];

    private stable var facilities = Map.new<Text, Facility>();
    private stable var principalToFacilityId = Map.new<Principal, Text>();

    public shared ({ caller }) func addFacility(id : Text, registration : FacilityRegistration) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to add facilities");
        };
        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to generate reports");
        };

        let newFacility : Facility = {
            id = id;
            principal = registration.principal;
            name = registration.name;
            location = registration.location;
            services = registration.services;
            capacity = registration.capacity;
            availableBeds = registration.capacity;
            contactInfo = registration.contactInfo;
            registrationStatus = #Approved;
            certificationID = registration.certificationID;
        };

        Map.set(facilities, thash, id, newFacility);
        Map.set(principalToFacilityId, phash, registration.principal, id);

        #ok("Facility added successfully with ID: " # id);
    };

    public shared query ({ caller }) func getFacilityDetails() : async Result<Facility, Text> {
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case null { #err("Facility not found for caller") };
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) { #ok(facility) };
                };
            };
        };
    };

    public shared ({ caller }) func updateAvailableBeds(beds : Nat) : async Result<Text, Text> {
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case null { #err("Facility not found for caller") };
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) {
                        if (facility.principal != caller) {
                            return #err("Only the facility owner can update available beds");
                        };
                        let updatedFacility = {
                            facility with availableBeds = beds
                        };
                        Map.set(facilities, thash, facilityId, updatedFacility);
                        #ok("Available beds updated successfully");
                    };
                };
            };
        };
    };

    public shared ({ caller }) func reportAccident(accidentDetails : AccidentDetails, file : ?Blob) : async Result<Text, Text> {
        switch (Map.get(principalToFacilityId, phash, (caller))) {
            case null { #err("Facility not found for caller") };
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) {
                        if (facility.principal != caller) {
                            return #err("Only the facility owner can report accidents");
                        };

                        // Call AccidentCanister to create a new accident report
                        let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
                            createAccidentReport : (AccidentDetails, ?Blob) -> async Result<Text, Text>;
                        };

                        switch (await accidentCanister.createAccidentReport(accidentDetails, file)) {
                            case (#ok(accidentId)) {
                                #ok("Accident reported successfully. Accident ID: " # accidentId);
                            };
                            case (#err(error)) {
                                #err("Error creating accident report: " # error);
                            };
                        };
                    };
                };
            };
        };
    };

    public query func listFacilities() : async [Facility] {
        Iter.toArray(Map.vals(facilities));
    };

    public shared ({ caller }) func updateFacilityServices(services : [Text]) : async Result<Text, Text> {
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case null { #err("Facility not found for caller") };
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) {
                        if (facility.principal != caller) {
                            return #err("Only the facility owner can update services");
                        };
                        let updatedFacility = {
                            facility with services = services
                        };
                        Map.set(facilities, thash, facilityId, updatedFacility);
                        #ok("Facility services updated successfully");
                    };
                };
            };
        };
    };

    public shared ({ caller }) func requestAdditionalResources(resourceType : Text, quantity : Nat, file : Blob) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to request additional resources");
        };
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) {
                        if (facility.principal != caller) {
                            return #err("Only the facility owner can request additional resources");
                        };

                        // Find nearby facilities (this is a simplified version, you might want to implement a more sophisticated algorithm)
                        let nearbyFacilities = Iter.toArray(
                            Iter.filter(
                                Map.vals(facilities),
                                func(f : Facility) : Bool {
                                    f.id != facilityId and f.availableBeds > 0
                                },
                            )
                        );

                        if (nearbyFacilities.size() == 0) {
                            return #err("No nearby facilities with available resources found");
                        };

                        // For simplicity, we'll just request from the first available facility
                        let targetFacility = nearbyFacilities[0];

                        // Generate resource request report
                        let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
                            generateReport : (Types.Report) -> async Result<Text, Text>;
                        };
                        let report : Types.Report = {
                            id = ""; // Will be assigned by ReportCanister
                            accidentId = ""; // No specific accident
                            patientId = ""; // No specific patient
                            facilityId = facilityId;
                            reportType = #TransferReport;
                            timestamp = Time.now();
                            file = ?file;
                            details = "Resource request: " # resourceType # ", Quantity: " # Nat.toText(quantity) # ", Target Facility: " # targetFacility.id;
                        };

                        switch (await reportCanister.generateReport(report)) {
                            case (#ok(reportId)) {
                                #ok("Additional resources requested successfully from facility " # targetFacility.id # ". Report ID: " # reportId);
                            };
                            case (#err(error)) {
                                #err("Error generating report for resource request: " # error);
                            };
                        };
                    };
                };
            };
            case (null) { #err("Facility not found for caller") };
        };

    };

    public shared ({ caller }) func updatePatientCount(facilityId : Text, change : Int) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update patient counts");
        };
        // switch (Map.get(principalToFacilityId, phash, caller)) {
        //     case (?facilityId) {
        switch (Map.get(facilities, thash, facilityId)) {
            case null { #err("Facility not found") };
            case (?facility) {
                let currentOccupied = facility.capacity - facility.availableBeds;
                let newOccupied = Int.max(0, Int.min(facility.capacity, currentOccupied + change));
                let newAvailableBeds = Int.max(0, facility.capacity - newOccupied);

                let updatedFacility = {
                    facility with
                    availableBeds = Int.abs(newAvailableBeds)
                };
                Map.set(facilities, thash, facilityId, updatedFacility);
                #ok("Patient count updated successfully");
            };
        };
        //     };
        //     case (null) { #err("Facility not found for caller") };
        // };
    };

    public shared ({ caller }) func getAccidentsReportedByFacility() : async Result<[Types.AccidentReport], Text> {
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case null { #err("Facility not found for caller") };
            case (?facilityId) {
                switch (Map.get(facilities, thash, facilityId)) {
                    case null { #err("Facility not found") };
                    case (?facility) {
                        if (facility.principal != caller) {
                            return #err("Only the facility owner can retrieve their reported accidents");
                        };

                        // Call AccidentCanister to get accidents reported by this facility
                        let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
                            getAccidentsByFacility : (Text) -> async Result<[Types.AccidentReport], Text>;
                        };

                        switch (await accidentCanister.getAccidentsByFacility(facilityId)) {
                            case (#ok(accidents)) {
                                #ok(accidents);
                            };
                            case (#err(error)) {
                                #err("Error retrieving accidents: " # error);
                            };
                        };
                    };
                };
            };
        };
    };

    public query func checkRegistrationStatus(facilityId : Text) : async Result<Types.RegistrationStatus, Text> {
        switch (Map.get(facilities, thash, facilityId)) {
            case (null) { #err("Facility not found") };
            case (?facility) { #ok(facility.registrationStatus) };
        };
    };

    public func getActiveCases() : async Result<[AccidentDetails], Text> {
        let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
            listActiveAccidents : () -> async [Types.AccidentReport];
        };

        let activeAccidents = await accidentCanister.listActiveAccidents();
        #ok(Array.map(activeAccidents, func(accident : Types.AccidentReport) : AccidentDetails { accident.details }));
    };

    public shared ({ caller }) func getFacilityId(callerCheck : Principal) : async Result.Result<Text, Text> {
        if (not (await checkPermitted(caller))) {
            return #err("This principals are not allowed to update reports");
        };

        switch (Map.get(principalToFacilityId, phash, callerCheck)) {
            case (?id) {
                return #ok(id);
            };
            case (null) { #err("Facility not found for caller") };
        };
    };

    public shared query ({ caller }) func getFacilityIdSelf() : async Result.Result<Text, Text> {
        switch (Map.get(principalToFacilityId, phash, caller)) {
            case (?id) {
                return #ok(id);
            };
            case (null) { #err("Facility not found for caller") };
        };
    };
    public query func getTotalFacilities() : async Nat {
        Map.size(facilities);
    };

    public query func getNearestFacilities(service : Text, lat : Float, lon : Float) : async  Result.Result< [Facility], Text> {
        let facilitiesWithService = Array.filter<Facility>(
            Iter.toArray(Map.vals(facilities)),
            func(facility : Facility) : Bool {
                Array.find<Text>(facility.services, func(s) { s == service }) != null;
            },
        );

        let facilitiesWithDistance = Array.map<Facility, (Facility, Float)>(
            facilitiesWithService,
            func(facility : Facility) : (Facility, Float) {
                let distance = calculateDistance(lat, lon, facility.location.latitude, facility.location.longitude);
                (facility, distance);
            },
        );

        let sortedFacilities = Array.sort<(Facility, Float)>(
            facilitiesWithDistance,
            func(a : (Facility, Float), b : (Facility, Float)) : Order.Order {
                if (a.1 < b.1) { #less } else if (a.1 > b.1) { #greater } else {
                    #equal;
                };
            },
        );

        let nearestFacilitiesBuffer = Buffer.Buffer<Facility>(3);
        label l for (facilityWithDistance in sortedFacilities.vals()) {
            if (nearestFacilitiesBuffer.size() < 3) {
                nearestFacilitiesBuffer.add(facilityWithDistance.0);
            } else {
                break l;

            };
        };

        #ok(Buffer.toArray(nearestFacilitiesBuffer));
    };

    private func calculateDistance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
        let R = 6371.0; // Earth's radius in kilometers
        let dLat = degToRad(lat2 - lat1);
        let dLon = degToRad(lon2 - lon1);
        let a = Float.sin(dLat / 2) * Float.sin(dLat / 2) +
        Float.cos(degToRad(lat1)) * Float.cos(degToRad(lat2)) * Float.sin(dLon / 2) * Float.sin(dLon / 2);
        let c = 2 * Float.arctan2(Float.sqrt(a), Float.sqrt(1 -a));
        R * c;
    };
    private func degToRad(deg : Float) : Float {
        deg * Float.pi / 180.0;
    };

    public query func checkPermitted(caller : Principal) : async Bool {
        let result = Array.indexOf<Principal>(caller, permittedPrincipals, Principal.equal);
        switch (result) {
            case (?_value) { return true };
            case (null) { return false };
        };
    };
};
