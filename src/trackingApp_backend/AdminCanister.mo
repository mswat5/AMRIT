import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";

import Map "mo:map/Map";
import { thash } "mo:map/Map";


import Types "Types";

actor class AdminCanister() {
  type FacilityRegistration = Types.FacilityRegistration;
  type AmbulanceRegistration = Types.AmbulanceRegistration;
  type UserDetails = Types.UserDetails;
  type SystemOverview = Types.SystemOverview;
  type InchargeDetails = Types.InchargeDetails;
  type ReportNotification = Types.ReportNotification;
  type Result<T, E> = Result.Result<T, E>;

  private stable var nextUserId : Nat = 1;
  private stable var pendingFacilities = Map.new<Text, FacilityRegistration>();
  private stable var pendingAmbulances = Map.new<Text, AmbulanceRegistration>();
  private stable var users = Map.new<Text, UserDetails>();

  private stable var idAdminRegistered = false;
  private stable var admin = "";

  private stable var pendingIncharges = Map.new<Text, InchargeDetails>();
  private stable var approvedIncharges = Map.new<Text, InchargeDetails>();
  private stable var inchargeReports = Map.new<Text, [Text]>(); // InchargeId -> [ReportId]
  private stable var inchargeReportAccess = Map.new<Text, [{ reportId : Text; patientId : Text; accidentId : Text }]>();

  public shared query ({ caller }) func whoami() : async Text {
    return Principal.toText(caller);
  };

  public shared ({ caller }) func registerFacility(registration : FacilityRegistration) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to register facilities");
    };

    let userId = Nat.toText(nextUserId);
    nextUserId += 1;

    let userDetails : UserDetails = {
      id = userId;
      principal = caller;
      userType = #Facility;
      name = registration.name;
      registrationStatus = #Pending;
      certificationID = registration.certificationID;
    };

    let registrationFill : FacilityRegistration = {
      registration with principal = caller;
    };

    Map.set(users, thash, userId, userDetails);
    Map.set(pendingFacilities, thash, userId, registrationFill);
    #ok("Facility registration submitted with ID: " # userId);
  };

  public shared ({ caller }) func approveFacility(facilityId : Text) : async Result<Text, Text> {

    //Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingFacilities, thash, facilityId)) {
      case null { #err("No pending registration found with ID: " # facilityId) };
      case (?registration) {
        Map.delete(pendingFacilities, thash, facilityId);

        // Update user status
        switch (Map.get(users, thash, facilityId)) {
          case null {
            return #err("User not found for facility ID: " # facilityId);
          };
          case (?user) {
            let updatedUser = { user with registrationStatus = #Approved };
            Map.set(users, thash, facilityId, updatedUser);
          };
        };

        // Call FacilityCanister to add the approved facility
        let facilityCanister = actor ("br5f7-7uaaa-aaaaa-qaaca-cai") : actor {
          addFacility : (Text, FacilityRegistration) -> async Result<Text, Text>;
        };

        switch (await facilityCanister.addFacility(facilityId, registration)) {
          case (#ok(message)) {
            #ok("Facility approved and added successfully. " # message);
          };
          case (#err(error)) {
            #err("Error adding facility to FacilityCanister: " # error);
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectFacility(facilityId : Text) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to reject facilities");
    };

    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingFacilities, thash, facilityId)) {
      case null {
        return #err("No pending facility found with ID: " # facilityId);
      };
      case (?registration) {
        Map.delete(pendingFacilities, thash, facilityId);
        Map.delete(users, thash, facilityId);
        #ok("Facility rejected successfully with ID: " # facilityId);
      };
    };
  };
  public shared ({ caller }) func registerAmbulance(registration : AmbulanceRegistration) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to register ambulances");
    };

    let userId = Nat.toText(nextUserId);
    nextUserId += 1;

    let userDetails : UserDetails = {
      id = userId;
      principal = caller;
      userType = #Ambulance;
      name = registration.name;
      registrationStatus = #Pending;
      certificationID = registration.certificationID;
    };

    let registrationFill : AmbulanceRegistration = {
      registration with principal = caller;
    };

    Map.set(users, thash, userId, userDetails);
    Map.set(pendingAmbulances, thash, userId, registrationFill);
    #ok("Ambulance registration submitted with ID: " # userId);
  };

  public shared ({ caller }) func approveAmbulance(ambulanceId : Text) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to approve ambulances");
    };
    //Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingAmbulances, thash, ambulanceId)) {
      case null { #err("No pending ambulance found with ID: " # ambulanceId) };
      case (?registration) {
        Map.delete(pendingAmbulances, thash, ambulanceId);

        // Update user status
        switch (Map.get(users, thash, ambulanceId)) {
          case null {
            return #err("User not found for ambulance ID: " # ambulanceId);
          };
          case (?user) {
            let updatedUser = { user with registrationStatus = #Approved };
            Map.set(users, thash, ambulanceId, updatedUser);
          };
        };

        // Call AmbulanceCanister to add the approved ambulance
        let ambulanceCanister = actor ("be2us-64aaa-aaaaa-qaabq-cai") : actor {
          addAmbulance : (Text, AmbulanceRegistration) -> async Result<Text, Text>;
        };

        switch (await ambulanceCanister.addAmbulance(ambulanceId, registration)) {
          case (#ok(message)) {
            #ok("Ambulance approved and added successfully. " # message);
          };
          case (#err(error)) {
            #err("Error adding ambulance to AmbulanceCanister: " # error);
          };
        };
      };
    };
  };

  public shared ({ caller }) func rejectAmbulance(ambulanceId : Text) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to reject ambulances");
    };

    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingAmbulances, thash, ambulanceId)) {
      case null {
        return #err("No pending ambulance found with ID: " # ambulanceId);
      };
      case (?registration) {
        Map.delete(pendingAmbulances, thash, ambulanceId);
        Map.delete(users, thash, ambulanceId);
        #ok("Ambulance rejected successfully with ID: " # ambulanceId);
      };
    };
  };

  public shared ({ caller }) func listPendingRegistrations() : async Result.Result<[(Text, FacilityRegistration)], Text> {
    //Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };
    #ok(Map.toArray(pendingFacilities));
  };

  public shared ({ caller }) func listPendingAmbulances() : async Result.Result<[(Text, AmbulanceRegistration)], Text> {
    //Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };
    #ok(Map.toArray(pendingAmbulances));
  };

  public shared ({ caller }) func listPendingIncharges() : async Result.Result<[(Text, InchargeDetails)], Text> {
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };
    #ok(Map.toArray(pendingIncharges));
  };

  public query func listUsers() : async Result.Result<[(Text, UserDetails)], Text> {
    //Admin Check

    switch (Map.toArray(users)) {
      case (value) { #ok(value) };
      case (error) { #err("Failed to get the Users ") };
    };
  };

  public shared ({ caller }) func getUserDetails(userId : Text) : async Result<UserDetails, Text> {
    //Admin Check
    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(users, thash, userId)) {
      case null { #err("User not found") };
      case (?user) { #ok(user) };
    };
  };

  public shared ({ caller }) func getSystemOverview() : async Result<SystemOverview, Text> {
    //Admin Check
    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    let facilityCanister = actor ("br5f7-7uaaa-aaaaa-qaaca-cai") : actor {
      getTotalFacilities : () -> async Nat;
    };
    let ambulanceCanister = actor ("be2us-64aaa-aaaaa-qaabq-cai") : actor {
      getTotalAmbulances : () -> async Nat;
    };
    let patientCanister = actor ("b77ix-eeaaa-aaaaa-qaada-cai") : actor {
      getTotalPatients : () -> async Nat;
    };
    let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
      getActiveAccidentsCount : () -> async Nat;
    };

    let totalFacilities = await facilityCanister.getTotalFacilities();
    let totalAmbulances = await ambulanceCanister.getTotalAmbulances();
    let totalPatients = await patientCanister.getTotalPatients();
    let activeAccidents = await accidentCanister.getActiveAccidentsCount();

    #ok({
      totalFacilities = totalFacilities;
      totalAmbulances = totalAmbulances;
      totalPatients = totalPatients;
      activeAccidents = activeAccidents;
    });
  };

  // Register Incharge
  public shared ({ caller }) func registerIncharge(details : InchargeDetails) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to register incharges");
    };

    let userId = Nat.toText(nextUserId);
    nextUserId += 1;

    let userDetails : UserDetails = {
      id = userId;
      principal = caller;
      userType = #Incharge;
      name = details.name;
      registrationStatus = #Pending;
      certificationID = details.certificationID;
    };

    let inchargeDetails : InchargeDetails = {
      id = userId;
      principal = caller;
      name = details.name;
      contactInfo = details.contactInfo;
      inchargeType = details.inchargeType;
      registrationStatus = #Pending;
      certificationID = details.certificationID;
      location = details.location;
    };

    Map.set(pendingIncharges, thash, userId, inchargeDetails);
    Map.set(users, thash, userId, userDetails);

    #ok("Incharge registration submitted with ID: " # userId);
  };

  // Approve Incharge
  public shared ({ caller }) func approveIncharge(inchargeId : Text) : async Result<Text, Text> {

    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to approve incharges");
    };

    //Admin Check
    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingIncharges, thash, inchargeId)) {
      case null {
        return #err("No pending incharge found with ID: " # inchargeId);
      };
      case (?incharge) {
        Map.delete(pendingIncharges, thash, inchargeId);

        // Update user status
        switch (Map.get(users, thash, incharge.id)) {
          case null {
            return #err("User not found for incharge ID: " # inchargeId);
          };
          case (?user) {
            let updatedUser = { user with registrationStatus = #Approved };
            Map.set(users, thash, incharge.id, updatedUser);
          };
        };

        let approvedIncharge = { incharge with registrationStatus = #Approved };
        Map.set(approvedIncharges, thash, inchargeId, approvedIncharge);

        #ok("Incharge approved successfully with ID: " # inchargeId);
      };
    };
  };

  public shared ({ caller }) func rejectIncharge(inchargeId : Text) : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed to reject ambulances");
    };

    // Admin Check
    if (not (await checkAdmin(caller))) {
      return #err("You are not admin");
    };

    switch (Map.get(pendingIncharges, thash, inchargeId)) {
      case null {
        return #err("No pending incharge found with ID: " # inchargeId);
      };
      case (?registration) {
        Map.delete(pendingIncharges, thash, inchargeId);
        Map.delete(users, thash, inchargeId);
        #ok("Incharge rejected successfully with ID: " # inchargeId);
      };
    };
  };

  public query func getInchargeReports(inchargeId : Text) : async Result<[Text], Text> {
    switch (Map.get(inchargeReports, thash, inchargeId)) {
      case null { #err("No reports found for this incharge") };
      case (?reports) { #ok(reports) };
    };
  };

  public func getAccidentDetails(accidentId : Text) : async Result<Types.AccidentReport, Text> {
    let accidentCanister = actor ("bkyz2-fmaaa-aaaaa-qaaaq-cai") : actor {
      getAccidentDetails : (Text) -> async Result<Types.AccidentReport, Text>;
    };
    await accidentCanister.getAccidentDetails(accidentId);
  };

  public func getPatientDetails(patientId : Text) : async Result<Types.PatientRecord, Text> {
    let patientCanister = actor ("b77ix-eeaaa-aaaaa-qaada-cai") : actor {
      getPatientRecord : (Text) -> async Result<Types.PatientRecord, Text>;
    };
    await patientCanister.getPatientRecord(patientId);
  };

  public func getReportDetails(reportId : Text) : async Result<Types.Report, Text> {
    let reportCanister = actor ("by6od-j4aaa-aaaaa-qaadq-cai") : actor {
      getReport : (Text) -> async Result<Types.Report, Text>;
    };
    await reportCanister.getReport(reportId);
  };

  public func listInchargeReportedCases(inchargeId : Text) : async Result<[{ patient : Types.PatientRecord; accident : Types.AccidentReport; report : Types.Report }], Text> {
    switch (Map.get(inchargeReportAccess, thash, inchargeId)) {
      case null { #err("No reports found for this incharge") };
      case (?accessList) {
        let casesBuffer = Buffer.Buffer<{ patient : Types.PatientRecord; accident : Types.AccidentReport; report : Types.Report }>(0);
        for (access in accessList.vals()) {
          switch (await getReportDetails(access.reportId)) {
            case (#ok(report)) {
              switch (await getAccidentDetails(access.accidentId)) {
                case (#ok(accident)) {
                  switch (await getPatientDetails(access.patientId)) {
                    case (#ok(patient)) {
                      casesBuffer.add({
                        patient = patient;
                        accident = accident;
                        report = report;
                      });
                    };
                    case (#err(error)) {
                      // Handle error or skip this case
                      Debug.print("Error fetching patient details: " # error);
                    };
                  };
                };
                case (#err(error)) {
                  // Handle error or skip this case
                  Debug.print("Error fetching accident details: " # error);
                };
              };
            };
            case (#err(error)) {
              // Handle error or skip this case
              Debug.print("Error fetching report details: " # error);
            };
          };
        };
        #ok(Buffer.toArray(casesBuffer));
      };
    };
  };

  // Modify the reportCaseToIncharge function
  private func reportCaseToIncharge(inchargeId : Text, reportId : Text, patientId : Text, accidentId : Text) : async Result<Text, Text> {
    // if (Principal.isAnonymous(caller)) {
    //   return #err("Anonymous principals are not allowed to report cases");
    // };

    let accessInfo = {
      reportId = reportId;
      patientId = patientId;
      accidentId = accidentId;
    };
    switch (Map.get(inchargeReportAccess, thash, inchargeId)) {
      case null {
        Map.set(inchargeReportAccess, thash, inchargeId, [accessInfo]);
      };
      case (?existingAccess) {
        Map.set(inchargeReportAccess, thash, inchargeId, Array.append(existingAccess, [accessInfo]));
      };
    };
    #ok("Case reported successfully to incharge: " # inchargeId);

  };

  public query func getInchargeReportAccess(inchargeId : Text) : async Result<[{ reportId : Text; patientId : Text; accidentId : Text }], Text> {
    switch (Map.get(inchargeReportAccess, thash, inchargeId)) {
      case null { #err("No report access found for this incharge") };
      case (?access) { #ok(access) };
    };
  };
  // Notify specific incharges
  public shared ({ caller }) func notifySpecificIncharges(details : Text, reportId : Text, inchargeIds : [Text], report : Types.Report) : async Result.Result<Text, Text> {
    // Get report details

    for (inchargeId in inchargeIds.vals()) {
      switch (Map.get(approvedIncharges, thash, inchargeId)) {
        case null {
          Debug.print("Incharge not found with ID: " # inchargeId);
        };
        case (?incharge) {
          // let notification : ReportNotification = {
          //   reportId = reportId;
          //   inchargeId = incharge.id;
          //   timestamp = Time.now();
          //   details = details;
          // };

          // Grant report access to the incharge
          ignore await reportCaseToIncharge(inchargeId, reportId, report.patientId, report.accidentId);

          // Send notification using HTTPS outcall
          // await sendNotificationToIncharge(incharge, notification);

        };
      };
    };
    return #ok("Successfully shared and notified");

  };

  private func sendNotificationToIncharge(incharge : InchargeDetails, notification : ReportNotification) : async () {
    let apiKey = "your-msg91-api-key";
    let message = "Notification: " # notification.details;
    let phoneNumber = incharge.contactInfo.phoneNumber;

    let url = "https://api.msg91.com/api/v5/flow/";
    let headers = [
      { name = "authkey"; value = apiKey },
      { name = "Content-Type"; value = "application/json" },
    ];
    let body = Text.encodeUtf8("{\"flow_id\": \"your-flow-id\", \"sender\": \"your-sender-id\", \"recipients\": [{\"mobiles\": \"" # phoneNumber # "\"}], \"message\": \"" # message # "\"}");
    let request_body_as_nat8 : [Nat8] = Blob.toArray(body);

    let ic : Types.IC = actor ("aaaaa-aa");
    let http_request : Types.HttpRequestArgs = {
      url = url;
      max_response_bytes = null;
      headers = headers;
      body = ?request_body_as_nat8;
      method = #post;
      transform = null;
    };

    Cycles.add<system>(21_850_258_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    if (http_response.status == 200) {
      // Handle successful response
    } else {
      // Handle error response
    };
  };

  public shared ({ caller }) func getUserRole() : async Result<Text, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals are not allowed");
    };

    let callerPrincipal = Principal.toText(caller);

    for ((_, user) in Map.entries(users)) {
      if (Principal.toText(user.principal) == callerPrincipal) {
        switch (user.userType) {
          case (#Admin) { return #ok("admin") };
          case (#Facility) { return #ok("facility") };
          case (#Ambulance) { return #ok("ambulance") };
          case (#Incharge) { return #ok("incharge") };
        };
      };
    };

    #ok("User Not Found");

  };

  private func checkPermitted(caller : Principal) : async Bool {
    return true;
  };

  public shared ({ caller }) func registerAdmin() : async Bool {
    if (Principal.isAnonymous(caller) or idAdminRegistered) {
      return false;
    };
    let userDetails : UserDetails = {
      id = Nat.toText(9999);
      principal = caller;
      userType = #Admin;

      name = "Admin";
      registrationStatus = #Approved;
      certificationID = "details.certificationID";
    };
    Map.set(users, thash, "9999", userDetails);
    idAdminRegistered := true;
    admin := Principal.toText(caller);
    return true;
  };

  public query func checkAdmin(caller : Principal) : async Bool {

    if (admin == Principal.toText(caller)) {
      return true;
    };
    return false;
  };

  public func areAllIdsPresent(ids : [Text]) : async Bool {
    for (id in ids.vals()) {
      switch (Map.get(users, thash, id)) {
        case null {
          return false; // If any ID is not found, return false
        };
        case (?user) {
          // Check if the user type is Incharge
          switch (user.userType) {
            case (#Incharge) {
              // ID is valid and belongs to an Incharge, continue checking
            };
            case _ {
              return false; // If the user type is not Incharge, return false
            };
          };
        };
      };
    };
    return true; // All IDs are valid Incharge IDs
  };
};
