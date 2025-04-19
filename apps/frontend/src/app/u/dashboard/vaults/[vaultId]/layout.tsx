"use client"

import React, { useEffect } from 'react'
import useSocket from '@/hooks/utils/useSocket' 
import { useParams } from 'next/navigation'
import { Collaborator } from '@/types/types'

const layout = ({children}: {children: React.ReactNode}) => {
    const socket = useSocket()
    const {vaultId} = useParams()


    useEffect(() => {
      socket.emit("join-vault", vaultId as string)
    }, [vaultId])



  return <>{children}</>
  
} 

export default layout