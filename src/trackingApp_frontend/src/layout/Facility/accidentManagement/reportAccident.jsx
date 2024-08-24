import React, { useContext, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ActorContext from "../../../ActorContext";
import { useToast } from "@/components/ui/use-toast";

// Define the validation schema using Zod
const reportIncidentSchema = z.object({
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  severity: z.enum(
    ["Minor", "Moderate", "Severe", "Critical"],
    "Select a severity level"
  ),
  inchargeIds: z
    .array(
      z
        .string()
        .min(1, "ID cannot be empty")
        .regex(/^\+?\d+$/, "Invalid input (should be a number)")
    )
    .min(1, "At least one in-charge ID is required"),
});

const ReportIncident = () => {
  const { actors } = useContext(ActorContext);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportIncidentSchema),
    defaultValues: {
      location: "",
      description: "",
      severity: "",
      inchargeIds: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inchargeIds",
  });

  const onSubmit = async (data) => {
    console.log(data);

    const result = await actors.accident.createAccidentReport(
      {
        currentFacilityId: "0",
        description: data.description,
        location: {
          latitude: latitude,
          longitude: longitude,
          address: data.facilityLocation,
        },
        reportingFacilityId: "Text",
        severity: {
          [data.severity]: null,
        },
      },
      [],
      data.inchargeIds
    );

    console.log(result);
    console.log(result.ok);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Error",
            description: "Failed to get location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Report Incident</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Location*
          </label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.location && (
            <p className="mt-2 text-sm text-red-400">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description*
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            rows="4"
          ></textarea>
          {errors.description && (
            <p className="mt-2 text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="severity"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Severity*
          </label>
          <select
            id="severity"
            {...register("severity")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          >
            <option value="">Select Severity</option>
            <option value="Minor">Minor</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
            <option value="Critical">Critical</option>
          </select>
          {errors.severity && (
            <p className="mt-2 text-sm text-red-400">
              {errors.severity.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            In-Charge IDs*
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex gap-x-2">
                <input
                  type="text"
                  {...register(`inchargeIds.${index}`)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
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
              </div>
              {errors.inchargeIds && errors.inchargeIds[index] && (
                <p className="mt-1 text-sm text-red-400">
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

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;
