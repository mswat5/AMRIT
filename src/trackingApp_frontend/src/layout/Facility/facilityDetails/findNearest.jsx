import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import ActorContext from "../../../ActorContext";
import { toast } from "@/components/ui/use-toast";

const FindNearestFacility = () => {
  const { actors } = useContext(ActorContext);
  const [nearestFacilities, setNearestFacilities] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const result = await actors.facility.getNearestFacilities(
              data.service,
              position.coords.latitude,
              position.coords.longitude
            );
            if (result.ok) {
              setNearestFacilities(result.ok);
            } else {
              toast({
                title: "Error",
                description: result.err,
                variant: "destructive",
              });
            }
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
    } catch (error) {
      console.error("Error finding nearest facilities:", error);
      toast({
        title: "Error",
        description: "Failed to find nearest facilities",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Find Nearest Facility
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <div>
          <label
            htmlFor="service"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Service
          </label>
          <input
            type="text"
            id="service"
            {...register("service", { required: "Service is required" })}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.service && (
            <p className="mt-2 text-sm text-red-400">
              {errors.service.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm font-medium"
        >
          Find Nearest Facilities
        </button>
      </form>
      {nearestFacilities.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Nearest Facilities
          </h2>
          {nearestFacilities.map((facility, index) => (
            <div
              key={index}
              className="mb-4 p-4 border rounded-md"
            >
              <h3 className="font-semibold">{facility.name}</h3>
              <p>Location: {facility.location.address}</p>
              <p>Available Beds: {facility.availableBeds}</p>
              <p>Contact: {facility.contactInfo.phoneNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindNearestFacility;
