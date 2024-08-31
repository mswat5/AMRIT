import React from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ActorContext from "../../../ActorContext";
// Update the validation schema with patientStatus options
const updateStatusSchema = z.object({
  patientId: z
    .string()
    .min(1, "Patient ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  patientStatus: z.enum(
    [
      "Admitted",
      "UnderTreatment",
      "Stable",
      "Critical",
      "InTransit",
      "Discharged",
    ],
    "Patient status is required"
  ),
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "File upload is required",
  }),
});

const UpdateStatus = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      patientId: "",
      patientStatus: "",
      file: null,
    },
  });

  const { actors } = useContext(ActorContext);

  const onSubmit = async (data) => {
    try {
      const { patientId, patientStatus, file } = data;

      // Convert file to Uint8Array
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file[0]);

      fileReader.onload = async (event) => {
        const uint8Array = new Uint8Array(event.target.result);

        // Call the backend function to update patient status
        const result = await actors.patient.updatePatientStatus(
          patientId,
          { [patientStatus]: null },
          [uint8Array]
        );

        if (result.ok) {
          console.log("Patient status updated successfully:", result.ok);
          // Add success notification or redirect logic here
        } else {
          console.error("Error updating patient status:", result.err);
          // Add error notification logic here
        }
      };
    } catch (error) {
      console.error("Error in onSubmit:", error);
      // Add error notification logic here
    }
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Status</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div>
          <label
            htmlFor="patientId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Patient ID*
          </label>
          <input
            type="text"
            id="patientId"
            {...register("patientId")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.patientId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.patientId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="patientStatus"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Patient Status*
          </label>
          <select
            id="patientStatus"
            {...register("patientStatus")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          >
            <option value="">Select Status</option>
            <option value="Admitted">Admitted</option>
            <option value="UnderTreatment">Under Treatment</option>
            <option value="Stable">Stable</option>
            <option value="Critical">Critical</option>
            <option value="InTransit">In Transit</option>
            <option value="Discharged">Discharged</option>
          </select>
          {errors.patientStatus && (
            <p className="mt-2 text-sm text-red-400">
              {errors.patientStatus.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upload File*
          </label>
          <input
            type="file"
            id="file"
            {...register("file")}
            className="block w-full text-gray-900"
          />
          {errors.file && (
            <p className="mt-2 text-sm text-red-400">{errors.file.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateStatus;
