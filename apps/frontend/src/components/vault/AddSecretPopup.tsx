"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Upload, Eye, EyeOff } from "lucide-react"

import type { AddSecretFormValues } from "@/types/types"
import useSocket from "@/hooks/utils/useSocket"
import useToast from "@/hooks/utils/useToast"
import { useParams } from "next/navigation"
import { encryptSecret } from "@/E2E/encryption"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { parseEnvText } from "@/lib/parseEnv"

interface AddSecretPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const environmentOptions = [
  { label: "🧪 Development", value: "DEVELOPMENT" },
  { label: "🔍 Staging", value: "STAGING" },
  { label: "🚀 Production", value: "PRODUCTION" },
]

const secretTypeOptions = [
  { label: "🔑 Generic Secret", value: "GENERIC" },
  { label: "🔒 Password", value: "PASSWORD" },
  { label: "🔌 API Key", value: "API_KEY" },
  { label: "⚙️ Environment Variable", value: "ENV_VARIABLE" },
  { label: "🛡️ SSH Key", value: "SSH_KEY" },
  { label: "💾 Database Credential", value: "DATABASE_CREDENTIAL" },
  { label: "🎟️ Token", value: "TOKEN" },
]

const formSchema = z.object({
  secrets: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "At least one secret is required"),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
})

export type FormValues = z.infer<typeof formSchema>


const AddSecretPopup = ({ open, onOpenChange }: AddSecretPopupProps) => {
  const socket = useSocket()
  const { showToast } = useToast()
  const { vaultId }: { vaultId: string } = useParams()
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [bulkText, setBulkText] = useState("")
  const [visibleSecrets, setVisibleSecrets] = useState<Record<number, boolean>>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secrets: [{ key: "", value: "" }],
      environment: "DEVELOPMENT",
      type: "GENERIC",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "secrets",
  })

  const handleBulkImport = () => {
    if (!bulkText.trim()) return

    const parsed = parseEnvText(bulkText)
    if (parsed.length > 0) {
      form.setValue("secrets", parsed)
      setBulkText("")
      setShowBulkImport(false)
      setVisibleSecrets({})
      showToast({
        type: "success",
        message: `Imported ${parsed.length} secrets`,
      })
    }
  }

  const toggleSecretVisibility = (index: number) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const encryptedSecrets = []

      for (const secret of data.secrets) {
        const secretData: AddSecretFormValues = {
          key: secret.key,
          value: secret.value,
          environment: data.environment,
          type: data.type,
        }

        const encryptedSecret = await encryptSecret(secretData, vaultId)
        encryptedSecrets.push(encryptedSecret)
      }

      // Emit array of encrypted secrets
      socket.emit("create-secrets", {
        vaultId: vaultId,
        encryptedSecrets: encryptedSecrets,
      })

      form.reset()
      onOpenChange(false)

      showToast({
        type: "success",
        message: `Added ${encryptedSecrets.length} secret${encryptedSecrets.length > 1 ? "s" : ""}`,
      })
    } catch (error: any) {
      showToast({
        type: "error",
        message: error.message,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>🔐</span> Add New Secrets
          </DialogTitle>
          <DialogDescription>Add secrets to your vault. Each secret will be encrypted individually.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {secretTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {environmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <FormLabel>Secrets</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowBulkImport(!showBulkImport)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Import .env
              </Button>
            </div>

            {showBulkImport && (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                <FormLabel>Paste .env contents</FormLabel>
                <Textarea
                  placeholder="API_KEY=12345&#10;DB_URL=mongodb://...&#10;JWT_SECRET=abc123"
                  className="font-mono min-h-[100px]"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleBulkImport} disabled={!bulkText.trim()}>
                    Import
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowBulkImport(false)
                      setBulkText("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`secrets.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Key</FormLabel>}
                        <FormControl>
                          <Input placeholder="e.g. CLIENT_KEY" className="font-mono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`secrets.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        {index === 0 && <FormLabel>Value</FormLabel>}
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Secret value"
                              className="font-mono pr-10"
                              value={visibleSecrets[index] ? field.value : field.value ? "••••••••••" : ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                              onClick={() => toggleSecretVisibility(index)}
                            >
                              {visibleSecrets[index] ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-1 mt-6">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ key: "", value: "" })}
                className="flex items-center gap-2 w-full"
              >
                <Plus className="h-4 w-4" />
                Add Another
              </Button>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save {fields.length} Secret{fields.length > 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddSecretPopup
