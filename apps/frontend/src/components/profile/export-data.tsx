"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import useToast from '@/hooks/utils/useToast'

const ExportData = () => {

    const {showToast} = useToast();

    const handleExportData = () => {
        showToast({
          type: "info",
          message: "Exporting data... This may take a moment."
        })
      
        setTimeout(() => {
          showToast({
            type: "success",
            message: "Data exported successfully"
          })
        }, 1500);
      };
    

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export or sync your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleExportData}>
          Export Data
        </Button>
      </CardContent>
    </Card>
  </div>
  )
}

export default ExportData