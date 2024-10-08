import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'


const steps = [
  {
    id: 'Step 1',
    name: 'Facility Details',
    fields: ['facilityName', 'facilityLocation', 'facilityCapacity', 'availableBeds', 'certificationId']
  },
  {
    id: 'Step 2',
    name: 'Contact Information',
    fields: ['contactName', 'contactEmail', 'contactPhone']
  },
  { id: 'Step 3', name: 'Complete' }
]

export const FormDataSchema = z.object({
  facilityName: z.string().min(1, 'Facility name is required'),
  facilityLocation: z.string().min(1, 'Facility location is required'),
  facilityCapacity: z.string().min(1, 'Facility capacity is required'),
  availableBeds: z.string().min(1, 'Available beds are required'),
  certificationId: z.string().min(1, 'Certification ID is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Contact email is required').email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required')
})

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(FormDataSchema)
  })

  const processForm = data => {
    // Convert form data to JSON format
    const jsonData = JSON.stringify(data, null, 2);
    
    // Log the JSON data to the console
    console.log(jsonData);
    reset()
    navigate('/facility/home');
  }

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields, { shouldFocus: true })

    if (!output) return

    if (currentStep === steps.length - 1) {
      await handleSubmit(processForm)();
    } else {
      setPreviousStep(currentStep);
      setCurrentStep(step => step + 1);
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  return (
    <div>
      <h1 className='text-2xl text-center font-semibold leading-8 text-gray-900 m-4 mt-8'>
        Register Facility
      </h1>
      <section className='flex flex-col justify-between p-16'>
        {/* steps */}
        <nav aria-label='Progress'>
          <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
            {steps.map((step, index) => (
              <li key={step.name} className='md:flex-1'>
                {currentStep > index ? (
                  <div className='group flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-red-600 transition-colors '>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className='flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                    aria-current='step'
                  >
                    <span className='text-sm font-medium text-red-600'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                ) : (
                  <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-gray-500 transition-colors'>
                      {step.id}
                    </span>
                    <span className='text-sm font-medium'>{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <form className='mt-12 py-12' onSubmit={handleSubmit(processForm)}>
          {currentStep === 0 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Facility Details
              </h2>
              <p className='mt-1 text-sm leading-6 text-gray-600'>
                Provide details about the facility.
              </p>
              <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
                <div className='sm:col-span-3'>
                  <label
                    htmlFor='facilityName'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Facility Name
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='facilityName'
                      {...register('facilityName')}
                      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.facilityName?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.facilityName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label
                    htmlFor='facilityLocation'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Facility Location
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='facilityLocation'
                      {...register('facilityLocation')}
                      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.facilityLocation?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.facilityLocation.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label
                    htmlFor='facilityCapacity'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Facility Capacity
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='facilityCapacity'
                      {...register('facilityCapacity')}
                      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.facilityCapacity?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.facilityCapacity.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='sm:col-span-3'>
                  <label
                    htmlFor='availableBeds'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Available Beds
                  </label>
                  <div className='mt-2'>
                    <input
                      type='text'
                      id='availableBeds'
                      {...register('availableBeds')}
                      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.availableBeds?.message && (
                      <p className='mt-2 text-sm text-red-400'>
                        {errors.availableBeds.message}
                        </p>
                    )}
                    </div>
                    </div>
                    <div className='sm:col-span-3'>
              <label
                htmlFor='certificationId'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Certification ID
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='certificationId'
                  {...register('certificationId')}
                  className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.certificationId?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.certificationId.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {currentStep === 1 && (
        <motion.div
          initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
            Contact Information
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Provide contact details for the facility.
          </p>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-3'>
              <label
                htmlFor='contactName'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Contact Name
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='contactName'
                  {...register('contactName')}
                  className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.contactName?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.contactName.message}
                  </p>
                )}
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='contactEmail'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Contact Email
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='contactEmail'
                  {...register('contactEmail')}
                  className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.contactEmail?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className='sm:col-span-3'>
              <label
                htmlFor='contactPhone'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Contact Phone
              </label>
              <div className='mt-2'>
                <input
                  type='text'
                  id='contactPhone'
                  {...register('contactPhone')}
                  className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.contactPhone?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

{currentStep === 2 && (
  <motion.div
    initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    <h2 className='text-base font-semibold leading-7 text-gray-900'>
      Complete Registration
    </h2>
    <p className='mt-1 text-sm leading-6 text-gray-600'>
      Review all information before submitting.
    </p>
    <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Facility Name
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('facilityName')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Facility Location
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('facilityLocation')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Capacity
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('facilityCapacity')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Available Beds
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('availableBeds')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Certification ID
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('certificationId')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Contact Name
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('contactName')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Contact Email
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('contactEmail')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>

      <div className='sm:col-span-3'>
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          Contact Phone
        </label>
        <div className='mt-2'>
          <input
            type='text'
            value={watch('contactPhone')}
            readOnly
            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
          />
        </div>
      </div>
    </div>
  </motion.div>
)}

      <div className='mt-8 flex justify-between'>
        {currentStep > 0 && (
          <button
            type='button'
            onClick={prev}
            className='bg-gray-200 px-4 py-2 text-gray-600 rounded'
          >
            Previous
          </button>
        )}
        <button
          type='button'
          onClick={next}
          className='bg-red-600 text-white px-4 py-2 rounded'
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </form>
  </section>
</div>)}