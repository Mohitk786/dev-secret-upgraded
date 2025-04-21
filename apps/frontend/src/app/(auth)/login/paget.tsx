import React, { Suspense } from 'react'
import Login from './Login'

const paget = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Login />
    </Suspense>
  )
}

export default paget