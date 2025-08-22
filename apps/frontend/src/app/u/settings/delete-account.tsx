"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const DeleteAccount = () => {

    const handleDeleteAccount = () => {
        console.log("Delete Account");
    }

  return (
    <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
  )
}

export default DeleteAccount