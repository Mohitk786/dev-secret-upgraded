"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/queries/authQueries'
import useSocket from '@/hooks/utils/useSocket'

const layout = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname()
    const socket = useSocket()
    const router = useRouter()
    const {user} = useAuth();

    const isVaultPage = pathname.split("/").pop() === "vaults" || pathname.split("/").pop() === "shared-with-me"

    useEffect(() => {
        socket.emit("authenticate", user?.id);
    }, [user, socket])
    

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-muted-foreground">
                {!isVaultPage && (
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" /> Back to Vaults
                    </Button>
                )}
            </div>
            {children}
        </div>
    )
}

export default layout