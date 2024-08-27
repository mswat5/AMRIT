import { z } from "zod";
export const FormDataSchema = z.object({
  //page 1
  patientInitials: z
    .object({
      initial1: z.string().optional(),
      initial2: z.string().optional(),
      initial3: z.string().optional(),
    })
    .optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  dobKnownAge: z.string().optional(),
  registrationDate: z.string().optional(),

  //page 2
  residence: z.string().optional(),
  postalCode: z.string().optional(),
  monthlyIncome: z.string().optional(),
  inclusionCriteria: z.string().nullable().optional(),

  //page 3
  stableAngina: z.enum(["yes", "no", "not known"]).nullable().optional(),
  priorMI: z.enum(["yes", "no", "not known"]).nullable().optional(),
  ptca: z.enum(["yes", "no", "not known"]).nullable().optional(),
  cabg: z.enum(["yes", "no", "not known"]).nullable().optional(),
  otherCardiovascularEvents: z.enum(["yes", "no", "not known"]).optional(),
  tiaOrStroke: z.boolean().optional(),
  pad: z.boolean().optional(),
  renovascularDisease: z.boolean().optional(),
  chf: z.boolean().optional(),
  otherVascularDisease: z.boolean().optional(),
  prematureFamilyHistory: z.enum(["yes", "no", "not known"]).optional(),
  dyslipidemiaOnStatin: z.enum(["yes", "no", "not known"]).optional(),
  hypertension: z.enum(["yes", "no", "not known"]).optional(),
  hypertensionDuration: z.enum(["less than 1 yr", "1 or more yrs"]).optional(),
  hypertensionDurationYears: z.number().optional(),
  diabetes: z.enum(["yes", "no", "not known"]).optional(),
  diabetesDuration: z.string().optional(),
  diabetesInsulin: z.boolean().optional(),
  diabetesOHA: z.boolean().optional(),
  smokingStatus: z.enum(["yes", "no"]).optional(),
  smokingType: z.enum(["current", "past"]).optional(),
  smokingSince: z.string().optional(),
  smokingLeftYears: z.string().optional(),
  smokelessTobaccoStatus: z.enum(["yes", "no"]).optional(),
  tobaccoUsageType: z.enum(["current", "past"]).optional(),
  tobaccoTakingSince: z.string().optional(),
  tobaccoLeftYears: z.string().optional(),
  symptomOnset: z.string().optional(),
  firstContact: z.string().optional(),
  transportToFirstContact: z.string().optional(),
  transportToHubHospital: z.string().optional(),
  transportOtherSpecify: z.string().optional(),
  presentationToER: z.string().optional(),
  heartRate: z.string().optional(),
  bloodPressure: z
    .object({
      systolic: z.string().optional(),
      diastolic: z.string().optional(),
    })
    .optional(),
  kilipClass: z.union([z.string(), z.null()]).optional(),
  indexECG: z.string().optional(),
  ecgFindings: z.string().optional(),
  lbbb: z.string().optional(),
  rbbb: z.string().optional(),
  otherAbnormalities: z.string().optional(),

  //page 4

  initialCreatinine: z.enum(["No", "Yes"]).nullable().optional(),
  randomGlucose: z.enum(["No", "Yes"]).nullable().optional(),
  fastingGlucose: z.enum(["No", "Yes"]).nullable().optional(),
  //   cardiacMarker: z
  //     .object({
  //       cpk: z
  //         .object({
  //           status: z.enum(["notDone", "done"]),
  //           qualitative: z.enum(["positive", "negative"]),
  //           quantitative: z.boolean(),
  //           value: z.number().nullable(),
  //           uln: z.number().nullable(),
  //         })
  //         .optional(),
  //       ckMb: z
  //         .object({
  //           status: z.enum(["notDone", "done"]),
  //           qualitative: z.enum(["positive", "negative"]),
  //           quantitative: z.boolean(),
  //           value: z.number().nullable(),
  //           uln: z.number().nullable(),
  //         })
  //         .optional(),
  //       troponin: z
  //         .object({
  //           type: z.enum(["I", "T"]),
  //           status: z.enum(["notDone", "done"]),
  //           qualitative: z.enum(["positive", "negative"]),
  //           quantitative: z.boolean(),
  //           value: z.number().nullable(),
  //           uln: z.number().nullable(),
  //         })
  //         .optional(),
  //     })
  //     .optional(),
  preHubManagement: z.union([z.array(z.string()), z.boolean()]).optional(),
  duringAdmission: z.union([z.array(z.string()), z.boolean()]).optional(),
  prescribedAtDischarge: z.union([z.array(z.string()), z.boolean()]).optional(),

  thrombolysis: z.string().nullable().optional(),
  echo: z.string().nullable().optional(),
  angiography: z.string().nullable().optional(),
  ptca2: z.string().nullable().optional(),
  cabg2: z.string().nullable().optional(),

  reinfarction: z.enum(["No", "Yes"]).nullable().optional(),
  stroke: z.enum(["No", "Yes"]).nullable().optional(),
  lvFailure: z.enum(["No", "Yes"]).nullable().optional(),
  recurrentIschemia: z.enum(["No", "Yes"]).nullable().optional(),
  cardiacArrest: z.enum(["No", "Yes"]).nullable().optional(),
  cardiogenicShock: z.enum(["No", "Yes"]).nullable().optional(),
  counselling: z.string().nullable().optional(),

  //page 5
  inchargeIds: z.array(z.string().min(1, "ID cannot be empty")).optional(),
  incidentid: z.string().optional(),
});
