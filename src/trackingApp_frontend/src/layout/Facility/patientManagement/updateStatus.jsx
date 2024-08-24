import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema Definition
const updateStatusSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  patientStatus: z.string().min(1, "Patient status is required"),
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "File upload is required",
  }),
});

// UpdateStatus Component
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

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Status</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        {/* Patient ID */}
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

        {/* Patient Status */}
        <div>
          <label
            htmlFor="patientStatus"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Patient Status*
          </label>
          <input
            type="text"
            id="patientStatus"
            {...register("patientStatus")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.patientStatus && (
            <p className="mt-2 text-sm text-red-400">
              {errors.patientStatus.message}
            </p>
          )}
        </div>

        {/* File Upload */}
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
