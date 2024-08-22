import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Map "mo:map/Map";
import { thash } "mo:map/Map";

import Types "Types";

actor class AmbulanceCanister() {
    type Ambulance = Types.Ambulance;
    type AmbulanceRegistration = Types.AmbulanceRegistration;
    type AccidentDetails = Types.AccidentDetails;
    type Result<T, E> = Result.Result<T, E>;

    private stable var ambulances = Map.new<Text, Ambulance>();

    public shared ({ caller }) func addAmbulance(id : Text, registration : AmbulanceRegistration) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to add ambulances");
        };

        let newAmbulance : Ambulance = {
            id = id;
            principal = registration.principal;
            name = registration.name;
            status = #Available;
            currentLocation = registration.location;
            assignedAccidentId = null;
            registrationStatus = #Approved;
        };

        Map.set(ambulances, thash, id, newAmbulance);
        #ok("Ambulance added successfully with ID: " # id);
    };

    public shared ({ caller }) func assignAmbulance(ambulanceId : Text, accidentId : Text) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to assign ambulances");
        };

        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null {
                #err("Ambulance not found");
            };
            case (?ambulance) {
                if (ambulance.status != #Available) {
                    return #err("Ambulance is not available");
                };
                let updatedAmbulance : Ambulance = {
                    ambulance with
                    status = #Assigned;
                    assignedAccidentId = ?accidentId;
                };
                Map.set(ambulances, thash, ambulanceId, updatedAmbulance);

                // Update accident status
                let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
                    updateAccidentStatus : (Text, Types.AccidentStatus) -> async Result<Text, Text>;
                };

                switch (await accidentCanister.updateAccidentStatus(accidentId, #ServiceAssigned)) {
                    case (#ok(_)) {
                        #ok("Ambulance assigned successfully and accident status updated");
                    };
                    case (#err(error)) {
                        // Log the error, but don't fail the ambulance assignment
                        #ok("Ambulance assigned successfully, but failed to update accident status: " # error);
                    };
                };
            };
        };
    };

    public shared ({ caller }) func updateAmbulanceStatus(ambulanceId : Text, status : Types.AmbulanceStatus) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update ambulance status");
        };

        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null { #err("Ambulance not found") };
            case (?ambulance) {
                let updatedAmbulance : Ambulance = {
                    ambulance with
                    status = status;
                    assignedAccidentId = if (status == #Available) null else ambulance.assignedAccidentId;
                };
                Map.set(ambulances, thash, ambulanceId, updatedAmbulance);
                #ok("Ambulance status updated successfully");
            };
        };
    };

    public shared ({ caller }) func updateAmbulanceLocation(ambulanceId : Text, location : Types.Location) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous principals are not allowed to update ambulance location");
        };

        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null { #err("Ambulance not found") };
            case (?ambulance) {
                let updatedAmbulance : Ambulance = {
                    ambulance with
                    currentLocation = location;
                };
                Map.set(ambulances, thash, ambulanceId, updatedAmbulance);
                #ok("Ambulance location updated successfully");
            };
        };
    };

    public query func getAmbulance(ambulanceId : Text) : async Result<Ambulance, Text> {
        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null { #err("Ambulance not found") };
            case (?ambulance) { #ok(ambulance) };
        };
    };

    public query func checkRegistrationStatus(ambulanceId : Text) : async Result<Types.RegistrationStatus, Text> {
        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null { #err("Ambulance not found") };
            case (?ambulance) { #ok(ambulance.registrationStatus) };
        };
    };

    public func getActiveAssignment(ambulanceId : Text) : async Result<AccidentDetails, Text> {
        switch (Map.get(ambulances, thash, ambulanceId)) {
            case null { #err("Ambulance not found") };
            case (?ambulance) {
                switch (ambulance.assignedAccidentId) {
                    case null { #err("No active assignment") };
                    case (?accidentId) {
                        let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
                            getAccidentDetails : (Text) -> async Result<Types.AccidentReport, Text>;
                        };
                        switch (await accidentCanister.getAccidentDetails(accidentId)) {
                            case (#ok(accidentReport)) {
                                #ok(accidentReport.details);
                            };
                            case (#err(error)) {
                                #err("Error fetching accident details: " # error);
                            };
                        };
                    };
                };
            };
        };
    };

    public query func getTotalAmbulances() : async Nat {
        Map.size(ambulances);
    };
};
