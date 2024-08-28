import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const steps = [
  {
    id: "Step 1",
    name: "Ambulance Details",
    fields: ["ambulanceName", "location"],
  },
  {
    id: "Step 2",
    name: "Contact Information",
    fields: ["contactInfo", "certificationId"],
  },
  { id: "Step 3", name: "Complete" },
];

export const FormDataSchema = z.object({
  ambulanceName: z.string().min(1, "Ambulance name is required"),
  location: z.string().min(1, "Location is required"),
  contactInfo: z.string().min(1, "Contact info is required"),
  certificationId: z.string().min(1, "Certification ID is required"),
});

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormDataSchema),
  });

  const processForm = (data) => {
    // Convert form data to JSON format
    const jsonData = JSON.stringify(data, null, 2);

    // Log the JSON data to the console
    console.log(jsonData);
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
        Register Ambulance
      </h1>
      <section className="flex flex-col justify-between p-16">
        {/* steps */}
        <nav aria-label="Progress">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-red-600 transition-colors ">
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

        {/* Form */}
        <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900 ">
                Ambulance Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide details about the ambulance.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="ambulanceName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Ambulance Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="ambulanceName"
                      {...register("ambulanceName")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.ambulanceName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.ambulanceName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Location
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="location"
                      {...register("location")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.location?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Contact Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Provide contact details for the ambulance.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="contactInfo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contact Info
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="contactInfo"
                      {...register("contactInfo")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.contactInfo?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactInfo.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="certificationId"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Certification ID
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="certificationId"
                      {...register("certificationId")}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.certificationId?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.certificationId.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Complete
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Review and submit the details.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Ambulance Name:
                    <div className="mt-2">
                      <p className="block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                        {watch("ambulanceName")}
                      </p>
                    </div>
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Location:
                    <div className="mt-2">
                      <p className="block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                        {" "}
                        {watch("location")}
                      </p>
                    </div>
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Status:{" "}
                    <div className="mt-2">
                      <p className="block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                        {watch("status")}
                      </p>
                    </div>
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Contact Info:{" "}
                    <div className="mt-2">
                      <p className="block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                        {watch("contactInfo")}
                      </p>
                    </div>
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="block text-sm font-medium leading-6 text-gray-900">
                    Certification ID:{" "}
                    <div className="mt-2">
                      <p className="block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6">
                        {watch("certificationId")}
                      </p>
                    </div>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </form>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prev}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Back
            </button>
          )}

          <button
            type="button"
            onClick={next}
            className="ml-auto inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </section>
    </div>
  );
}
