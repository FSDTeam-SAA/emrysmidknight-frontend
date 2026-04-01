import React, { Suspense } from 'react'
import ChangePasswordForm from './_components/ChangePasswordForm'

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordForm />
    </Suspense>
  )
}

export default page