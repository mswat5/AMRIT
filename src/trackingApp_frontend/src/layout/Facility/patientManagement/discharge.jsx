import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const dischargeSchema = z.object({
  accidentId: z
    .string()
    .min(1, "Accident ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  patientId: z
    .string()
    .min(1, "Patient ID is required")
    .regex(/^\+?\d+$/, "Invalid input (should be a number)"),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "File is required"),
  inchargeIds: z
    .array(
      z
        .string()
        .min(1, "In-Charge ID cannot be empty")
        .regex(/^\+?\d+$/, "Invalid input (should be a number)")
    )
    .min(1, "At least one In-Charge ID is required"),
});

const Discharge = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      accidentId: "",
      patientId: "",
      inchargeIds: [""],
      file: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inchargeIds",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Discharge Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
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

export default Discharge;
