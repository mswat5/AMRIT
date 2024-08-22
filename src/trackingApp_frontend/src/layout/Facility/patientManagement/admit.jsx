import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm,useFieldArray  } from 'react-hook-form';


const steps = [
  {
    id: 'Step 1',
    name: 'Registration Details',
    fields: ['patientInitials', 'mobile', 'address', 'gender', 'dobKnownAge', 'registrationDate']
  },
  {
    id: 'Step 2',
    name: 'Demographics Details',
    fields: ['residence', 'postalCode', 'monthlyIncome', 'inclusionCriteria', 'exclusionCriteria']
  },
  {
    id:'step 3',
    name:'Medical Clinical Details',
    fields: [
      'stableAngina', 
      'priorMI', 
      'ptca', 
      'cabg', 
      'otherCardiovascularEvents', 
      'prematureFamilyHistory', 
      'dyslipidemiaOnStatin', 
      'hypertension', 
      'diabetes', 
      'smokingStatus', 
      'smokelessTobaccoStatus','symptomOnset', 'firstContact', 'transportToFirstContact', 'transportToHubHospital', 'presentationToER','heartRate', 'bloodPressure','kilipClass','indexECG', 'ecgFindings', 'lbbb', 'rbbb','otherAbnormalities'
  ]
  },
  {
    id:'step 4',
    name:'Hospital Events Details',
    fields:['counselling','reinfarction', 'stroke', 'vlFailure', 'recurrentIschemia', 'cardiacArrest', 'cardiogenicShock',
            'mechanicalComplications', 'bleedingRequiringTransfusion', 'death', 'discharge', 'height', 'weight', 'bmi','thrombolysis', 'echo', 'angiography', 'ptca2','preHubManagement', 'duringAdmission', 'prescribedAtDischarge','initialCreatinine', 'randomGlucose', 'fastingGlucose', 'cardiacMarker']
  },
  { id: 'Step 5', name: 'Complete' }
];

export const FormDataSchema = z.object(
    {
        patientInitials: z.object({
          initial1: z.string().length(1, 'Must be a single character').transform(val => val.toUpperCase()).optional(),
          initial2: z.string().length(1, 'Must be a single character').transform(val => val.toUpperCase()).optional(),
          initial3: z.string().length(1, 'Must be a single character').transform(val => val.toUpperCase()).optional(),
        }).optional(),
        mobile: z.string().optional(),
        address: z.string().optional(),
        gender: z.string().optional(),
        dobKnownAge: z.string().optional(),
        registrationDate: z.string().optional(),
        inchargeIds: z.array(z.string().min(1, 'ID cannot be empty')).min(1, 'At least one in-charge ID is required'),
        incidentid: z.string().optional(),
        residence: z.string().optional(),
        postalCode: z.string().optional(),
        monthlyIncome: z.string().optional(),
        inclusionCriteria: z.string().optional(),
        stableAngina: z.boolean().optional(),
        priorMI: z.boolean().optional(),
        ptca: z.boolean().optional(),
        cabg: z.boolean().optional(),
        otherCardiovascularEvents: z.string().optional(),
        prematureFamilyHistory: z.boolean().optional(),
        dyslipidemiaOnStatin: z.boolean().optional(),
        hypertension: z.boolean().optional(),
        diabetes: z.boolean().optional(),
        smokingStatus: z.boolean().optional(),
        smokelessTobaccoStatus: z.boolean().optional(),
        symptomOnset: z.string().optional(),
        firstContact: z.string().optional(),
        transportToFirstContact: z.string().optional(),
        transportToHubHospital: z.string().optional(),
        transportOtherSpecify: z.string().optional(),
        presentationToER: z.string().optional(),
        heartRate: z.string().optional(),
        bloodPressure: z.object({
          systolic: z.string().optional(),
          diastolic: z.string().optional(),
        }).optional(),
        kilipClass: z.string().optional(),
        indexECG: z.string().optional(),
        ecgFindings: z.string().optional(),
        stemiFindings: z.object({
          TSElevation: z.boolean().optional(),
          AnteriorLeads: z.boolean().optional(),
          LateralLeads: z.boolean().optional(),
          InferiorLeads: z.boolean().optional(),
          SeptalLeads: z.boolean().optional(),
        }).optional(),
        nstemiFindings: z.object({
          STDepression: z.boolean().optional(),
          TWaves: z.boolean().optional(),
          None: z.boolean().optional(),
        }).optional(),
        lbbb: z.string().optional(),
        lbbbType: z.string().optional().nullable(),
        rbbb: z.string().optional(),
        rbbbType: z.string().optional().nullable(),
        otherAbnormalities: z.string().optional(),
        otherAbnormalityDetails: z.object({
          atrialFibFlutter: z.boolean().optional(),
          vtach: z.boolean().optional(),
          posteriorInfarction: z.boolean().optional(),
          rbbb: z.boolean().optional(),
          nonspecificSTChange: z.boolean().optional(),
          pacedRhythm: z.boolean().optional(),
          leftVentricularHypertrophy: z.boolean().optional(),
          avBlock: z.boolean().optional(),
        }).optional(),
        counselling: z.string().optional(),
        reinfarction: z.string().optional(),
        stroke: z.string().optional(),
        vlFailure: z.string().optional(),
        recurrentIschemia: z.string().optional(),
        cardiacArrest: z.string().optional(),
        cardiogenicShock: z.string().optional(),
        mechanicalComplications: z.string().optional(),
        bleedingRequiringTransfusion: z.string().optional(),
        death: z.string().optional(),
        discharge: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        bmi: z.string().optional(),
        thrombolysis: z.string().optional(),
        echo: z.string().optional(),
        angiography: z.string().optional(),
        ptca2: z.string().optional(),
        preHubManagement: z.array(z.string()).optional(),
        duringAdmission: z.array(z.string()).optional(),
        prescribedAtDischarge: z.array(z.string()).optional(),
        initialCreatinine: z.string().optional(),
        randomGlucose: z.string().optional(),
        fastingGlucose: z.string().optional(),
        cardiacMarker: z.object({
          cpk: z.object({
            done: z.boolean().optional(),
            qualitative: z.string().optional(),
            quantitative: z.string().optional(),
            value: z.string().optional(),
            uln: z.string().optional(),
          }).optional(),
          ckMb: z.object({
            done: z.boolean().optional(),
            qualitative: z.string().optional(),
            quantitative: z.string().optional(),
            value: z.string().optional(),
            uln: z.string().optional(),
          }).optional(),
          troponin: z.object({
            done: z.boolean().optional(),
            qualitative: z.string().optional(),
            quantitative: z.string().optional(),
            value: z.string().optional(),
            uln: z.string().optional(),
          }).optional(),
        }).optional(),
      });

 

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  const {
control,
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(FormDataSchema)
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inchargeIds',
  });
  const processForm = (data) => {
    console.log(data);
    reset();
  };


  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields , { shouldFocus: true });

    if (!output) return;

    if (currentStep === steps.length - 1) {
        await handleSubmit(processForm)();
      } else {
        setPreviousStep(currentStep);
        setCurrentStep(step => step + 1);
      }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep(step => step - 1);
    }
  };

  return (
    <div>
      <h1 className='text-2xl text-center font-semibold leading-8 text-gray-900 m-4 mt-8'>
        Register Facility
      </h1>
      <section className='flex flex-col justify-between p-16'>
        {/* Steps */}
        <nav aria-label='Progress'>
          <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
            {steps.map((step, index) => (
              <li key={step.name} className='md:flex-1'>
                {currentStep > index ? (
                  <div className='group flex w-full flex-col border-l-4 border-red-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                    <span className='text-sm font-medium text-red-600 transition-colors'>
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
              <h2 className='text-xl font-bold leading-7 text-gray-900'>
                Registration Details
              </h2>
              <p className='mt-3 font-semibold'>Patient ot be Registered ni STEMI ACT*:</p>
            
    <div className='mt-10 flex flex-col gap-x-6 gap-y-5 '>
                


    <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Patient Initials*
            </label>
            <div className='flex gap-x-2'>
                <input
                    type='text'
                    id='initial1'
                    {...register('patientInitials.initial1')}
                    maxLength={1}
                    className='block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                <input
                    type='text'
                    id='initial2'
                    {...register('patientInitials.initial2')}
                    maxLength={1}
                    className='block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                <input
                    type='text'
                    id='initial3'
                    {...register('patientInitials.initial3')}
                    maxLength={1}
                    className='block w-12 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.patientInitials && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.patientInitials.initial1?.message || 
                     errors.patientInitials.initial2?.message || 
                     errors.patientInitials.initial3?.message}
                </p>
            )}
        </div>

<div className='sm:col-span-3'>
  <label
    htmlFor='mobile'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Mobile
  </label>
  <div className='mt-2'>
    <input
      type='tel'
      id='mobile'
      {...register('mobile')}
      className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    />
    {errors.mobile?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.mobile.message}
      </p>
    )}
  </div>
</div>
<div className='sm:col-span-3'>
  <label
    htmlFor='address'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Address
  </label>
  <div className='mt-2'>
    <textarea
      id='address'
      {...register('address')}
      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    />
    {errors.address?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.address.message}
      </p>
    )}
  </div>
</div>
<div className='sm:col-span-3'>
  <label
    htmlFor='gender'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Gender
  </label>
  <div className='mt-1'>
    <select
      id='gender'
      {...register('gender')}
      className='block rounded-md border-0 p-1.5 
       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    >
      <option value=''>Select</option>
      <option value='male'>Male</option>
      <option value='female'>Female</option>
      <option value='other'>Other</option>
    </select>
    {errors.gender?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.gender.message}
      </p>
    )}
  </div>
</div>
<div className='sm:col-span-3'>
  <label
    htmlFor='dobKnownAge'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Date of Birth / Known Age
  </label>
  <div className='mt-1'>
    <input
      type='text'
      id='dobKnownAge'
      {...register('dobKnownAge')}
      className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    />
    {errors.dobKnownAge?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.dobKnownAge.message}
      </p>
    )}
  </div>
</div>
<div className='sm:col-span-3'>
  <label
    htmlFor='registrationDate'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Registration Date
  </label>
  <div className='mt-1'>
    <input
      type='date'
      id='registrationDate'
      {...register('registrationDate')}
      className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    />
    {errors.registrationDate?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.registrationDate.message}
      </p>
    )}
  </div>
</div>

              </div>
              <p className='mt-5 text-gray-600'>
              Note: In case patient is not to be registered in STEMI ACT Registry, you wil be redirected to Logbook Page. It is mandatory to fil the unregistered cases in the logbook.</p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h2 className='text-base font-semibold leading-7 text-gray-900'>
                Demographics Details
              </h2>
              <p className='mt-1 text-3xl font-bold leading-6 text-gray-600'>
               B. Demographics Details
              </p>

              <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
              <div className='sm:col-span-3'>
  <label
    htmlFor='residence'
    className='block text-sm font-medium leading-6 text-gray-900'
  >
    Residence*
  </label>
  <select
    id='residence'
    {...register('residence')}
    className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
  >
    <option value=''>Select residence</option>
    <option value='urban'>Urban</option>
    <option value='semi-urban'>Semi Urban</option>
    <option value='rural'>Rural</option>
  </select>
  {errors.residence?.message && (
    <p className='mt-2 text-sm text-red-400'>
      {errors.residence.message}
    </p>
  )}
</div>

            <div className=''>
              <label
                htmlFor='postalCode'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                postalCode*
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='postalCode'
                  {...register('postalCode')}
                  className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.postalCode?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className=''>
              <label
                htmlFor='monthlyIncome'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
            monthlyIncome (average for Past 1Year*) :
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='monthlyIncome'
                  {...register('monthlyIncome')}
                  className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.monthlyIncome?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.monthlyIncome.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <h2 className='mt-8 text-xl'>
          Does Patient meet the following criteria?
          </h2>
          <p className='mt-4 text-3xl  font-bold leading-6 '>
          C. INCLUSION/EXCLUSION CRITERIA for STEMI ACT Registry
              </p>
          <div className='mt-10  gap-x-6 gap-y-8 '>
          <div>
  <label className='block text-sm font-medium leading-6 text-gray-900'>
    INCLUSION CRITERIA (Tick One)
  </label>
  <div className='flex flex-col gap-y-2'>
    <div className='flex items-center'>
      <input
        type='radio'
        id='stemiElevation'
        name='inclusionCriteria'
        value='stemiElevation'
        {...register('inclusionCriteria')}
        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
      />
      <label htmlFor='stemiElevation' className='ml-2 block text-sm text-gray-900'>
        STEMI definite ST elevation changes
      </label>
    </div>
    <div className='flex items-center'>
      <input
        type='radio'
        id='lbbbOnset'
        name='inclusionCriteria'
        value='lbbbOnset'
        {...register('inclusionCriteria')}
        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
      />
      <label htmlFor='lbbbOnset' className='ml-2 block text-sm text-gray-900'>
        New/presumably new onset LBBB with typical symptoms
      </label>
    </div>
    <div className='flex items-center'>
      <input
        type='radio'
        id='stemiEquivalents'
        name='inclusionCriteria'
        value='stemiEquivalents'
        {...register('inclusionCriteria')}
        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
      />
      <label htmlFor='stemiEquivalents' className='ml-2 block text-sm text-gray-900'>
        STEMI equivalents*
      </label>
    </div>
  </div>
  {errors.inclusionCriteria?.message && (
    <p className='mt-2 text-sm text-red-400'>
      {errors.inclusionCriteria.message}
    </p>
  )}
</div>

          </div>
        <div className='my-2 bg-gray-200'>
        <h2>
EXCLUSION CRITERIA
          </h2>
          <h4>
          1 Patients age &lt; 81 years</h4>
<h4> 2. Mechanical complications prior ot thrombolysis
          </h4>
        </div>
          <p>*STEMI equivalents include Isolated true posterior M,I Hyperacute T-waves, De Winter sign and MI ina patient with implanted pacemaker (PPI)</p>
        </motion.div>
      )}

      {currentStep === 2 && (
        <motion.div
          initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Medical Clinical Details
          </h2>
          <p className='mt-1 text-3xl text-center font-bold leading-6 text-gray-600'>
          D. Medical History & Risk Factors
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
            <div className='flex gap-x-4'>
            <label
                htmlFor='stableAngina'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Stable Angina*
            </label>
            <input
                type='checkbox'
                id='stableAngina'
                {...register('stableAngina')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='priorMI'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Prior MI*
            </label>
            <input
                type='checkbox'
                id='priorMI'
                {...register('priorMI')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='ptca'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                PTCA
            </label>
            <input
                type='checkbox'
                id='ptca'
                {...register('ptca')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='cabg'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                CABG
            </label>
            <input
                type='checkbox'
                id='cabg'
                {...register('cabg')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='otherCardiovascularEvents'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Other Cardiovascular Events*
            </label>
            <input
                type='text'
                id='otherCardiovascularEvents'
                {...register('otherCardiovascularEvents')}
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
            />
            {errors.otherCardiovascularEvents?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.otherCardiovascularEvents.message}
                </p>
            )}
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='prematureFamilyHistory'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Premature Family History of CHD / Stroke*
            </label>
            <input
                type='checkbox'
                id='prematureFamilyHistory'
                {...register('prematureFamilyHistory')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='dyslipidemiaOnStatin'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Dyslipidemia / On Statin Therapy*
            </label>
            <input
                type='checkbox'
                id='dyslipidemiaOnStatin'
                {...register('dyslipidemiaOnStatin')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='hypertension'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Hypertension
            </label>
            <input
                type='checkbox'
                id='hypertension'
                {...register('hypertension')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='diabetes'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Diabetes
            </label>
            <input
                type='checkbox'
                id='diabetes'
                {...register('diabetes')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='smokingStatus'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Smoking Status*
            </label>
            <input
                type='checkbox'
                id='smokingStatus'
                {...register('smokingStatus')}
            />
        </div>

        <div className='flex gap-x-4'>
            <label
                htmlFor='smokelessTobaccoStatus'
                className='block text-sm font-medium leading-6 text-gray-900'
            >
                Smokeless Tobacco Status [Paan with tobacco, Gutka Etc.]*
            </label>
            <input
                type='checkbox'
                id='smokelessTobaccoStatus'
                {...register('smokelessTobaccoStatus')}
            />
        </div>
</div>
<p className='mt-8 text-3xl text-center font-bold leading-6 text-gray-600'>
          E. Presentation
          </p>
            <div className='mt-8 flex flex-col  gap-x-6 gap-y-8 '>
    
            <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='symptomOnset'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Symptom Onset*
                </label>
                <input
                    type='text'
                    id='symptomOnset'
                    {...register('symptomOnset')}
                    className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.symptomOnset?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.symptomOnset.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='firstContact'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    First Contact With Medical Professional*
                </label>
                <input
                    type='text'
                    id='firstContact'
                    {...register('firstContact')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.firstContact?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.firstContact.message}
                </p>
            )}
        </div>

        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900 mb-2'>
                Mode of Transport to First Medical Contact/Spoke Facility*
            </label>
            <div className='flex gap-x-4'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportAmbulance'
                        name='transportToFirstContact'
                        value='ambulance'
                        {...register('transportToFirstContact')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportAmbulance' className='ml-2 block text-sm text-gray-900'>
                        Ambulance
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportPrivate'
                        name='transportToFirstContact'
                        value='private'
                        {...register('transportToFirstContact')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportPrivate' className='ml-2 block text-sm text-gray-900'>
                        Private Transport (e.g. Car etc.)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportPublic'
                        name='transportToFirstContact'
                        value='public'
                        {...register('transportToFirstContact')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportPublic' className='ml-2 block text-sm text-gray-900'>
                        Public Transport (e.g. Bus etc.)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportOther'
                        name='transportToFirstContact'
                        value='other'
                        {...register('transportToFirstContact')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportOther' className='ml-2 block text-sm text-gray-900'>
                        Other (specify)
                    </label>
                </div>
            </div>
            {errors.transportToFirstContact?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.transportToFirstContact.message}
                </p>
            )}
        </div>

        {watch('transportToFirstContact') === 'other' && (
            <div>
                <label htmlFor='transportOtherSpecify' className='block text-sm font-medium leading-6 text-gray-900'>
                    Specify Other Mode of Transport
                </label>
                <input
                    type='text'
                    id='transportOtherSpecify'
                    {...register('transportOtherSpecify')}
                    className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.transportOtherSpecify?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                        {errors.transportOtherSpecify.message}
                    </p>
                )}
            </div>
        )}
    

    <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Mode of Transport to Hub Hospital*
            </label>
            <div className='flex  gap-x-2'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportAmbulance'
                        name='transportToHubHospital'
                        value='ambulance'
                        {...register('transportToHubHospital')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportAmbulance' className='ml-2 block text-sm text-gray-900'>
                        Ambulance
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportPrivate'
                        name='transportToHubHospital'
                        value='private'
                        {...register('transportToHubHospital')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportPrivate' className='ml-2 block text-sm text-gray-900'>
                        Private Transport (e.g. Car etc.)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportPublic'
                        name='transportToHubHospital'
                        value='public'
                        {...register('transportToHubHospital')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportPublic' className='ml-2 block text-sm text-gray-900'>
                        Public Transport (e.g. Bus etc.)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='transportOther'
                        name='transportToHubHospital'
                        value='other'
                        {...register('transportToHubHospital')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='transportOther' className='ml-2 block text-sm text-gray-900'>
                        Other (specify)
                    </label>
                </div>
            </div>
            {errors.transportToHubHospital?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.transportToHubHospital.message}
                </p>
            )}
        </div>

        {watch('transportToHubHospital') === 'other' && (
            <div>
                <label htmlFor='transportOtherSpecify' className='block text-sm font-medium leading-6 text-gray-900'>
                    Specify Other Mode of Transport
                </label>
                <input
                    type='text'
                    id='transportOtherSpecify'
                    {...register('transportOtherSpecify')}
                    className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.transportOtherSpecify?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                        {errors.transportOtherSpecify.message}
                    </p>
                )}
            </div>
        )}

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='presentationToER'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Presentation to Emergency Room/Casualty*
                </label>
                <input
                    type='text'
                    id='presentationToER'
                    {...register('presentationToER')}
                    className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.presentationToER?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.presentationToER.message}
                </p>
            )}
        </div>
</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
          F. Physical Examination at Time of Presentation
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
            <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='heartRate'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Heart Rate (per minute)*
                </label>
                <input
                    type='text'
                    id='heartRate'
                    {...register('heartRate')}
                    className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.heartRate?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.heartRate.message}
                </p>
            )}
        </div>
        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Blood Pressure*
            </label>
            <div className='flex gap-x-4'>
                <div>
                    <label htmlFor='systolic' className='block text-sm font-medium text-gray-700'>
                        Systolic
                    </label>
                    <input
                        type='text'
                        id='systolic'
                        {...register('bloodPressure.systolic')}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.bloodPressure?.systolic?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                            {errors.bloodPressure.systolic.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor='diastolic' className='block text-sm font-medium text-gray-700'>
                        Diastolic
                    </label>
                    <input
                        type='text'
                        id='diastolic'
                        {...register('bloodPressure.diastolic')}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    />
                    {errors.bloodPressure?.diastolic?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                            {errors.bloodPressure.diastolic.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Kilip Class*
            </label>
            <div className='flex  gap-x-2'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='k1'
                        name='kilipClass'
                        value='1 (No CHF)'
                        {...register('kilipClass')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='k1' className='ml-2 block text-sm text-gray-900'>
                        1 (No CHF)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='k2'
                        name='kilipClass'
                        value='II (Rales)'
                        {...register('kilipClass')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='k2' className='ml-2 block text-sm text-gray-900'>
                        II (Rales)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='k3'
                        name='kilipClass'
                        value='III (Pulmonary Edema)'
                        {...register('kilipClass')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='k3' className='ml-2 block text-sm text-gray-900'>
                        III (Pulmonary Edema)
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='k4'
                        name='kilipClass'
                        value='IV (Cardiogenic Shock)'
                        {...register('kilipClass')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='k4' className='ml-2 block text-sm text-gray-900'>
                        IV (Cardiogenic Shock)
                    </label>
                </div>
            </div>
            {errors.kilipClass?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.kilipClass.message}
                </p>
            )}
        </div>

</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
          G. ECG Findings
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
            <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='indexECG'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    1.a Index ECG in Hub Hospital*
                </label>
                <input
                    type='text'
                    id='indexECG'
                    {...register('indexECG')}
                    className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.indexECG?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.indexECG.message}
                </p>
            )}
        </div>

        <div>
  <label className='block text-sm font-medium leading-6 text-gray-900'>
    ECG Findings*
  </label>
  <div className='flex flex-col gap-y-2'>
    <select
      {...register('ecgFindings')}
      className='block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    >
      <option value=''>Select ECG Finding</option>
      <option value='STEMI'>STEMI</option>
      <option value='NSTEMI / UA'>NSTEMI/UA</option>
    </select>
    {errors.ecgFindings?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.ecgFindings.message}
      </p>
    )}
  </div>
</div>
{ watch('ecgFindings') === 'STEMI' && (
                <div className='mt-4'>
                    <label className='block text-sm font-medium leading-6 text-gray-900'>
                        STEMI Findings
                    </label>
                    <div className='flex flex-col gap-y-2'>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='stElevation'
                                {...register('stemiFindings.TSElevation')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='stElevation' className='ml-2 block text-sm text-gray-900'>
                                TS Elevation
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='anteriorLeads'
                                {...register('stemiFindings.AnteriorLeads')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='anteriorLeads' className='ml-2 block text-sm text-gray-900'>
                                Anterior Leads
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='lateralLeads'
                                {...register('stemiFindings.LateralLeads')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='lateralLeads' className='ml-2 block text-sm text-gray-900'>
                                Lateral Leads
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='inferiorLeads'
                                {...register('stemiFindings.InferiorLeads')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='inferiorLeads' className='ml-2 block text-sm text-gray-900'>
                                Inferior Leads
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='septalLeads'
                                {...register('stemiFindings.SeptalLeads')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='septalLeads' className='ml-2 block text-sm text-gray-900'>
                                Septal Leads
                            </label>
                        </div>
                    </div>
                </div>
            )}

            { watch('ecgFindings') === 'NSTEMI / UA' && (
                <div className='mt-4'>
                    <label className='block text-sm font-medium leading-6 text-gray-900'>
                        NSTEMI / UA Findings
                    </label>
                    <div className='flex flex-col gap-y-2'>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='stDepression'
                                {...register('nstemiFindings.STDepression')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='stDepression' className='ml-2 block text-sm text-gray-900'>
                                ST Depression
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='tWaves'
                                {...register('nstemiFindings.TWaves')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='tWaves' className='ml-2 block text-sm text-gray-900'>
                                T Waves
                            </label>
                        </div>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='none'
                                {...register('nstemiFindings.None')}
                                className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                            />
                            <label htmlFor='none' className='ml-2 block text-sm text-gray-900'>
                                None
                            </label>
                        </div>
                    </div>
                </div>
            )}

        {/* LBBB Question */}
        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Does ECG Show Left Bundle Branch Block?*
            </label>
            <div className='flex flex-col gap-y-2'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='lbbbYes'
                        name='lbbb'
                        value='yes'
                        {...register('lbbb')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='lbbbYes' className='ml-2 block text-sm text-gray-900'>
                        Yes
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='lbbbNo'
                        name='lbbb'
                        value='no'
                        {...register('lbbb')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='lbbbNo' className='ml-2 block text-sm text-gray-900'>
                        No
                    </label>
                </div>
            </div>
            {errors.lbbb?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.lbbb.message}
                </p>
            )}
        </div>
               {/* Conditional options for LBBB Type */}
        {watch('lbbb') === 'yes' && (
            <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                    Type of LBBB*
                </label>
                <div className='flex flex-col gap-y-2'>
                    <select
                        {...register('lbbbType')}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                    >
                        <option value=''>Select LBBB Type</option>
                        <option value='new'>New</option>
                        <option value='old'>Old</option>
                        <option value='unknown'>Unknown</option>
                    </select>
                    {errors.lbbbType?.message && (
                        <p className='mt-2 text-sm text-red-400'>
                            {errors.lbbbType.message}
                        </p>
                    )}
                </div>
            </div>
        )}
        {/* RBBB Question */}
        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Does ECG Show Right Bundle Branch Block?*
            </label>
            <div className='flex flex-col gap-y-2'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='rbbbYes'
                        name='rbbb'
                        value='yes'
                        {...register('rbbb')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='rbbbYes' className='ml-2 block text-sm text-gray-900'>
                        Yes
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='rbbbNo'
                        name='rbbb'
                        value='no'
                        {...register('rbbb')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='rbbbNo' className='ml-2 block text-sm text-gray-900'>
                        No
                    </label>
                </div>
            </div>
            {errors.rbbb?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.rbbb.message}
                </p>
            )}
        </div>

        {/* Conditional options for RBBB Type */}
        {watch('rbbb') === 'yes' && (
            <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                    Type of RBBB*
                </label>
                <select
                    {...register('rbbbType')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Select RBBB Type</option>
                    <option value='new'>New</option>
                    <option value='old'>Old</option>
                    <option value='unknown'>Unknown</option>
                </select>
                {errors.rbbbType?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                        {errors.rbbbType.message}
                    </p>
                )}
            </div>
        )}
    <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Other Abnormalities?*
            </label>
            <div className='flex flex-col gap-y-2'>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='otherAbnormalitiesYes'
                        name='otherAbnormalities'
                        value='yes'
                        {...register('otherAbnormalities')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='otherAbnormalitiesYes' className='ml-2 block text-sm text-gray-900'>
                        Yes
                    </label>
                </div>
                <div className='flex items-center'>
                    <input
                        type='radio'
                        id='otherAbnormalitiesNo'
                        name='otherAbnormalities'
                        value='no'
                        {...register('otherAbnormalities')}
                        className='h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-600'
                    />
                    <label htmlFor='otherAbnormalitiesNo' className='ml-2 block text-sm text-gray-900'>
                        No
                    </label>
                </div>
            </div>
            {errors.otherAbnormalities?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.otherAbnormalities.message}
                </p>
            )}
        </div>

        {/* Conditional options for Other Abnormalities */}
        {watch('otherAbnormalities')=='yes' && (
            <div>
                <h3 className='mt-4 text-sm font-medium'>Specify Other Abnormalities:</h3>
                <div className='flex flex-col gap-y-2'>
                    <div className='flex items-center'>
                        <input type='checkbox' id='atrialFibFlutter' {...register('otherAbnormalityDetails.atrialFibFlutter')} />
                        <label htmlFor='atrialFibFlutter' className='ml-2 text-sm text-gray-900'>Atrial Fib/Flutter</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='vtach' {...register('otherAbnormalityDetails.vtach')} />
                        <label htmlFor='vtach' className='ml-2 text-sm text-gray-900'>Vtach</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='posteriorInfarction' {...register('otherAbnormalityDetails.posteriorInfarction')} />
                        <label htmlFor='posteriorInfarction' className='ml-2 text-sm text-gray-900'>Posterior Infarction</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='rbbb' {...register('otherAbnormalityDetails.rbbb')} />
                        <label htmlFor='rbbb' className='ml-2 text-sm text-gray-900'>RBBB</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='nonspecificSTChange' {...register('otherAbnormalityDetails.nonspecificSTChange')} />
                        <label htmlFor='nonspecificSTChange' className='ml-2 text-sm text-gray-900'>Nonspecific ST/T Change</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='pacedRhythm' {...register('otherAbnormalityDetails.pacedRhythm')} />
                        <label htmlFor='pacedRhythm' className='ml-2 text-sm text-gray-900'>Paced Rhythm</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='leftVentricularHypertrophy' {...register('otherAbnormalityDetails.leftVentricularHypertrophy')} />
                        <label htmlFor='leftVentricularHypertrophy' className='ml-2 text-sm text-gray-900'>Left Ventricular Hypertrophy</label>
                    </div>
                    <div className='flex items-center'>
                        <input type='checkbox' id='avBlock' {...register('otherAbnormalityDetails.avBlock')} />
                        <label htmlFor='avBlock' className='ml-2 text-sm text-gray-900'>AV Block</label>
                    </div>
                </div>
            </div>
        )}

</div>
        </motion.div>
      )}

      {currentStep === 3 && (
        <motion.div
          initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
          Hospital Events Details
          </h2>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
I. Laboratory
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
            <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Initial Creatinine*
            </label>
            <input
                type='text'
                id='initialCreatinine'
                {...register('initialCreatinine')}
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
            />
            {errors.initialCreatinine?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.initialCreatinine.message}
                </p>
            )}
        </div>

        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Random Glucose*
            </label>
            <input
                type='text'
                id='randomGlucose'
                {...register('randomGlucose')}
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
            />
            {errors.randomGlucose?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.randomGlucose.message}
                </p>
            )}
        </div>

        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Fasting Glucose*
            </label>
            <input
                type='text'
                id='fastingGlucose'
                {...register('fastingGlucose')}
                className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
            />
            {errors.fastingGlucose?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.fastingGlucose.message}
                </p>
            )}
        </div>

        <h2>Cardiac Marker - Maximum Values in 1st 24 hrs</h2>
        <table className='mt-4 w-full border-collapse'>
            <thead>
                <tr>
                    <th className='border p-2'>Not Done / Done</th>
                    <th className='border p-2'>Qualitative</th>
                    <th className='border p-2'>Quantitative</th>
                    <th className='border p-2'>Value</th>
                    <th className='border p-2'>ULN</th>
                </tr>
            </thead>
            <tbody>
                {/* CPK Row */}
                <tr>
                    <td className='border p-2'>
                        <input type="checkbox" id="cpkDone" {...register('cardiacMarker.cpk.done')} />
                        <label htmlFor="cpkDone">Done</label>
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="cpkQualitative" {...register('cardiacMarker.cpk.qualitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="cpkQuantitative" {...register('cardiacMarker.cpk.quantitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="cpkValue" {...register('cardiacMarker.cpk.value')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="cpkULN" {...register('cardiacMarker.cpk.uln')} />
                    </td>
                </tr>
                {/* CK-MB Row */}
                <tr>
                    <td className='border p-2'>
                        <input type="checkbox" id="ckMbDone" {...register('cardiacMarker.ckMb.done')} />
                        <label htmlFor="ckMbDone">Done</label>
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="ckMbQualitative" {...register('cardiacMarker.ckMb.qualitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="ckMbQuantitative" {...register('cardiacMarker.ckMb.quantitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="ckMbValue" {...register('cardiacMarker.ckMb.value')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="ckMbULN" {...register('cardiacMarker.ckMb.uln')} />
                    </td>
                </tr>
                {/* Troponin Row */}
                <tr>
                    <td className='border p-2'>
                        <input type="checkbox" id="troponinDone" {...register('cardiacMarker.troponin.done')} />
                        <label htmlFor="troponinDone">Done</label>
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="troponinQualitative" {...register('cardiacMarker.troponin.qualitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="troponinQuantitative" {...register('cardiacMarker.troponin.quantitative')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="troponinValue" {...register('cardiacMarker.troponin.value')} />
                    </td>
                    <td className='border p-2'>
                        <input type="text" id="troponinULN" {...register('cardiacMarker.troponin.uln')} />
                    </td>
                </tr>
            </tbody>
        </table>
    
    

</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
J. Hospital Treatment &Counselling (Fill in all that apply for each medication)
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
            <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Pre-Hub Management*
            </label>
            <div className='flex gap-x-4'>
              <div>
                <div>
                    <input type="checkbox" id="preHubManagement1" {...register('preHubManagement')} value="Choice 1" />
                    <label htmlFor="preHubManagement1">Choice 1</label>
                </div>
                <div>
                    <input type="checkbox" id="preHubManagement2" {...register('preHubManagement')} value="Choice 2" />
                    <label htmlFor="preHubManagement2">Choice 2</label>
                </div>
                <div>
                    <input type="checkbox" id="preHubManagement3" {...register('preHubManagement')} value="Choice 3" />
                    <label htmlFor="preHubManagement3">Choice 3</label>
                </div>
              </div>  
<div>
                <div>
                    <input type="checkbox" id="preHubManagement3" {...register('preHubManagement')} value="Choice 3" />
                    <label htmlFor="preHubManagement3">Choice 3</label>
                </div>
                <div>
                    <input type="checkbox" id="preHubManagement3" {...register('preHubManagement')} value="Choice 3" />
                    <label htmlFor="preHubManagement3">Choice 3</label>
                </div>
                <div>
                    <input type="checkbox" id="preHubManagement3" {...register('preHubManagement')} value="Choice 3" />
                    <label htmlFor="preHubManagement3">Choice 3</label>
                </div>
                </div>
            </div>
        </div>

        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                During Admission*
            </label>
            <div>
                <div>
                    <input type="checkbox" id="duringAdmission1" {...register('duringAdmission')} value="Choice 1" />
                    <label htmlFor="duringAdmission1">Choice 1</label>
                </div>
                <div>
                    <input type="checkbox" id="duringAdmission2" {...register('duringAdmission')} value="Choice 2" />
                    <label htmlFor="duringAdmission2">Choice 2</label>
                </div>
                <div>
                    <input type="checkbox" id="duringAdmission3" {...register('duringAdmission')} value="Choice 3" />
                    <label htmlFor="duringAdmission3">Choice 3</label>
                </div>
            </div>
        </div>

        <div>
            <label className='block text-sm font-medium leading-6 text-gray-900'>
                Prescribed at Discharge*
            </label>
            <div>
                <div>
                    <input type="checkbox" id="prescribedAtDischarge1" {...register('prescribedAtDischarge')} value="Choice 1" />
                    <label htmlFor="prescribedAtDischarge1">Choice 1</label>
                </div>
                <div>
                    <input type="checkbox" id="prescribedAtDischarge2" {...register('prescribedAtDischarge')} value="Choice 2" />
                    <label htmlFor="prescribedAtDischarge2">Choice 2</label>
                </div>
                <div>
                    <input type="checkbox" id="prescribedAtDischarge3" {...register('prescribedAtDischarge')} value="Choice 3" />
                    <label htmlFor="prescribedAtDischarge3">Choice 3</label>
                </div>
            </div>
        </div>

</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
K. Revascularization Therapy
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
 
            <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='thrombolysis'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Thrombolysis*
                </label>
                <select
                    id='thrombolysis'
                    {...register('thrombolysis')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Select</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
            </div>
            {errors.thrombolysis?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.thrombolysis.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='echo'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    ECHO*
                </label>
                <select
                    id='echo'
                    {...register('echo')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Select</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
            </div>
            {errors.echo?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.echo.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='angiography'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Angiography*
                </label>
                <select
                    id='angiography'
                    {...register('angiography')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Select</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
            </div>
            {errors.angiography?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.angiography.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='ptca2'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    PTCA*
                </label>
                <select
                    id='ptca2'
                    {...register('ptca2')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                >
                    <option value=''>Select</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
            </div>
            {errors.ptca?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.ptca.message}
                </p>
            )}
        </div>

</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
L. EventsandOutcomeinTheHospital
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
    <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='reinfarction'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Reinfarction*
                </label>
                <input
                    type='text'
                    id='reinfarction'
                    {...register('reinfarction')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='stroke'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Stroke*
                </label>
                <input
                    type='text'
                    id='stroke'
                    {...register('stroke')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='vlFailure'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    VL Failure*
                </label>
                <input
                    type='text'
                    id='vlFailure'
                    {...register('vlFailure')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='recurrentIschemia'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Recurrent Ischemia/Angina*
                </label>
                <input
                    type='text'
                    id='recurrentIschemia'
                    {...register('recurrentIschemia')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='cardiacArrest'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Cardiac Arrest*
                </label>
                <input
                    type='text'
                    id='cardiacArrest'
                    {...register('cardiacArrest')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='cardiogenicShock'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Cardiogenic Shock*
                </label>
                <input
                    type='text'
                    id='cardiogenicShock'
                    {...register('cardiogenicShock')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='mechanicalComplications'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Mechanical complications - MR/VSD*
                </label>
                <input
                    type='text'
                    id='mechanicalComplications'
                    {...register('mechanicalComplications')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='bleedingRequiringTransfusion'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Bleeding Requiring any Transfusion*
                </label>
                <input
                    type='text'
                    id='bleedingRequiringTransfusion'
                    {...register('bleedingRequiringTransfusion')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='death'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Death*
                </label>
                <input
                    type='text'
                    id='death'
                    {...register('death')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-m ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='discharge'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Discharge*
                </label>
                <input
                    type='text'
                    id='discharge'
                    {...register('discharge')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.discharge?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.discharge.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='height'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Height (cm)*
                </label>
                <input
                    type='text'
                    id='height'
                    {...register('height')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.height?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.height.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='weight'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    Weight (kg)*
                </label>
                <input
                    type='text'
                    id='weight'
                    {...register('weight')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
            </div>
            {errors.weight?.message && (
                <p className='mt-2 text-sm text-red-400'>
                    {errors.weight.message}
                </p>
            )}
        </div>

        <div className=''>
            <div className='flex gap-x-4'>
                <label
                    htmlFor='bmi'
                    className='block text-sm font-medium leading-6 text-gray-900'
                >
                    BMI (kg/m2)*
                </label>
                <input
                    type='text'
                    id='bmi'
                    {...register('bmi')}
                    className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 '
                />
            </div>
            </div>

</div>
<p className='mt-5 text-3xl text-center font-bold leading-6 text-gray-600'>
          M. Counselling
          </p>
            <div className='mt-10 flex flex-col gap-x-6 gap-y-8 '>
             
            <div className=''>
    <textarea
      id='counselling'
      {...register('counselling')}
      className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
    />
    {errors.address?.message && (
      <p className='mt-2 text-sm text-red-400'>
        {errors.address.message}
      </p>
    )}
  </div>


</div>


        </motion.div>
      )}

      {currentStep === 4 && (
        <motion.div
          initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <h2 className='text-base font-semibold leading-7 text-gray-900'>
    complete page , abhi Review krlo details chaho toh
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Review your details and submit the form.
          </p>
          <div className=''>
              <label
                htmlFor='incidentid'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Incident ID*
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  id='incidentid'
                  {...register('incidentid')}
                  className='block rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                />
                {errors.incidentid?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.incidentid.message}
                  </p>
                )}
              </div>
            </div>
          <div className='my-8'>
          <label className="block text-sm font-medium leading-6 text-gray-900">In-Charge IDs*</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-x-2 mb-4">
              <input
                type="text"
                {...register(`inchargeIds.${index}`)}
                className="block  rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
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
              {errors.inchargeIds && errors.inchargeIds[index] && (
                <p className="text-sm text-red-400">
                  {errors.inchargeIds[index]?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append('')}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 text-sm font-medium"
          >
            Add ID
          </button>
          {errors.inchargeIds?.message && (
            <p className="mt-2 text-sm text-red-400">
              {errors.inchargeIds?.message}
            </p>
          )}
        </div>
        </motion.div>
      )}

      <div className='flex gap-x-4 mt-8'>
        {currentStep > 0 && (
          <button
            type='button'
            onClick={prev}
            className='inline-block rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
          >
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button
            type='button'
            onClick={next}
            className='inline-block rounded-md border border-transparent bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
          >
            Next
          </button>
        )}
        {currentStep === steps.length - 1 && (
          <button
            type='submit'
            className='inline-block rounded-md border border-transparent bg-red-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 transition-all hover:ring-2 hover:ring-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
          >
            Submit
          </button>
        )}
      </div>
    </form>
  </section>
</div>)}
