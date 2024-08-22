import { useState } from 'react'
import { motion } from 'framer-motion'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Step 1',
    name: 'Facility Details',
    fields: ['facilityName', 'facilityType', 'facilityCapacity']
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
  facilityType: z.string().min(1, 'Facility type is required'),
  facilityCapacity: z.string().min(1, 'Facility capacity is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().min(1, 'Contact email is required').email('Invalid email address'),
  contactPhone: z.string().min(1, 'Contact phone is required')
})

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
  }

  type FieldName = keyof Inputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)()
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
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
      Register Ambulance
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
            <h2 className='text-base font-semibold leading-7 text-gray-900 '>
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
                  htmlFor='facilityType'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Facility Type
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='facilityType'
                    {...register('facilityType')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                  {errors.facilityType?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.facilityType.message}
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
                type='email'
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
                type='tel'
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
          Confirmation
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600'>
          Please review and confirm the details.
        </p>

        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Facility Name
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('facilityName')}
              </p>
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Facility Type
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('facilityType')}
              </p>
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Facility Capacity
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('facilityCapacity')}
              </p>
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Contact Name
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('contactName')}
              </p>
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Contact Email
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('contactEmail')}
              </p>
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
              Contact Phone
            </label>
            <div className='mt-2'>
              <p className='block w-full rounded-md p-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6'>
                {watch('contactPhone')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )}

    <div className='mt-6 flex items-center justify-end gap-x-6'>
      {currentStep > 0 && (
        <button
          type='button'
          onClick={prev}
          className='text-sm font-semibold leading-6 text-gray-900'
        >
          Previous
        </button>
      )}
      {currentStep < steps.length - 1 && (
        <button
          type='button'
          onClick={next}
          className='rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600'
        >
          Next
        </button>
      )}
    </div>
  </form>
</section>
</div>
  )
}