import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { FormDataSchema } from "./zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import ActorContext from "../../../ActorContext";
import { toast } from "@/components/ui/use-toast";

const steps = [
  {
    id: "Step 1",
    name: "Registration Details",
    fields: [
      "patientInitials",
      "mobile",
      "address",
      "gender",
      "dobKnownAge",
      "registrationDate",
    ],
  },
  {
    id: "Step 2",
    name: "Demographics Details",
    fields: ["residence", "postalCode", "monthlyIncome", "inclusionCriteria"],
  },
  {
    id: "step 3",
    name: "Medical Clinical Details",
    fields: [
      "stableAngina",
      "priorMI",
      "ptca",
      "cabg",
      "otherCardiovascularEvents",
      "prematureFamilyHistory",
      "dyslipidemiaOnStatin",
      "hypertension",
      "diabetes",
      "smokingStatus",
      "smokelessTobaccoStatus",
      "symptomOnset",
      "firstContact",
      "transportToFirstContact",
      "transportToHubHospital",
      "presentationToER",
      "heartRate",
      "bloodPressure",
      "kilipClass",
      "indexECG",
      "ecgFindings",
      "lbbb",
      "rbbb",
      "otherAbnormalities",
    ],
  },
  {
    id: "step 4",
    name: "Hospital Events Details",
    fields: [
      "counselling",
      "reinfarction",
      "stroke",
      "vlFailure",
      "recurrentIschemia",
      "cardiacArrest",
      "cardiogenicShock",
      "mechanicalComplications",
      "bleedingRequiringTransfusion",
      "death",
      "discharge",
      "height",
      "weight",
      "bmi",
      "thrombolysis",
      "echo",
      "angiography",
      "ptca2",
      "cabg",
      "preHubManagement",
      "duringAdmission",
      "prescribedAtDischarge",
      "initialCreatinine",
      "randomGlucose",
      "fastingGlucose",
      "cardiacMarker",
    ],
  },
  { id: "Step 5", name: "Complete" },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { actors } = useContext(ActorContext);

  const delta = currentStep - previousStep;

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormDataSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inchargeIds",
  });
  const processForm = async (data) => {
    console.log(data);
    const reportFile = new TextEncoder().encode(JSON.stringify(data));

    const result = await actors.patient.createPatientRecord(
      {
        accidentId: data.incidentid,
        admissionTimestamp: 0,
        age: 111,
        currentFacilityId: "0",
        dischargeTimestamp: [],
        id: "0",
        name: data.address,
        status: {
          Admitted: null,
        },
        treatmentDetails: "Treatment Started",
      },
      [reportFile],
      data.inchargeIds
    );
    Object.keys(result).forEach((key) => {
      if (key === "ok") {
        //   alert("incharge ID No. :" + result[key]);
        toast({
          title: "Success",
          description: result[key],
          variant: "success",
        });
      } else {
        //  alert(result[key]);
        toast({
          title: "Error",
          description: result[key],
          variant: "destructive",
        });
      }
      console.log(key);
    });
    console.log(result);
    reset();
  };

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep === steps.length - 1) {
      await handleSubmit(processForm)();
    } else {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold leading-8 text-gray-900 m-4 mt-8">
        Register Facility
      </h1>
      <section className="flex flex-col justify-between p-16">
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li
                key={step.name}
                className="md:flex-1"
              >
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-red-600 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-red-600">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <form
          className="mt-12 py-12"
          onSubmit={handleSubmit(processForm)}
        >
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-bold leading-7 text-gray-900">
                Registration Details
              </h2>
              <p className="mt-3 font-semibold">
                Patient ot be Registered ni STEMI ACT*:
              </p>

              <div className="mt-10 flex flex-col gap-x-6 gap-y-5 ">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Patient Initials*
                  </label>
                  <div className="flex gap-x-2">
                    <input
                      type="text"
                      id="initial1"
                      {...register("patientInitials.initial1")}
                      maxLength={1}
                      className="block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      id="initial2"
                      {...register("patientInitials.initial2")}
                      maxLength={1}
                      className="block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    <input
                      type="text"
                      id="initial3"
                      {...register("patientInitials.initial3")}
                      maxLength={1}
                      className="block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.patientInitials && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.patientInitials.initial1?.message ||
                        errors.patientInitials.initial2?.message ||
                        errors.patientInitials.initial3?.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mobile
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      id="mobile"
                      {...register("mobile")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.mobile?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Address
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="address"
                      {...register("address")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.address?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Gender
                  </label>
                  <div className="mt-1">
                    <select
                      id="gender"
                      {...register("gender")}
                      className="block rounded-md border-0 p-1.5 
       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="dobKnownAge"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Date of Birth / Known Age
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="dobKnownAge"
                      {...register("dobKnownAge")}
                      className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.dobKnownAge?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.dobKnownAge.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="registrationDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Registration Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      id="registrationDate"
                      {...register("registrationDate")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.registrationDate?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.registrationDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-gray-600">
                Note: In case patient is not to be registered in STEMI ACT
                Registry, you wil be redirected to Logbook Page. It is mandatory
                to fil the unregistered cases in the logbook.
              </p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Demographics Details
              </h2>
              <p className="mt-1 text-3xl font-bold leading-6 text-gray-600">
                B. Demographics Details
              </p>

              <div className="mt-10 flex flex-col gap-x-6 gap-y-8 ">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="residence"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Residence*
                  </label>
                  <select
                    id="residence"
                    {...register("residence")}
                    className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select residence</option>
                    <option value="urban">Urban</option>
                    <option value="semi-urban">Semi Urban</option>
                    <option value="rural">Rural</option>
                  </select>
                  {errors.residence?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.residence.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    postalCode*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      {...register("postalCode")}
                      className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.postalCode?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="">
                  <label
                    htmlFor="monthlyIncome"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    monthlyIncome (average for Past 1Year*) :
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="monthlyIncome"
                      {...register("monthlyIncome")}
                      className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.monthlyIncome?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.monthlyIncome.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <h2 className="mt-8 text-xl">
                Does Patient meet the following criteria?
              </h2>
              <p className="mt-4 text-3xl  font-bold leading-6 ">
                C. INCLUSION/EXCLUSION CRITERIA for STEMI ACT Registry
              </p>
              <div className="mt-10  gap-x-6 gap-y-8 ">
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    INCLUSION CRITERIA (Tick One)
                  </label>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="stemiElevation"
                        name="inclusionCriteria"
                        value="stemiElevation"
                        {...register("inclusionCriteria")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="stemiElevation"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        STEMI definite ST elevation changes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="lbbbOnset"
                        name="inclusionCriteria"
                        value="lbbbOnset"
                        {...register("inclusionCriteria")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="lbbbOnset"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        New/presumably new onset LBBB with typical symptoms
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="stemiEquivalents"
                        name="inclusionCriteria"
                        value="stemiEquivalents"
                        {...register("inclusionCriteria")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="stemiEquivalents"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        STEMI equivalents*
                      </label>
                    </div>
                  </div>
                  {errors.inclusionCriteria?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.inclusionCriteria.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="my-2 bg-gray-200">
                <h2>EXCLUSION CRITERIA</h2>
                <h4>1 Patients age &lt; 81 years</h4>
                <h4> 2. Mechanical complications prior ot thrombolysis</h4>
              </div>
              <p>
                *STEMI equivalents include Isolated true posterior M,I
                Hyperacute T-waves, De Winter sign and MI ina patient with
                implanted pacemaker (PPI)
              </p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Medical Clinical Details
              </h2>
              <p className="mt-1 text-3xl text-center font-bold leading-6 text-gray-600">
                D. Medical History & Risk Factors
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
                {/* Stable Angina */}
                <div className="flex gap-x-4">
                  <label
                    htmlFor="stableAngina"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Stable Angina*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="stableAnginaYes"
                      value="yes"
                      {...register("stableAngina")}
                    />
                    <label
                      htmlFor="stableAnginaYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="stableAnginaNo"
                      value="no"
                      {...register("stableAngina")}
                    />
                    <label
                      htmlFor="stableAnginaNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="stableAnginaNotKnown"
                      value="not known"
                      {...register("stableAngina")}
                    />
                    <label
                      htmlFor="stableAnginaNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.stableAngina && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.stableAngina.message}
                    </p>
                  )}
                </div>

                {/* Prior MI */}
                <div className="flex gap-x-4">
                  <label
                    htmlFor="priorMI"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Prior MI*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="priorMIYes"
                      value="yes"
                      {...register("priorMI")}
                    />
                    <label
                      htmlFor="priorMIYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="priorMINo"
                      value="no"
                      {...register("priorMI")}
                    />
                    <label
                      htmlFor="priorMINo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="priorMINotKnown"
                      value="not known"
                      {...register("priorMI")}
                    />
                    <label
                      htmlFor="priorMINotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.priorMI && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.priorMI.message}
                    </p>
                  )}
                </div>

                {/* Additional Input for Prior MI if "Yes" is selected */}
                {watch("priorMI") === "yes" && (
                  <div className="flex gap-x-4 mt-4">
                    <label
                      htmlFor="priorMIDetails"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      (If &gt; 1 Episode, Give Year of the most recent one)
                    </label>
                    <input
                      type="text"
                      id="priorMIDetails"
                      placeholder="Year"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                      {...register("priorMIDetails")}
                    />
                    {errors.priorMIDetails && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.priorMIDetails.message}
                      </p>
                    )}
                  </div>
                )}

                {/* PTCA */}
                <div className="flex gap-x-4 mt-4">
                  <label
                    htmlFor="ptca"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    PTCA*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="ptcaYes"
                      value="yes"
                      {...register("ptca")}
                    />
                    <label
                      htmlFor="ptcaYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="ptcaNo"
                      value="no"
                      {...register("ptca")}
                    />
                    <label
                      htmlFor="ptcaNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="ptcaNotKnown"
                      value="not known"
                      {...register("ptca")}
                    />
                    <label
                      htmlFor="ptcaNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.ptca && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.ptca.message}
                    </p>
                  )}
                </div>

                {/* CABG */}
                <div className="flex gap-x-4 mt-4">
                  <label
                    htmlFor="cabg"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    CABG*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="cabgYes"
                      value="yes"
                      {...register("cabg")}
                    />
                    <label
                      htmlFor="cabgYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="cabgNo"
                      value="no"
                      {...register("cabg")}
                    />
                    <label
                      htmlFor="cabgNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="cabgNotKnown"
                      value="not known"
                      {...register("cabg")}
                    />
                    <label
                      htmlFor="cabgNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.cabg && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.cabg.message}
                    </p>
                  )}
                </div>

                {/* Other Cardiovascular Events */}
                <div className="flex gap-x-4">
                  <label
                    htmlFor="otherCardiovascularEvents"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Other Cardiovascular Events*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="otherCardiovascularEventsYes"
                      value="yes"
                      {...register("otherCardiovascularEvents")}
                    />
                    <label
                      htmlFor="otherCardiovascularEventsYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="otherCardiovascularEventsNo"
                      value="no"
                      {...register("otherCardiovascularEvents")}
                    />
                    <label
                      htmlFor="otherCardiovascularEventsNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="otherCardiovascularEventsNotKnown"
                      value="not known"
                      {...register("otherCardiovascularEvents")}
                    />
                    <label
                      htmlFor="otherCardiovascularEventsNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.otherCardiovascularEvents && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.otherCardiovascularEvents.message}
                    </p>
                  )}
                </div>

                {/* Conditional Checkboxes */}
                {watch("otherCardiovascularEvents") === "yes" && (
                  <div className="flex flex-col gap-y-4 ml-8">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Select any that apply:
                    </label>

                    <div className="flex gap-x-4">
                      <input
                        type="checkbox"
                        id="tiaOrStroke"
                        {...register("tiaOrStroke")}
                      />
                      <label
                        htmlFor="tiaOrStroke"
                        className="text-gray-900"
                      >
                        TIA OR Stroke
                      </label>
                    </div>

                    <div className="flex gap-x-4">
                      <input
                        type="checkbox"
                        id="pad"
                        {...register("pad")}
                      />
                      <label
                        htmlFor="pad"
                        className="text-gray-900"
                      >
                        PAD
                      </label>
                    </div>

                    <div className="flex gap-x-4">
                      <input
                        type="checkbox"
                        id="renovascularDisease"
                        {...register("renovascularDisease")}
                      />
                      <label
                        htmlFor="renovascularDisease"
                        className="text-gray-900"
                      >
                        Renovascular Disease
                      </label>
                    </div>

                    <div className="flex gap-x-4">
                      <input
                        type="checkbox"
                        id="chf"
                        {...register("chf")}
                      />
                      <label
                        htmlFor="chf"
                        className="text-gray-900"
                      >
                        CHF
                      </label>
                    </div>

                    <div className="flex gap-x-4">
                      <input
                        type="checkbox"
                        id="otherVascularDisease"
                        {...register("otherVascularDisease")}
                      />
                      <label
                        htmlFor="otherVascularDisease"
                        className="text-gray-900"
                      >
                        Any Other Vascular Disease
                      </label>
                    </div>
                  </div>
                )}

                {/* Premature Family History of CHD / Stroke */}
                <div className="flex gap-x-4">
                  <label
                    htmlFor="prematureFamilyHistory"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Premature Family History of CHD / Stroke
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="prematureFamilyHistoryYes"
                      value="yes"
                      {...register("prematureFamilyHistory")}
                    />
                    <label
                      htmlFor="prematureFamilyHistoryYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="prematureFamilyHistoryNo"
                      value="no"
                      {...register("prematureFamilyHistory")}
                    />
                    <label
                      htmlFor="prematureFamilyHistoryNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="prematureFamilyHistoryNotKnown"
                      value="not known"
                      {...register("prematureFamilyHistory")}
                    />
                    <label
                      htmlFor="prematureFamilyHistoryNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.prematureFamilyHistory && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.prematureFamilyHistory.message}
                    </p>
                  )}
                </div>

                {/* Dyslipidemia / On Statin Therapy */}
                <div className="flex gap-x-4">
                  <label
                    htmlFor="dyslipidemiaOnStatin"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Dyslipidemia / On Statin Therapy
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="dyslipidemiaOnStatinYes"
                      value="yes"
                      {...register("dyslipidemiaOnStatin")}
                    />
                    <label
                      htmlFor="dyslipidemiaOnStatinYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="dyslipidemiaOnStatinNo"
                      value="no"
                      {...register("dyslipidemiaOnStatin")}
                    />
                    <label
                      htmlFor="dyslipidemiaOnStatinNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="dyslipidemiaOnStatinNotKnown"
                      value="not known"
                      {...register("dyslipidemiaOnStatin")}
                    />
                    <label
                      htmlFor="dyslipidemiaOnStatinNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.dyslipidemiaOnStatin && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.dyslipidemiaOnStatin.message}
                    </p>
                  )}
                </div>

                {/* Hypertension */}
                <div className="flex flex-col gap-y-4">
                  <label
                    htmlFor="hypertension"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Hypertension
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="hypertensionYes"
                      value="yes"
                      {...register("hypertension")}
                    />
                    <label
                      htmlFor="hypertensionYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="hypertensionNo"
                      value="no"
                      {...register("hypertension")}
                    />
                    <label
                      htmlFor="hypertensionNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="hypertensionNotKnown"
                      value="not known"
                      {...register("hypertension")}
                    />
                    <label
                      htmlFor="hypertensionNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.hypertension && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.hypertension.message}
                    </p>
                  )}

                  {watch("hypertension") === "yes" && (
                    <div className="ml-6 flex flex-col gap-y-4">
                      <div className="flex gap-x-4">
                        <input
                          type="radio"
                          id="hypertensionLessThan1Yr"
                          value="less than 1 yr"
                          {...register("hypertensionDuration")}
                        />
                        <label
                          htmlFor="hypertensionLessThan1Yr"
                          className="text-gray-900"
                        >
                          Less than 1 Yr
                        </label>

                        <input
                          type="radio"
                          id="hypertension1OrMoreYrs"
                          value="1 or more yrs"
                          {...register("hypertensionDuration")}
                        />
                        <label
                          htmlFor="hypertension1OrMoreYrs"
                          className="text-gray-900"
                        >
                          1 or more Yrs
                        </label>
                      </div>
                      {errors.hypertensionDuration && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.hypertensionDuration.message}
                        </p>
                      )}

                      {watch("hypertensionDuration") === "1 or more yrs" && (
                        <div className="ml-6 flex flex-col gap-y-2">
                          <label
                            htmlFor="hypertensionDurationYears"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Duration (Yrs):
                          </label>
                          <input
                            type="number"
                            id="hypertensionDurationYears"
                            {...register("hypertensionDurationYears")}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          {errors.hypertensionDurationYears && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.hypertensionDurationYears.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Diabetes */}
                <div className="flex flex-col gap-y-4">
                  <label
                    htmlFor="diabetes"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Diabetes
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="diabetesYes"
                      value="yes"
                      {...register("diabetes")}
                    />
                    <label
                      htmlFor="diabetesYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="diabetesNo"
                      value="no"
                      {...register("diabetes")}
                    />
                    <label
                      htmlFor="diabetesNo"
                      className="text-gray-900"
                    >
                      No
                    </label>

                    <input
                      type="radio"
                      id="diabetesNotKnown"
                      value="not known"
                      {...register("diabetes")}
                    />
                    <label
                      htmlFor="diabetesNotKnown"
                      className="text-gray-900"
                    >
                      Not Known
                    </label>
                  </div>
                  {errors.diabetes && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.diabetes.message}
                    </p>
                  )}

                  {watch("diabetes") === "yes" && (
                    <div className="ml-6 flex flex-col gap-y-4">
                      <div className="flex gap-x-4">
                        <label className="block text-sm leading-6 text-gray-900">
                          Duration (Yrs):
                        </label>
                        <input
                          type="number"
                          placeholder="4"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                          {...register("diabetesDuration")}
                        />
                      </div>
                      <div className="flex gap-x-4">
                        <label className="block text-sm leading-6 text-gray-900">
                          Insulin:
                        </label>
                        <input
                          type="checkbox"
                          {...register("diabetesInsulin")}
                        />
                        <label className="block text-sm leading-6 text-gray-900">
                          Only OHA:
                        </label>
                        <input
                          type="checkbox"
                          {...register("diabetesOHA")}
                        />
                      </div>
                      {errors.diabetesDuration && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.diabetesDuration.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Smoking Status */}
                <div className="flex flex-col gap-y-4">
                  <label
                    htmlFor="smokingStatus"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Smoking Status*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="smokingStatusYes"
                      value="yes"
                      {...register("smokingStatus")}
                    />
                    <label
                      htmlFor="smokingStatusYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="smokingStatusNo"
                      value="no"
                      {...register("smokingStatus")}
                    />
                    <label
                      htmlFor="smokingStatusNo"
                      className="text-gray-900"
                    >
                      Never
                    </label>
                  </div>
                  {errors.smokingStatus && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.smokingStatus.message}
                    </p>
                  )}

                  {watch("smokingStatus") === "yes" && (
                    <div className="ml-6 flex flex-col gap-y-4">
                      <label
                        htmlFor="smokingType"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Smoking Type
                      </label>
                      <div className="flex gap-x-4">
                        <input
                          type="radio"
                          id="currentSmoker"
                          value="current"
                          {...register("smokingType")}
                        />
                        <label
                          htmlFor="currentSmoker"
                          className="text-gray-900"
                        >
                          Current Smoker
                        </label>

                        <input
                          type="radio"
                          id="pastSmoker"
                          value="past"
                          {...register("smokingType")}
                        />
                        <label
                          htmlFor="pastSmoker"
                          className="text-gray-900"
                        >
                          Past Smoker
                        </label>
                      </div>
                      {errors.smokingType && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.smokingType.message}
                        </p>
                      )}
                      {watch("smokingType") === "current" && (
                        <div className="flex gap-x-4">
                          <label className="block text-sm leading-6 text-gray-900">
                            Smoking Since (Years):
                          </label>
                          <input
                            type="number"
                            placeholder="5"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            {...register("smokingSince")}
                          />
                          {errors.smokingSince && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.smokingSince.message}
                            </p>
                          )}
                        </div>
                      )}
                      {watch("smokingType") === "past" && (
                        <div className="flex gap-x-4">
                          <label className="block text-sm leading-6 text-gray-900">
                            Left (Years):
                          </label>
                          <input
                            type="number"
                            placeholder="1 to 41"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            {...register("smokingLeftYears")}
                          />
                          {errors.smokingLeftYears && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.smokingLeftYears.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Smokeless Tobacco Status */}
                <div className="flex flex-col gap-y-4">
                  <label
                    htmlFor="smokelessTobaccoStatus"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Smokeless Tobacco Status [Paan with tobacco, Gutka Etc.]*
                  </label>
                  <div className="flex gap-x-4">
                    <input
                      type="radio"
                      id="smokelessTobaccoStatusYes"
                      value="yes"
                      {...register("smokelessTobaccoStatus")}
                    />
                    <label
                      htmlFor="smokelessTobaccoStatusYes"
                      className="text-gray-900"
                    >
                      Yes
                    </label>

                    <input
                      type="radio"
                      id="smokelessTobaccoStatusNo"
                      value="no"
                      {...register("smokelessTobaccoStatus")}
                    />
                    <label
                      htmlFor="smokelessTobaccoStatusNo"
                      className="text-gray-900"
                    >
                      No
                    </label>
                  </div>
                  {errors.smokelessTobaccoStatus && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.smokelessTobaccoStatus.message}
                    </p>
                  )}

                  {watch("smokelessTobaccoStatus") === "yes" && (
                    <div className="ml-6 flex flex-col gap-y-4">
                      <label
                        htmlFor="tobaccoUsageType"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Tobacco Usage Type
                      </label>
                      <div className="flex gap-x-4">
                        <input
                          type="radio"
                          id="currentUser"
                          value="current"
                          {...register("tobaccoUsageType")}
                        />
                        <label
                          htmlFor="currentUser"
                          className="text-gray-900"
                        >
                          Current
                        </label>

                        <input
                          type="radio"
                          id="pastUser"
                          value="past"
                          {...register("tobaccoUsageType")}
                        />
                        <label
                          htmlFor="pastUser"
                          className="text-gray-900"
                        >
                          Past
                        </label>
                      </div>
                      {errors.tobaccoUsageType && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors.tobaccoUsageType.message}
                        </p>
                      )}
                      {watch("tobaccoUsageType") === "current" && (
                        <div className="flex gap-x-4">
                          <label className="block text-sm leading-6 text-gray-900">
                            Taking Since (Years):
                          </label>
                          <input
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            {...register("tobaccoTakingSince")}
                          />
                          {errors.tobaccoTakingSince && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.tobaccoTakingSince.message}
                            </p>
                          )}
                        </div>
                      )}
                      {watch("tobaccoUsageType") === "past" && (
                        <div className="flex gap-x-4">
                          <label className="block text-sm leading-6 text-gray-900">
                            Left (Years):
                          </label>
                          <input
                            type="number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            {...register("tobaccoLeftYears")}
                          />
                          {errors.tobaccoLeftYears && (
                            <p className="text-red-500 text-sm mt-2">
                              {errors.tobaccoLeftYears.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-8 text-3xl text-center font-bold leading-6 text-gray-600">
                E. Presentation
              </p>
              <div className="mt-8 flex flex-col  gap-x-6 gap-y-8 ">
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="symptomOnset"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Symptom Onset*
                    </label>
                    <input
                      type="text"
                      id="symptomOnset"
                      {...register("symptomOnset")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.symptomOnset?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.symptomOnset.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="firstContact"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First Contact With Medical Professional*
                    </label>
                    <input
                      type="text"
                      id="firstContact"
                      {...register("firstContact")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.firstContact?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.firstContact.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Mode of Transport to First Medical Contact/Spoke Facility*
                  </label>
                  <div className="flex gap-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportAmbulance"
                        name="transportToFirstContact"
                        value="ambulance"
                        {...register("transportToFirstContact")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportAmbulance"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Ambulance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportPrivate"
                        name="transportToFirstContact"
                        value="private"
                        {...register("transportToFirstContact")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportPrivate"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Private Transport (e.g. Car etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportPublic"
                        name="transportToFirstContact"
                        value="public"
                        {...register("transportToFirstContact")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportPublic"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Public Transport (e.g. Bus etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportOther"
                        name="transportToFirstContact"
                        value="other"
                        {...register("transportToFirstContact")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportOther"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Other (specify)
                      </label>
                    </div>
                  </div>
                  {errors.transportToFirstContact?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.transportToFirstContact.message}
                    </p>
                  )}
                </div>

                {watch("transportToFirstContact") === "other" && (
                  <div>
                    <label
                      htmlFor="transportOtherSpecify"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Specify Other Mode of Transport
                    </label>
                    <input
                      type="text"
                      id="transportOtherSpecify"
                      {...register("transportOtherSpecify")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.transportOtherSpecify?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.transportOtherSpecify.message}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Mode of Transport to Hub Hospital*
                  </label>
                  <div className="flex  gap-x-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportAmbulance"
                        name="transportToHubHospital"
                        value="ambulance"
                        {...register("transportToHubHospital")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportAmbulance"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Ambulance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportPrivate"
                        name="transportToHubHospital"
                        value="private"
                        {...register("transportToHubHospital")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportPrivate"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Private Transport (e.g. Car etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportPublic"
                        name="transportToHubHospital"
                        value="public"
                        {...register("transportToHubHospital")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportPublic"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Public Transport (e.g. Bus etc.)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="transportOther"
                        name="transportToHubHospital"
                        value="other"
                        {...register("transportToHubHospital")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="transportOther"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Other (specify)
                      </label>
                    </div>
                  </div>
                  {errors.transportToHubHospital?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.transportToHubHospital.message}
                    </p>
                  )}
                </div>

                {watch("transportToHubHospital") === "other" && (
                  <div>
                    <label
                      htmlFor="transportOtherSpecify"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Specify Other Mode of Transport
                    </label>
                    <input
                      type="text"
                      id="transportOtherSpecify"
                      {...register("transportOtherSpecify")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.transportOtherSpecify?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.transportOtherSpecify.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="presentationToER"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Presentation to Emergency Room/Casualty*
                    </label>
                    <input
                      type="text"
                      id="presentationToER"
                      {...register("presentationToER")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.presentationToER?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.presentationToER.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                F. Physical Examination at Time of Presentation
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8 ">
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="heartRate"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Heart Rate (per minute)*
                    </label>
                    <input
                      type="text"
                      id="heartRate"
                      {...register("heartRate")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.heartRate?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.heartRate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Blood Pressure*
                  </label>
                  <div className="flex gap-x-4">
                    <div>
                      <label
                        htmlFor="systolic"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Systolic
                      </label>
                      <input
                        type="text"
                        id="systolic"
                        {...register("bloodPressure.systolic")}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.bloodPressure?.systolic?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.bloodPressure.systolic.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="diastolic"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Diastolic
                      </label>
                      <input
                        type="text"
                        id="diastolic"
                        {...register("bloodPressure.diastolic")}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.bloodPressure?.diastolic?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.bloodPressure.diastolic.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Kilip Class*
                  </label>
                  <div className="flex  gap-x-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="k1"
                        name="kilipClass"
                        value="1 (No CHF)"
                        {...register("kilipClass")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="k1"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        1 (No CHF)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="k2"
                        name="kilipClass"
                        value="II (Rales)"
                        {...register("kilipClass")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="k2"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        II (Rales)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="k3"
                        name="kilipClass"
                        value="III (Pulmonary Edema)"
                        {...register("kilipClass")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="k3"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        III (Pulmonary Edema)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="k4"
                        name="kilipClass"
                        value="IV (Cardiogenic Shock)"
                        {...register("kilipClass")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="k4"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        IV (Cardiogenic Shock)
                      </label>
                    </div>
                  </div>
                  {errors.kilipClass?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.kilipClass.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                G. ECG Findings
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8 ">
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="indexECG"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      1.a Index ECG in Hub Hospital*
                    </label>
                    <input
                      type="text"
                      id="indexECG"
                      {...register("indexECG")}
                      className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.indexECG?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.indexECG.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    ECG Findings*
                  </label>
                  <div className="flex flex-col gap-y-2">
                    <select
                      {...register("ecgFindings")}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select ECG Finding</option>
                      <option value="STEMI">STEMI</option>
                      <option value="NSTEMI / UA">NSTEMI/UA</option>
                    </select>
                    {errors.ecgFindings?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.ecgFindings.message}
                      </p>
                    )}
                  </div>
                </div>
                {watch("ecgFindings") === "STEMI" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      STEMI Findings
                    </label>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="stElevation"
                          {...register("stemiFindings.TSElevation")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="stElevation"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          TS Elevation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="anteriorLeads"
                          {...register("stemiFindings.AnteriorLeads")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="anteriorLeads"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Anterior Leads
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lateralLeads"
                          {...register("stemiFindings.LateralLeads")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="lateralLeads"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Lateral Leads
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="inferiorLeads"
                          {...register("stemiFindings.InferiorLeads")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="inferiorLeads"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Inferior Leads
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="septalLeads"
                          {...register("stemiFindings.SeptalLeads")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="septalLeads"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Septal Leads
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {watch("ecgFindings") === "NSTEMI / UA" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      NSTEMI / UA Findings
                    </label>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="stDepression"
                          {...register("nstemiFindings.STDepression")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="stDepression"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          ST Depression
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tWaves"
                          {...register("nstemiFindings.TWaves")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="tWaves"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          T Waves
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="none"
                          {...register("nstemiFindings.None")}
                          className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label
                          htmlFor="none"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          None
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* LBBB Question */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Does ECG Show Left Bundle Branch Block?*
                  </label>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="lbbbYes"
                        name="lbbb"
                        value="yes"
                        {...register("lbbb")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="lbbbYes"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="lbbbNo"
                        name="lbbb"
                        value="no"
                        {...register("lbbb")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="lbbbNo"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {errors.lbbb?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.lbbb.message}
                    </p>
                  )}
                </div>
                {/* Conditional options for LBBB Type */}
                {watch("lbbb") === "yes" && (
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Type of LBBB*
                    </label>
                    <div className="flex flex-col gap-y-2">
                      <select
                        {...register("lbbbType")}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select LBBB Type</option>
                        <option value="new">New</option>
                        <option value="old">Old</option>
                        <option value="unknown">Unknown</option>
                      </select>
                      {errors.lbbbType?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.lbbbType.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* RBBB Question */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Does ECG Show Right Bundle Branch Block?*
                  </label>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="rbbbYes"
                        name="rbbb"
                        value="yes"
                        {...register("rbbb")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="rbbbYes"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="rbbbNo"
                        name="rbbb"
                        value="no"
                        {...register("rbbb")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="rbbbNo"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {errors.rbbb?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.rbbb.message}
                    </p>
                  )}
                </div>

                {/* Conditional options for RBBB Type */}
                {watch("rbbb") === "yes" && (
                  <div>
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      Type of RBBB*
                    </label>
                    <select
                      {...register("rbbbType")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select RBBB Type</option>
                      <option value="new">New</option>
                      <option value="old">Old</option>
                      <option value="unknown">Unknown</option>
                    </select>
                    {errors.rbbbType?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.rbbbType.message}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Other Abnormalities?*
                  </label>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="otherAbnormalitiesYes"
                        name="otherAbnormalities"
                        value="yes"
                        {...register("otherAbnormalities")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="otherAbnormalitiesYes"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="otherAbnormalitiesNo"
                        name="otherAbnormalities"
                        value="no"
                        {...register("otherAbnormalities")}
                        className="h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600"
                      />
                      <label
                        htmlFor="otherAbnormalitiesNo"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        No
                      </label>
                    </div>
                  </div>
                  {errors.otherAbnormalities?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.otherAbnormalities.message}
                    </p>
                  )}
                </div>

                {/* Conditional options for Other Abnormalities */}
                {watch("otherAbnormalities") == "yes" && (
                  <div>
                    <h3 className="mt-4 text-sm font-medium">
                      Specify Other Abnormalities:
                    </h3>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="atrialFibFlutter"
                          {...register(
                            "otherAbnormalityDetails.atrialFibFlutter"
                          )}
                        />
                        <label
                          htmlFor="atrialFibFlutter"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Atrial Fib/Flutter
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="vtach"
                          {...register("otherAbnormalityDetails.vtach")}
                        />
                        <label
                          htmlFor="vtach"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Vtach
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="posteriorInfarction"
                          {...register(
                            "otherAbnormalityDetails.posteriorInfarction"
                          )}
                        />
                        <label
                          htmlFor="posteriorInfarction"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Posterior Infarction
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="rbbb"
                          {...register("otherAbnormalityDetails.rbbb")}
                        />
                        <label
                          htmlFor="rbbb"
                          className="ml-2 text-sm text-gray-900"
                        >
                          RBBB
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="nonspecificSTChange"
                          {...register(
                            "otherAbnormalityDetails.nonspecificSTChange"
                          )}
                        />
                        <label
                          htmlFor="nonspecificSTChange"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Nonspecific ST/T Change
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pacedRhythm"
                          {...register("otherAbnormalityDetails.pacedRhythm")}
                        />
                        <label
                          htmlFor="pacedRhythm"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Paced Rhythm
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="leftVentricularHypertrophy"
                          {...register(
                            "otherAbnormalityDetails.leftVentricularHypertrophy"
                          )}
                        />
                        <label
                          htmlFor="leftVentricularHypertrophy"
                          className="ml-2 text-sm text-gray-900"
                        >
                          Left Ventricular Hypertrophy
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="avBlock"
                          {...register("otherAbnormalityDetails.avBlock")}
                        />
                        <label
                          htmlFor="avBlock"
                          className="ml-2 text-sm text-gray-900"
                        >
                          AV Block
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Hospital Events Details
              </h2>
              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                I. Laboratory
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
                {/* Initial Creatinine */}
                <div className="flex items-center gap-x-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Initial Creatinine*
                  </label>
                  <div className="flex items-center gap-x-2">
                    <input
                      type="radio"
                      id="initialCreatinineNo"
                      value="No"
                      {...register("initialCreatinine")}
                    />
                    <label htmlFor="initialCreatinineNo">No</label>
                    <input
                      type="radio"
                      id="initialCreatinineYes"
                      value="Yes"
                      {...register("initialCreatinine")}
                    />
                    <label htmlFor="initialCreatinineYes">Yes</label>
                  </div>
                  {watch("initialCreatinine") === "Yes" && (
                    <>
                      <div className="ml-4">
                        <input
                          type="radio"
                          id="initialCreatinineUnit1"
                          value="μmol per liter"
                          {...register("initialCreatinineUnit")}
                        />
                        <label htmlFor="initialCreatinineUnit1">
                          μmol per liter
                        </label>
                        <input
                          type="radio"
                          id="initialCreatinineUnit2"
                          value="mg per dl"
                          {...register("initialCreatinineUnit")}
                        />
                        <label htmlFor="initialCreatinineUnit2">
                          mg per dl
                        </label>
                      </div>
                      <input
                        type="text"
                        id="initialCreatinineValue"
                        placeholder="Value"
                        {...register("initialCreatinineValue")}
                        className="ml-auto block w-1/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                  {errors.initialCreatinine?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.initialCreatinine.message}
                    </p>
                  )}
                </div>

                {/* Random Glucose */}
                <div className="flex items-center gap-x-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Random Glucose*
                  </label>
                  <div className="flex items-center gap-x-2">
                    <input
                      type="radio"
                      id="randomGlucoseNo"
                      value="No"
                      {...register("randomGlucose")}
                    />
                    <label htmlFor="randomGlucoseNo">No</label>
                    <input
                      type="radio"
                      id="randomGlucoseYes"
                      value="Yes"
                      {...register("randomGlucose")}
                    />
                    <label htmlFor="randomGlucoseYes">Yes</label>
                  </div>
                  {watch("randomGlucose") === "Yes" && (
                    <>
                      <div className="ml-4">
                        <input
                          type="radio"
                          id="randomGlucoseUnit1"
                          value="μmol per liter"
                          {...register("randomGlucoseUnit")}
                        />
                        <label htmlFor="randomGlucoseUnit1">
                          μmol per liter
                        </label>
                        <input
                          type="radio"
                          id="randomGlucoseUnit2"
                          value="mg per dl"
                          {...register("randomGlucoseUnit")}
                        />
                        <label htmlFor="randomGlucoseUnit2">mg per dl</label>
                      </div>
                      <input
                        type="text"
                        id="randomGlucoseValue"
                        placeholder="Value"
                        {...register("randomGlucoseValue")}
                        className="ml-auto block w-1/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                  {errors.randomGlucose?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.randomGlucose.message}
                    </p>
                  )}
                </div>

                {/* Fasting Glucose */}
                <div className="flex items-center gap-x-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Fasting Glucose*
                  </label>
                  <div className="flex items-center gap-x-2">
                    <input
                      type="radio"
                      id="fastingGlucoseNo"
                      value="No"
                      {...register("fastingGlucose")}
                    />
                    <label htmlFor="fastingGlucoseNo">No</label>
                    <input
                      type="radio"
                      id="fastingGlucoseYes"
                      value="Yes"
                      {...register("fastingGlucose")}
                    />
                    <label htmlFor="fastingGlucoseYes">Yes</label>
                  </div>
                  {watch("fastingGlucose") === "Yes" && (
                    <>
                      <div className="ml-4">
                        <input
                          type="radio"
                          id="fastingGlucoseUnit1"
                          value="μmol per liter"
                          {...register("fastingGlucoseUnit")}
                        />
                        <label htmlFor="fastingGlucoseUnit1">
                          μmol per liter
                        </label>
                        <input
                          type="radio"
                          id="fastingGlucoseUnit2"
                          value="mg per dl"
                          {...register("fastingGlucoseUnit")}
                        />
                        <label htmlFor="fastingGlucoseUnit2">mg per dl</label>
                      </div>
                      <input
                        type="text"
                        id="fastingGlucoseValue"
                        placeholder="Value"
                        {...register("fastingGlucoseValue")}
                        className="ml-auto block w-1/4 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                  {errors.fastingGlucose?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.fastingGlucose.message}
                    </p>
                  )}
                </div>

                {/* Cardiac Marker - Maximum Values in 1st 24 hrs */}
                {/* <h2 className="mt-8 text-lg font-bold leading-6 text-gray-900">
                  Cardiac Marker - Maximum Values in 1st 24 hrs
                </h2>
                <table className="mt-4 w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2"></th>
                      <th className="border p-2">Not Done / Done</th>
                      <th className="border p-2">Qualitative</th>
                      <th className="border p-2">Quantitative</th>
                      <th className="border p-2">Value</th>
                      <th className="border p-2">ULN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">
                        <label className="mr-2">CPK*</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="cpkNotDone"
                          value="notDone"
                          {...register("cardiacMarker.cpk.status")}
                        />
                        <label htmlFor="cpkNotDone" className="mr-2">
                          No
                        </label>
                        <input
                          type="radio"
                          id="cpkDone"
                          value="done"
                          {...register("cardiacMarker.cpk.status")}
                        />
                        <label htmlFor="cpkDone">Yes</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="cpkQualitativePositive"
                          value="positive"
                          {...register("cardiacMarker.cpk.qualitative")}
                        />
                        <label
                          htmlFor="cpkQualitativePositive"
                          className="mr-2"
                        >
                          +ve
                        </label>
                        <input
                          type="radio"
                          id="cpkQualitativeNegative"
                          value="negative"
                          {...register("cardiacMarker.cpk.qualitative")}
                        />
                        <label htmlFor="cpkQualitativeNegative">-ve</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="cpkQuantitative"
                          value="quantitative"
                          {...register("cardiacMarker.cpk.quantitative")}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="cpkValue"
                          {...register("cardiacMarker.cpk.value")}
                          placeholder="10 TO 9999"
                          className="block w-full p-1.5"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="cpkULN"
                          {...register("cardiacMarker.cpk.uln")}
                          className="block w-full p-1.5"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="border p-2">
                        <label className="mr-2">CK-MB*</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="ckMbNotDone"
                          value="notDone"
                          {...register("cardiacMarker.ckMb.status")}
                        />
                        <label htmlFor="ckMbNotDone" className="mr-2">
                          No
                        </label>
                        <input
                          type="radio"
                          id="ckMbDone"
                          value="done"
                          {...register("cardiacMarker.ckMb.status")}
                        />
                        <label htmlFor="ckMbDone">Yes</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="ckMbQualitativePositive"
                          value="positive"
                          {...register("cardiacMarker.ckMb.qualitative")}
                        />
                        <label
                          htmlFor="ckMbQualitativePositive"
                          className="mr-2"
                        >
                          +ve
                        </label>
                        <input
                          type="radio"
                          id="ckMbQualitativeNegative"
                          value="negative"
                          {...register("cardiacMarker.ckMb.qualitative")}
                        />
                        <label htmlFor="ckMbQualitativeNegative">-ve</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="ckMbQuantitative"
                          value="quantitative"
                          {...register("cardiacMarker.ckMb.quantitative")}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="ckMbValue"
                          {...register("cardiacMarker.ckMb.value")}
                          placeholder="10 TO 9999"
                          className="block w-full p-1.5"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="ckMbULN"
                          {...register("cardiacMarker.ckMb.uln")}
                          className="block w-full p-1.5"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">
                        <label className="mr-2">Troponin*</label>
                        <input
                          type="radio"
                          id="troponinI"
                          value="I"
                          {...register("cardiacMarker.troponin.type")}
                        />
                        <label htmlFor="troponinT" className="mr-2">
                          I
                        </label>
                        <input
                          type="radio"
                          id="troponinT"
                          value="T"
                          {...register("cardiacMarker.troponin.type")}
                        />
                        <label htmlFor="troponinT">T</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="troponinNotDone"
                          value="notDone"
                          {...register("cardiacMarker.troponin.status")}
                        />
                        <label htmlFor="troponinNotDone" className="mr-2">
                          No
                        </label>
                        <input
                          type="radio"
                          id="troponinDone"
                          value="done"
                          {...register("cardiacMarker.troponin.status")}
                        />
                        <label htmlFor="troponinDone">Yes</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="troponinQualitativePositive"
                          value="positive"
                          {...register("cardiacMarker.troponin.qualitative")}
                        />
                        <label
                          htmlFor="troponinQualitativePositive"
                          className="mr-2"
                        >
                          +ve
                        </label>
                        <input
                          type="radio"
                          id="troponinQualitativeNegative"
                          value="negative"
                          {...register("cardiacMarker.troponin.qualitative")}
                        />
                        <label htmlFor="troponinQualitativeNegative">-ve</label>
                      </td>
                      <td className="border p-2">
                        <input
                          type="radio"
                          id="troponinQuantitative"
                          value="quantitative"
                          {...register("cardiacMarker.troponin.quantitative")}
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="troponinValue"
                          {...register("cardiacMarker.troponin.value")}
                          placeholder="0.009"
                          className="block w-full p-1.5"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          id="troponinULN"
                          {...register("cardiacMarker.troponin.uln")}
                          className="block w-full p-1.5"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table> */}
              </div>

              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                J. Hospital Treatment &Counselling (Fill in all that apply for
                each medication)
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
                {/* Pre-Hub/Spoke Hospital Management */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Pre-Hub/Spoke Hospital Management*
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div>
                      <input
                        type="checkbox"
                        id="aspirin"
                        {...register("preHubManagement")}
                        value="Aspirin"
                      />
                      <label
                        htmlFor="aspirin"
                        className="ml-2"
                      >
                        Aspirin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="statins"
                        {...register("preHubManagement")}
                        value="Statins"
                      />
                      <label
                        htmlFor="statins"
                        className="ml-2"
                      >
                        Statins
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="clopidogrel"
                        {...register("preHubManagement")}
                        value="Clopidogrel / Prasugrel / Ticagretor"
                      />
                      <label
                        htmlFor="clopidogrel"
                        className="ml-2"
                      >
                        Clopidogrel / Prasugrel / Ticagretor
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="others"
                        {...register("preHubManagement")}
                        value="Others"
                      />
                      <label
                        htmlFor="others"
                        className="ml-2"
                      >
                        Others
                      </label>
                    </div>
                  </div>
                  {errors.preHubManagement && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.preHubManagement.message}
                    </p>
                  )}
                  {watch("preHubManagement") && (
                    <div>
                      <label>
                        If 'Other Pre-Hospital Management' selected (Please
                        select one of the below)
                      </label>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <div>
                          <input
                            type="checkbox"
                            id="heparin"
                            {...register("preHubManagement")}
                            value="Heparin"
                          />
                          <label
                            htmlFor="heparin"
                            className="ml-2"
                          >
                            Heparin
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="nitrates"
                            {...register("preHubManagement")}
                            value="Nitrates"
                          />
                          <label
                            htmlFor="nitrates"
                            className="ml-2"
                          >
                            Nitrates
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="beta-blockers"
                            {...register("preHubManagement")}
                            value="Beta-Blockers"
                          />
                          <label
                            htmlFor="beta-blockers"
                            className="ml-2"
                          >
                            Beta-Blockers
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="ace-inhibitors"
                            {...register("preHubManagement")}
                            value="ACE Inhibitors"
                          />
                          <label
                            htmlFor="ace-inhibitors"
                            className="ml-2"
                          >
                            ACE Inhibitors
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id="none"
                            {...register("preHubManagement")}
                            value="None"
                          />
                          <label
                            htmlFor="none"
                            className="ml-2"
                          >
                            None of These
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* During Admission */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    During Admission*
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div>
                      <input
                        type="checkbox"
                        id="aspirinAdmission"
                        {...register("duringAdmission")}
                        value="Aspirin"
                      />
                      <label
                        htmlFor="aspirinAdmission"
                        className="ml-2"
                      >
                        Aspirin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="lmwh"
                        {...register("duringAdmission")}
                        value="LMWH & Fondaparinux"
                      />
                      <label
                        htmlFor="lmwh"
                        className="ml-2"
                      >
                        LMWH & Fondaparinux
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="beta-blockers-admission"
                        {...register("duringAdmission")}
                        value="Beta-Blockers"
                      />
                      <label
                        htmlFor="beta-blockers-admission"
                        className="ml-2"
                      >
                        Beta-Blockers
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="sglt2"
                        {...register("duringAdmission")}
                        value="SGLT2 Inhibitors"
                      />
                      <label
                        htmlFor="sglt2"
                        className="ml-2"
                      >
                        SGLT2 Inhibitors
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="glycoprotein"
                        {...register("duringAdmission")}
                        value="Glycoprotein II B/III A Inhibitors"
                      />
                      <label
                        htmlFor="glycoprotein"
                        className="ml-2"
                      >
                        Glycoprotein II B/III A Inhibitors
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="heparin"
                        {...register("duringAdmission")}
                        value="Unfractionated Heparin"
                      />
                      <label
                        htmlFor="heparin"
                        className="ml-2"
                      >
                        Unfractionated Heparin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="nitrates"
                        {...register("duringAdmission")}
                        value="Nitrates"
                      />
                      <label
                        htmlFor="nitrates"
                        className="ml-2"
                      >
                        Nitrates
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="arni"
                        {...register("duringAdmission")}
                        value="ARNI"
                      />
                      <label
                        htmlFor="arni"
                        className="ml-2"
                      >
                        ARNI
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="arbs"
                        {...register("duringAdmission")}
                        value="ARBs"
                      />
                      <label
                        htmlFor="arbs"
                        className="ml-2"
                      >
                        ARBs
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="other-antidiabetics"
                        {...register("duringAdmission")}
                        value="Other Antidiabetics"
                      />
                      <label
                        htmlFor="other-antidiabetics"
                        className="ml-2"
                      >
                        Other Antidiabetics
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="statins-admission"
                        {...register("duringAdmission")}
                        value="Statins"
                      />
                      <label
                        htmlFor="statins-admission"
                        className="ml-2"
                      >
                        Statins
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="ace-inhibitors-admission"
                        {...register("duringAdmission")}
                        value="ACE Inhibitors"
                      />
                      <label
                        htmlFor="ace-inhibitors-admission"
                        className="ml-2"
                      >
                        ACE Inhibitors
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="mra-admission"
                        {...register("duringAdmission")}
                        value="MRA"
                      />
                      <label
                        htmlFor="mra-admission"
                        className="ml-2"
                      >
                        MRA
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="insulin-admission"
                        {...register("duringAdmission")}
                        value="Insulin"
                      />
                      <label
                        htmlFor="insulin-admission"
                        className="ml-2"
                      >
                        Insulin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="clopidogrel-admission"
                        {...register("duringAdmission")}
                        value="Clopidogrel / Prasugrel / Ticagretor"
                      />
                      <label
                        htmlFor="clopidogrel-admission"
                        className="ml-2"
                      >
                        Clopidogrel / Prasugrel / Ticagretor
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="others-admission"
                        {...register("duringAdmission")}
                        value="Others"
                      />
                      <label
                        htmlFor="others-admission"
                        className="ml-2"
                      >
                        Others
                      </label>
                    </div>
                    {errors.duringAdmission && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.duringAdmission.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Prescribed at Discharge */}
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Prescribed at Discharge*
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    <div>
                      <input
                        type="checkbox"
                        id="aspirin-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Aspirin"
                      />
                      <label
                        htmlFor="aspirin-discharge"
                        className="ml-2"
                      >
                        Aspirin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="clopidogrel-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Clopidogrel / Prasugrel / Ticagretor"
                      />
                      <label
                        htmlFor="clopidogrel-discharge"
                        className="ml-2"
                      >
                        Clopidogrel / Prasugrel / Ticagretor
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="oral-anticoagulants"
                        {...register("prescribedAtDischarge")}
                        value="Oral Anticoagulants"
                      />
                      <label
                        htmlFor="oral-anticoagulants"
                        className="ml-2"
                      >
                        Oral Anticoagulants
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="beta-blockers-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Beta-Blockers"
                      />
                      <label
                        htmlFor="beta-blockers-discharge"
                        className="ml-2"
                      >
                        Beta-Blockers
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="statins-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Statins"
                      />
                      <label
                        htmlFor="statins-discharge"
                        className="ml-2"
                      >
                        Statins
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="mra-discharge"
                        {...register("prescribedAtDischarge")}
                        value="MRA"
                      />
                      <label
                        htmlFor="mra-discharge"
                        className="ml-2"
                      >
                        MRA
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="arni-discharge"
                        {...register("prescribedAtDischarge")}
                        value="ARNI"
                      />
                      <label
                        htmlFor="arni-discharge"
                        className="ml-2"
                      >
                        ARNI
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="ace-inhibitors-discharge"
                        {...register("prescribedAtDischarge")}
                        value="ACE Inhibitors"
                      />
                      <label
                        htmlFor="ace-inhibitors-discharge"
                        className="ml-2"
                      >
                        ACE Inhibitors
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="insulin-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Insulin"
                      />
                      <label
                        htmlFor="insulin-discharge"
                        className="ml-2"
                      >
                        Insulin
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="nitrates-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Nitrates"
                      />
                      <label
                        htmlFor="nitrates-discharge"
                        className="ml-2"
                      >
                        Nitrates
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="arbs-discharge"
                        {...register("prescribedAtDischarge")}
                        value="ARBs"
                      />
                      <label
                        htmlFor="arbs-discharge"
                        className="ml-2"
                      >
                        ARBs
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="sglt2-discharge"
                        {...register("prescribedAtDischarge")}
                        value="SGLT2 Inhibitors"
                      />
                      <label
                        htmlFor="sglt2-discharge"
                        className="ml-2"
                      >
                        SGLT2 Inhibitors
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="other-antidiabetics-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Other Antidiabetics"
                      />
                      <label
                        htmlFor="other-antidiabetics-discharge"
                        className="ml-2"
                      >
                        Other Antidiabetics
                      </label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="others-discharge"
                        {...register("prescribedAtDischarge")}
                        value="Others"
                      />
                      <label
                        htmlFor="others-discharge"
                        className="ml-2"
                      >
                        Others
                      </label>
                    </div>
                    {errors.prescribedAtDischarge && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.prescribedAtDischarge.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                K. Revascularization Therapy
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="thrombolysis"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Thrombolysis*
                    </label>
                    <div className="flex items-center gap-x-4">
                      <input
                        type="radio"
                        id="thrombolysis-yes"
                        value="yes"
                        {...register("thrombolysis", {
                          required: "Please select an option",
                        })}
                      />
                      <label htmlFor="thrombolysis-yes">Yes</label>
                      <input
                        type="radio"
                        id="thrombolysis-no"
                        value="no"
                        {...register("thrombolysis", {
                          required: "Please select an option",
                        })}
                      />
                      <label htmlFor="thrombolysis-no">No</label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.thrombolysis && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.thrombolysis.message}
                    </p>
                  )}

                  {watch("thrombolysis") === "yes" && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Input for Thrombolysis"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                        {...register("thrombolysisInput", {
                          required: "Please provide thrombolysis details",
                        })}
                      />

                      {/* Error Message */}
                      {errors.thrombolysisInput && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.thrombolysisInput.message}
                        </p>
                      )}

                      {/* Thrombolytic Agents */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Thrombolytic Agents:
                        </label>
                        <div className="flex gap-x-4">
                          <div>
                            <input
                              type="checkbox"
                              id="tenecteplase"
                              {...register("thrombolyticAgents.tenecteplase")}
                            />
                            <label htmlFor="tenecteplase">Tenecteplase</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="streptokinase"
                              {...register("thrombolyticAgents.streptokinase")}
                            />
                            <label htmlFor="streptokinase">Streptokinase</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="rtpa"
                              {...register("thrombolyticAgents.rtpa")}
                            />
                            <label htmlFor="rtpa">r-TPA</label>
                          </div>
                        </div>
                      </div>

                      {/* Thrombolysis at */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Thrombolysis at:
                        </label>
                        <div className="flex gap-x-4">
                          <div>
                            <input
                              type="checkbox"
                              id="spokeCenter"
                              {...register("thrombolysisAt.spokeCenter")}
                            />
                            <label htmlFor="spokeCenter">Spoke Center</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="urokinase"
                              {...register("thrombolysisAt.urokinase")}
                            />
                            <label htmlFor="urokinase">Urokinase</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="hubCenter"
                              {...register("thrombolysisAt.hubCenter")}
                            />
                            <label htmlFor="hubCenter">HUB Center</label>
                          </div>
                        </div>
                      </div>

                      {/* Chest Pain Resolution */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Chest Pain Resolution:
                        </label>
                        <div className="flex gap-x-4">
                          <div>
                            <input
                              type="radio"
                              id="none"
                              value="none"
                              {...register("chestPainResolution")}
                            />
                            <label htmlFor="none">None</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="complete"
                              value="complete"
                              {...register("chestPainResolution")}
                            />
                            <label htmlFor="complete">Complete</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="partial"
                              value="partial"
                              {...register("chestPainResolution")}
                            />
                            <label htmlFor="partial">Partial</label>
                            {watch("chestPainResolution") === "partial" && (
                              <input
                                type="number"
                                placeholder="Enter percentage"
                                className="ml-2 block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                                {...register("partialPercent", {
                                  required:
                                    "Please provide percentage for partial resolution",
                                })}
                              />
                            )}
                          </div>
                        </div>
                        {errors.partialPercent && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.partialPercent.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {watch("thrombolysis") === "no" && (
                    <div className="mt-4">
                      <select
                        id="thrombolysisInput"
                        {...register("thrombolysisInput", {
                          required: "Please select an option",
                        })}
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select</option>
                        <option value="partial ncl">Partial NCL</option>
                        <option value="none">None</option>
                      </select>

                      {errors.thrombolysisInput && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.thrombolysisInput.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="echo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ECHO*
                    </label>
                    <div className="flex items-center gap-x-4">
                      <input
                        type="radio"
                        id="echo-yes"
                        value="yes"
                        {...register("echo", {
                          required: "Please select an option",
                        })}
                      />
                      <label htmlFor="echo-yes">Yes</label>
                      <input
                        type="radio"
                        id="echo-no"
                        value="no"
                        {...register("echo", {
                          required: "Please select an option",
                        })}
                      />
                      <label htmlFor="echo-no">No</label>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errors.echo && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.echo.message}
                    </p>
                  )}

                  {watch("echo") === "yes" && (
                    <div className="mt-4">
                      {/* LVEF Ejection Fraction %Value */}
                      <div className="flex gap-x-4 items-center">
                        <label
                          htmlFor="lvef_ejection_fraction"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          LVEF Ejection Fraction %Value
                        </label>
                        <input
                          type="number"
                          id="lvef_ejection_fraction"
                          placeholder="Enter percentage"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                          {...register("lvefEjectionFraction", {
                            required:
                              "Please enter the ejection fraction percentage",
                            min: {
                              value: 1,
                              message: "Percentage must be greater than 0",
                            },
                            max: {
                              value: 100,
                              message: "Percentage must be 100 or less",
                            },
                          })}
                        />
                      </div>

                      {/* Error Message */}
                      {errors.lvefEjectionFraction && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.lvefEjectionFraction.message}
                        </p>
                      )}

                      {/* RWMA */}
                      <div className="mt-4">
                        <label
                          htmlFor="rwma"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          RWMA
                        </label>
                        <select
                          id="rwma"
                          {...register("rwma")}
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        >
                          <option value="">Select</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="angiography"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Angiography*
                    </label>
                    <div className="flex items-center gap-x-4">
                      <input
                        type="radio"
                        id="angiography-yes"
                        value="yes"
                        {...register("angiography")}
                      />
                      <label htmlFor="angiography-yes">Yes</label>
                      <input
                        type="radio"
                        id="angiography-no"
                        value="no"
                        {...register("angiography")}
                      />
                      <label htmlFor="angiography-no">No</label>
                    </div>
                  </div>

                  {/* Conditional rendering based on the selection */}
                  {watch("angiography") === "yes" && (
                    <div className="mt-4">
                      {/* Date and Time Input */}
                      <div className="flex gap-x-4 items-center">
                        <label
                          htmlFor="angiography_time"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          id="angiography_time"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                          {...register("angiographyTime")}
                        />
                      </div>

                      {/* Left Main Disease */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Left Main Disease &gt;=50%
                        </label>
                        <div className="flex gap-x-4">
                          <div>
                            <input
                              type="radio"
                              id="leftMainDisease-yes"
                              value="yes"
                              {...register("leftMainDisease")}
                            />
                            <label htmlFor="leftMainDisease-yes">Yes</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="leftMainDisease-no"
                              value="no"
                              {...register("leftMainDisease")}
                            />
                            <label htmlFor="leftMainDisease-no">No</label>
                          </div>
                        </div>
                      </div>

                      {/* Number Diseased Vessels - Conditionally Rendered */}
                      {watch("leftMainDisease") === "yes" && (
                        <div className="mt-4">
                          <label
                            htmlFor="number_diseased_vessels"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Number Diseased Vessels with ≥50% Stenosis
                          </label>
                          <input
                            type="number"
                            id="number_diseased_vessels"
                            placeholder="Enter number"
                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                            {...register("numberDiseasedVessels")}
                          />
                        </div>
                      )}

                      {/* Culprit Vessels */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Culprit Vessels
                        </label>
                        <div className="flex gap-x-4">
                          <div>
                            <input
                              type="checkbox"
                              id="culprit_lad"
                              {...register("culpritVessels.lad")}
                            />
                            <label htmlFor="culprit_lad">LAD</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="culprit_right_coronary"
                              {...register("culpritVessels.rightCoronary")}
                            />
                            <label htmlFor="culprit_right_coronary">
                              Right Coronary
                            </label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="culprit_left_circumflex"
                              {...register("culpritVessels.leftCircumflex")}
                            />
                            <label htmlFor="culprit_left_circumflex">
                              Left Circumflex
                            </label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="culprit_left_main"
                              {...register("culpritVessels.leftMain")}
                            />
                            <label htmlFor="culprit_left_main">Left Main</label>
                          </div>
                          <div>
                            <input
                              type="checkbox"
                              id="culprit_others"
                              {...register("culpritVessels.others")}
                            />
                            <label htmlFor="culprit_others">Others</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {watch("angiography") === "no" && (
                    <div className="mt-4">
                      <label
                        htmlFor="angiography_reason"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Choose Reason
                      </label>
                      <select
                        id="angiography_reason"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                        {...register("angiographyReason")}
                      >
                        <option value="">Select</option>
                        <option value="reason1">Reason 1</option>
                        <option value="reason2">Reason 2</option>
                        <option value="reason3">Reason 3</option>
                      </select>
                    </div>
                  )}

                  {/* Error message */}
                  {errors.angiography?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.angiography.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="ptca2"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      PTCA*
                    </label>
                    <div className="flex items-center gap-x-4">
                      <input
                        type="radio"
                        id="ptca-yes"
                        value="yes"
                        {...register("ptca2")}
                      />
                      <label htmlFor="ptca-yes">Yes</label>
                      <input
                        type="radio"
                        id="ptca-no"
                        value="no"
                        {...register("ptca2")}
                      />
                      <label htmlFor="ptca-no">No</label>
                    </div>
                  </div>

                  {/* Conditional rendering based on the selection */}
                  {watch("ptca2") === "yes" && (
                    <div className="mt-4">
                      {/* Date and Time Input */}
                      <div className="flex gap-x-4 items-center">
                        <label
                          htmlFor="ptca_time"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          id="ptca_time"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                          {...register("ptcaTime")}
                        />
                      </div>
                    </div>
                  )}

                  {watch("ptca2") === "no" && (
                    <div className="mt-4">
                      <label
                        htmlFor="ptca_reason"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Choose Reason
                      </label>
                      <select
                        id="ptca_reason"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                        {...register("ptcaReason")}
                      >
                        <option value="">Select</option>
                        <option value="reason1">Reason 1</option>
                        <option value="reason2">Reason 2</option>
                        <option value="reason3">Reason 3</option>
                      </select>
                    </div>
                  )}

                  {/* Error message */}
                  {errors.ptca?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.ptca.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="cabg2"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      CABG*
                    </label>
                    <div className="flex items-center gap-x-4">
                      <input
                        type="radio"
                        id="cabg2-yes"
                        value="yes"
                        {...register("cabg2")}
                      />
                      <label htmlFor="cabg2-yes">Yes</label>
                      <input
                        type="radio"
                        id="cabg2-no"
                        value="no"
                        {...register("cabg2")}
                      />
                      <label htmlFor="cabg2-no">No</label>
                    </div>
                  </div>

                  {/* Conditional rendering based on CABG selection */}
                  {watch("cabg2") === "yes" && (
                    <div className="mt-4">
                      <div className="flex gap-x-4 items-center">
                        <label
                          htmlFor="cabg_time"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          id="cabg_time"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                          {...register("cabg2Time")}
                        />
                      </div>
                    </div>
                  )}

                  {watch("cabg2") === "no" && (
                    <div className="mt-4">
                      <label
                        htmlFor="cabg2_reason"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Choose Reason
                      </label>
                      <select
                        id="cabg2_reason"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm"
                        {...register("cabgReason")}
                      >
                        <option value="">Select</option>
                        <option value="reason1">Reason 1</option>
                        <option value="reason2">Reason 2</option>
                        <option value="reason3">Reason 3</option>
                      </select>
                    </div>
                  )}

                  {errors.cabg2?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.cabg2.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                L. EventsandOutcomeinTheHospital
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8">
                {/* Reinfarction */}
                <div className="">
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="reinfarction"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Reinfarction*
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="reinfarctionNo"
                        value="No"
                        {...register("reinfarction")}
                        className="border-gray-300"
                      />
                      <label htmlFor="reinfarctionNo">No</label>
                      <input
                        type="radio"
                        id="reinfarctionYes"
                        value="Yes"
                        {...register("reinfarction")}
                        className="border-gray-300"
                      />
                      <label htmlFor="reinfarctionYes">Yes</label>
                    </div>
                  </div>
                  {watch("reinfarction") === "Yes" && (
                    <>
                      <input
                        type="text"
                        id="reinfarctionDetails"
                        placeholder="Details"
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                    </>
                  )}
                  {errors.reinfarction?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.reinfarction.message}
                    </p>
                  )}
                </div>
                {/* {stroke} */}
                <div>
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="stroke"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Stroke
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="strokeNo"
                        value="No"
                        {...register("stroke")}
                        className="border-gray-300"
                      />
                      <label htmlFor="strokeNo">No</label>
                      <input
                        type="radio"
                        id="strokeYes"
                        value="Yes"
                        {...register("stroke")}
                        className="border-gray-300"
                      />
                      <label htmlFor="strokeYes">Yes</label>
                    </div>
                  </div>
                  {watch("stroke") === "Yes" && (
                    <>
                      <select
                        id="strokeType"
                        {...register("strokeType")}
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">--- Choose Type ---</option>
                        <option value="Ischemic">Ischemic</option>
                        <option value="Hemorrhagic">Hemorrhagic</option>
                      </select>
                      {errors.strokeType && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.strokeType.message}
                        </p>
                      )}
                    </>
                  )}
                  {errors.stroke && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.stroke.message}
                    </p>
                  )}
                </div>

                {/* LV Failure */}
                <div>
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="lvFailure"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      LV Failure
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="lvFailureNo"
                        value="No"
                        {...register("lvFailure")}
                        className="border-gray-300"
                      />
                      <label htmlFor="lvFailureNo">No</label>
                      <input
                        type="radio"
                        id="lvFailureYes"
                        value="Yes"
                        {...register("lvFailure")}
                        className="border-gray-300"
                      />
                      <label htmlFor="lvFailureYes">Yes</label>
                    </div>
                  </div>
                  {watch("lvFailure") === "Yes" && (
                    <>
                      <input
                        type="text"
                        id="lvFailureDetails"
                        {...register("lvFailureDetails")}
                        placeholder="Details"
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.lvFailureDetails && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.lvFailureDetails.message}
                        </p>
                      )}
                    </>
                  )}
                  {errors.lvFailure && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.lvFailure.message}
                    </p>
                  )}
                </div>

                {/* Recurrent Ischemia/Angina */}
                <div>
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="recurrentIschemia"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Recurrent Ischemia/Angina
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="recurrentIschemiaNo"
                        value="No"
                        {...register("recurrentIschemia")}
                        className="border-gray-300"
                      />
                      <label htmlFor="recurrentIschemiaNo">No</label>
                      <input
                        type="radio"
                        id="recurrentIschemiaYes"
                        value="Yes"
                        {...register("recurrentIschemia")}
                        className="border-gray-300"
                      />
                      <label htmlFor="recurrentIschemiaYes">Yes</label>
                    </div>
                  </div>
                  {watch("recurrentIschemia") === "Yes" && (
                    <>
                      <input
                        type="text"
                        id="recurrentIschemiaDetails"
                        {...register("recurrentIschemiaDetails")}
                        placeholder="Details"
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.recurrentIschemiaDetails && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.recurrentIschemiaDetails.message}
                        </p>
                      )}
                    </>
                  )}
                  {errors.recurrentIschemia && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.recurrentIschemia.message}
                    </p>
                  )}
                </div>

                {/* Cardiac Arrest */}
                <div>
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="cardiacArrest"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cardiac Arrest
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="cardiacArrestNo"
                        value="No"
                        {...register("cardiacArrest")}
                        className="border-gray-300"
                      />
                      <label htmlFor="cardiacArrestNo">No</label>
                      <input
                        type="radio"
                        id="cardiacArrestYes"
                        value="Yes"
                        {...register("cardiacArrest")}
                        className="border-gray-300"
                      />
                      <label htmlFor="cardiacArrestYes">Yes</label>
                    </div>
                  </div>
                  {watch("cardiacArrest") === "Yes" && (
                    <>
                      <select
                        id="cardiacArrestType"
                        {...register("cardiacArrestType")}
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">--- Choose Option ---</option>
                        <option value="Ventricular Fibrillation">
                          Ventricular Fibrillation
                        </option>
                        <option value="Asystole">Asystole</option>
                        <option value="Pulseless Electrical Activity">
                          Pulseless Electrical Activity
                        </option>
                      </select>
                      {errors.cardiacArrestType && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.cardiacArrestType.message}
                        </p>
                      )}
                    </>
                  )}
                  {errors.cardiacArrest && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.cardiacArrest.message}
                    </p>
                  )}
                </div>

                {/* Cardiogenic Shock */}
                <div>
                  <div className="flex gap-x-4">
                    <label
                      htmlFor="cardiogenicShock"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cardiogenic Shock
                    </label>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="radio"
                        id="cardiogenicShockNo"
                        value="No"
                        {...register("cardiogenicShock")}
                        className="border-gray-300"
                      />
                      <label htmlFor="cardiogenicShockNo">No</label>
                      <input
                        type="radio"
                        id="cardiogenicShockYes"
                        value="Yes"
                        {...register("cardiogenicShock")}
                        className="border-gray-300"
                      />
                      <label htmlFor="cardiogenicShockYes">Yes</label>
                    </div>
                  </div>
                  {watch("cardiogenicShock") === "Yes" && (
                    <>
                      <input
                        type="text"
                        id="cardiogenicShockDetails"
                        {...register("cardiogenicShockDetails")}
                        placeholder="Details"
                        className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.cardiogenicShockDetails && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.cardiogenicShockDetails.message}
                        </p>
                      )}
                    </>
                  )}
                  {errors.cardiogenicShock && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.cardiogenicShock.message}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-5 text-3xl text-center font-bold leading-6 text-gray-600">
                M. Counselling
              </p>
              <div className="mt-10 flex flex-col gap-x-6 gap-y-8 ">
                <div className="">
                  <textarea
                    id="counselling"
                    {...register("counselling")}
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.address?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                complete page , abhi Review krlo details chaho toh
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Review your details and submit the form.
              </p>
              <div className="">
                <label
                  htmlFor="incidentid"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Incident ID*
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="incidentid"
                    {...register("incidentid")}
                    className="block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  />
                  {errors.incidentid?.message && (
                    <p className="mt-2 text-sm text-red-400">
                      {errors.incidentid.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="my-8">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  In-Charge IDs*
                </label>
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-x-2 mb-4"
                  >
                    <input
                      type="text"
                      {...register(`inchargeIds.${index}`)}
                      className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      placeholder={`In-Charge ID #${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-3 py-1 text-sm font-medium text-red-600 hover:underline"
                      disabled={fields.length === 1}
                    >
                      Delete
                    </button>
                    {errors.inchargeIds && errors.inchargeIds[index] && (
                      <p className="text-sm text-red-400">
                        {errors.inchargeIds[index]?.message}
                      </p>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => append("")}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm font-medium"
                >
                  Add ID
                </button>
                {errors.inchargeIds?.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.inchargeIds?.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex gap-x-4 mt-8">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prev}
                className="inline-block rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={next}
                className="inline-block rounded-md border border-transparent bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Next
              </button>
            )}
            {currentStep === steps.length - 1 && (
              <button
                type="submit"
                className="inline-block rounded-md border border-transparent bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
