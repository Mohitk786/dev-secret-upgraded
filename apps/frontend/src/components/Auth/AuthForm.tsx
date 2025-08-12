"use client"

import type React from "react" 
import AppBranding from "../ui/AppName" 
import { Card } from "../ui/card"

interface AuthFormProps {
  title: string
  description?: string
  children: React.ReactNode
}

const AuthForm: React.FC<AuthFormProps> = ({ title, description, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-devvault-navy px-4 py-12">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-xl border border-devvault-electric-blue/30 bg-devvault-graphite">
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 transition-transform hover:scale-105">
            <AppBranding />
          </div>
          <h2 className="text-3xl font-extrabold text-devvault-white text-center">{title}</h2>
          {description && <p className="mt-2 text-sm text-devvault-white/70 text-center">{description}</p>}
        </div>

        <div className="space-y-5">{children}</div>
      </Card>
    </div>
  )
}

export default AuthForm
