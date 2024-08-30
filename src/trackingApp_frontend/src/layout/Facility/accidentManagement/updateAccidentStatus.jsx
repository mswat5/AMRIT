import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ActorContext from "../../../ActorContext";
import { toast } from "@/components/ui/use-toast";

const updateAccidentStatusSchema = z.object({
  accidentId: z
    .string()
    .min(1, "Accident ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  status: z.enum(
    ["Reported", "ServiceAssigned", "InProgress", "Resolved"],
    "Accident status is required"
  ),
});

const UpdateAccidentStatus = () => {
  const { actors } = useContext(ActorContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateAccidentStatusSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await actors.accident.updateAccidentStatus(
        data.accidentId,
        { [data.status]: null }
      );
      if ("ok" in result) {
        toast({
          title: "Success",
          description: result.ok,
          variant: "success",
        });
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Update Accident Status
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <div>
          <label
            htmlFor="accidentId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Accident ID*
          </label>
          <input
            type="text"
            id="accidentId"
            {...register("accidentId")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.accidentId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.accidentId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Accident Status*
          </label>
          <select
            id="status"
            {...register("status")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          >
            <option value="">Select Status</option>
            <option value="Reported">Reported</option>
            <option value="ServiceAssigned">Service Assigned</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          {errors.status && (
            <p className="mt-2 text-sm text-red-400">{errors.status.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm font-medium"
        >
          Update Status
        </button>
      </form>
    </div>
  );
};

export default UpdateAccidentStatus;
