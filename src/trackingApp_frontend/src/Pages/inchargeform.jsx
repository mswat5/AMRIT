import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the validation schema using Zod
const inchargeFormSchema = z.object({
  inchargeName: z.string().min(1, 'Incharge Name is required'),
  location: z.string().min(1, 'Location is required'),
  designation: z.string().min(1, 'Designation is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  contactInfo: z
    .string()
    .min(1, 'Contact Info is required')
    .regex(/^\+?\d+$/, 'Invalid contact number'),
  certificationId: z.string().min(1, 'Certification ID is required'),
});

const InchargeForm = () => {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inchargeFormSchema),
    defaultValues: {
      inchargeName: '',
      location: '',
      designation: '',
      email: '',
      contactInfo: '',
      certificationId: '',
    },
  });

  const onSubmit = (data) => {
     // Convert form data to JSON format
     const jsonData = JSON.stringify(data, null, 2);
    
     // Log the JSON data to the console
     console.log(jsonData);
    reset();
    navigate('/Incharge/IDashboard');
  };

  return (
    <div className="mt-5 max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Incharge Information</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        
        <div>
          <label htmlFor="inchargeName" className="block text-sm font-medium leading-6 text-gray-900">
            Incharge Name*
          </label>
          <input
            type="text"
            id="inchargeName"
            {...register('inchargeName')}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.inchargeName && (
            <p className="mt-2 text-sm text-red-400">
              {errors.inchargeName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
            Location*
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.location && (
            <p className="mt-2 text-sm text-red-400">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium leading-6 text-gray-900">
            Designation*
          </label>
          <input
            type="text"
            id="designation"
            {...register('designation')}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.designation && (
            <p className="mt-2 text-sm text-red-400">
              {errors.designation.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
            Email*
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium leading-6 text-gray-900">
            Contact Info*
          </label>
          <input
            type="text"
            id="contactInfo"
            {...register('contactInfo')}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            placeholder="+1234567890"
          />
          {errors.contactInfo && (
            <p className="mt-2 text-sm text-red-400">
              {errors.contactInfo.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="certificationId" className="block text-sm font-medium leading-6 text-gray-900">
            Certification ID*
          </label>
          <input
            type="text"
            id="certificationId"
            {...register('certificationId')}
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