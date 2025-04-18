"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const layout = ({children}: {children: React.ReactNode}) => {
    const router = useRouter()
    const pathname = usePathname()
    const isVaultPage = pathname.split("/").pop() === "vaults" || pathname.split("/").pop() === "shared-with-me"

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