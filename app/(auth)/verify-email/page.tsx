import React, { Suspense } from 'react'
import VerifyEmailForm from './_components/VerifyEmailForm'

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
    </Suspense>
  )
}

export default page