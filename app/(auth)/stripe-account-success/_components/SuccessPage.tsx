import React from 'react'
import Link from 'next/link'

function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF1F2]">
      <div className="w-full max-w-md px-8 py-12 flex flex-col items-center text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-[#FCD2D7] flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-[#F66F7D]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-semibold text-gray-800 mb-3">
          Account Connected!
        </h1>
        <p className="text-[#7D7D7D] text-base mb-8">
          Your Stripe account has been successfully connected. You&aps;re all set to start receiving payments.
        </p>

        {/* Button */}
        <Link
          href="/signin"
          className="w-full bg-[#F66F7D] hover:bg-[#d45570] text-white rounded-md h-[50px] text-base font-medium transition-colors flex items-center justify-center"
        >
          Go to Sign In
        </Link>

      </div>
    </div>
  )
}

export default SuccessPage