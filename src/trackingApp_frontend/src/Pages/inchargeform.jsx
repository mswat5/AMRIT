import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { ActorContext } from "../ActorContext";
import { Principal } from "@dfinity/principal";
import { ChevronLeft } from "lucide-react";

const inchargeFormSchema = z.object({
  inchargeName: z.string().min(1, "Incharge Name is required"),
  location: z.string().min(1, "Location is required"),
  designation: z.enum(
    ["DistrictHubCoordinator", "HubIncharge", "ClusterManager"],
    "Designation is required"
  ),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone Number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  certificationId: z
    .string()
    .min(1, "Certification ID is required")
    .regex(/^\d+$/, "Certification ID must be a number"),
});

const InchargeForm = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { actors } = useContext(ActorContext);
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inchargeFormSchema),
    defaultValues: {
      inchargeName: "",
      location: "",
      designation: "",
      email: "",
      phoneNumber: "",
      certificationId: "",
    },
  });
  const handleBackClick = () => {
    navigate("/register");
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

  const onSubmit = async (data) => {
    console.log(data);
    const getPrincipal = await actors.admin.whoami();
    const result = await actors.admin.registerIncharge({
      certificationID: data.certificationId,
      contactInfo: {
        phoneNumber: data.phoneNumber,
        email: data.email,
      },
      id: "0",
      inchargeType: {
        [data.designation]: null,
      },
      location: {
        latitude: latitude,
        longitude: longitude,
        address: data.location,
      },
      name: data.inchargeName,
      principal: Principal.fromText(getPrincipal),
      registrationStatus: { Pending: null },
    });
    console.log(result);
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
    reset();
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <button
        onClick={handleBackClick}
        className=" p-2 pl-4 text-black rounded-md mb-4 flex gap-x-4 font-semibold text-xl"
      >
        <ChevronLeft /> Back To Register
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Incharge Information
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div>
          <label
            htmlFor="inchargeName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Incharge Name*
          </label>
          <input
            type="text"
            id="inchargeName"
            {...register("inchargeName")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.inchargeName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.inchargeName.message}
            </p>
          )}
        </div>

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
            htmlFor="designation"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Designation*
          </label>
          <select
            id="designation"
            {...register("designation")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          >
            <option value="" disabled>
              Select a designation
            </option>
            <option value="DistrictHubCoordinator">
              District Hub Coordinator
            </option>
            <option value="HubIncharge">Hub Incharge</option>
            <option value="ClusterManager">Cluster Manager</option>
          </select>
          {errors.designation && (
            <p className="mt-2 text-sm text-red-400">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email*
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Phone Number*
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber")}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            placeholder="+1234567890"
          />
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-400">
              {errors.phoneNumber.message}
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

export default InchargeForm;
