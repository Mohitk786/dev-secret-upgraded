"use client"

import React, { useEffect } from 'react'
import useSocket from '@/hooks/utils/useSocket' 
import { useParams } from 'next/navigation'

const Layout = ({children}: {children: React.ReactNode}) => {
    const socket = useSocket()
    const {vaultId} = useParams()


    useEffect(() => {
      socket.emit("join-vault", vaultId as string)
    }, [vaultId, socket])



  return <>{children}</>
  
} 

export default Layout