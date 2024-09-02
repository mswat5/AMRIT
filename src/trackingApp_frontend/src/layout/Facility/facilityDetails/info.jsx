import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facilitySchema } from "../../zod";

const FacilityInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      facilityName: "",
      facilityLocation: "",
      facilityCapacity: 0,
      services: "",
      certificationId: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const [initialData, setInitialData] = useState(null);
  // useEffect(() => {
  //   // Fetch initial data from backend
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/facility/1"); // Replace '1' with the actual facility ID
  //       if (!response.ok) throw new Error("Failed to fetch data");
  //       const data = await response.json();
  //       setInitialData(data);

  //       // Populate the form with fetched data
  //       for (const [key, value] of Object.entries(data)) {
  //         setValue(key, value);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [setValue]);

  // const onSubmit = async (data) => {
  //   try {
  //     const response = await fetch("/api/facility/1", {
  //       // Replace '1' with the actual facility ID
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (!response.ok) throw new Error("Failed to update data");
  //     const result = await response.json();
  //     console.log("Update result:", result);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //   }
  // };

  useEffect(() => {
    // Simulating an API call to fetch initial data
    const fetchData = async () => {
      const dummyData = {
        facilityName: "HealthCare Facility",
        facilityLocation: "123 Wellness St.",
        facilityCapacity: 100,
        services: "Emergency, General Care, Surgery",
        certificationId: "CERT123456",
        contactName: "John Doe",
        contactEmail: "john.doe@example.com",
        contactPhone: "+1234567890",
      };
      setInitialData(dummyData);
      // Set form values with the fetched data
      for (const [key, value] of Object.entries(dummyData)) {
        setValue(key, value);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log("Updated data:", data);
    // Replace with your API call or form submission logic
    // Example: await updateFacilityInfo(data);
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Facility Info</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div>
          <label
            htmlFor="facilityName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Facility Name*
          </label>
          <input
            type="text"
            id="facilityName"
            {...register("facilityName")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.facilityName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.facilityName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="facilityLocation"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Facility Location*
          </label>
          <input
            type="text"
            id="facilityLocation"
            {...register("facilityLocation")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.facilityLocation && (
            <p className="mt-2 text-sm text-red-400">
              {errors.facilityLocation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="facilityCapacity"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Facility Capacity*
          </label>
          <input
            type="number"
            id="facilityCapacity"
            {...register("facilityCapacity", { valueAsNumber: true })}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.facilityCapacity && (
            <p className="mt-2 text-sm text-red-400">
              {errors.facilityCapacity.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="services"
            className="block ext-sm font-medium leading-6 text-gray-900"
          >
            Services Offered*
          </label>
          <input
            type="text"
            id="services"
            {...register("services")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.services && (
            <p className="mt-2 text-sm text-red-400">
              {errors.services.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="certificationId"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Certification ID*
          </label>
          <input
            type="text"
            id="certificationId"
            {...register("certificationId")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.certificationId && (
            <p className="mt-2 text-sm text-red-400">
              {errors.certificationId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Contact Name*
          </label>
          <input
            type="text"
            id="contactName"
            {...register("contactName")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.contactName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.contactName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            {...register("contactEmail")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.contactEmail && (
            <p className="mt-2 text-sm text-red-400">
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contactPhone"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Contact Phone*
          </label>
          <input
            type="text"
            id="contactPhone"
            {...register("contactPhone")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.contactPhone && (
            <p className="mt-2 text-sm text-red-400">
              {errors.contactPhone.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
        >
          Save Changes
        </button>
      </form>

      {/* {initialData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Current Data
            {JSON.stringify(initialData, null, 2)}
          </h2>
        </div>
      )} */}
    </div>
  );
};
export default FacilityInfo;
