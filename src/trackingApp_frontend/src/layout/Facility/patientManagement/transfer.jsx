import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ActorContext from "../../../ActorContext";
import { toast } from "@/components/ui/use-toast";
import { useContext } from "react";

const transferSchema = z.object({
  patientId: z
    .string()
    .min(1, "Patient ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  newFacilityId: z
    .string()
    .min(1, "New Facility ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  file: z.instanceof(FileList).optional(),
});

const Transfer = () => {
  const { actors } = useContext(ActorContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      patientId: "",
      newFacilityId: "",
      file: null,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const reportFile = new TextEncoder(JSON.stringify(data.file));
    const result = await actors.patient.transferPatient(
      data.patientId,
      data.newFacilityId,
      []
    );
    Object.keys(result).forEach((key) => {
      if (key === "ok") {
        toast({
          title: "Success",
          description: result[key],
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result[key],
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Transfer Form</h1>
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
            htmlFor="newFacilityId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            New Facility ID*
          </label>
          <input
            type="text"
            id="newFacilityId"
            {...register("newFacilityId")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.newFacilityId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.newFacilityId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Upload File (Optional)
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
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Transfer;
