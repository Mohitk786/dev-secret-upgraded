import React, { Suspense } from 'react'
import Login from './Login'

const page = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Login />
    </Suspense>
  )
}

export default page