import React from 'react'

const Quote = () => {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 h-screen flex justify-center items-center flex-col">
        <div className="flex justify-center ">
            <div className="max-w-lg">
                <div className="text-3xl font-bold">
                    "Advanced Medical Response Incident Tracker"
                </div>
                <div className="max-w-md text-xl font-semibold text-left mt-4">
                    DMC 
                </div>
                {/* <div className="max-w-md text-sm font-light text-slate-400">
                    CEO | Acme corp
                </div> */}
            </div>
        </div>
        
    </div>
  )
}

export default Quote
