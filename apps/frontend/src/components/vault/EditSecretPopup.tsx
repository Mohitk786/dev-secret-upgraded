"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useToast from "@/hooks/utils/useToast";
import useSocket from "@/hooks/utils/useSocket";
import { getPublicKey } from "@/E2E/rsaKeyGen";
import { encryptSecret } from "@/E2E/encryption";
import { useParams } from "next/navigation";

const formSchema = z.object({
  key: z.string().min(1, { message: "Secret name is required" }),
  value: z.string().min(1, { message: "Secret value is required" }),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSecretPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secret: any;
}

const environmentOptions = [
  { label: "🧪 Development", value: "DEVELOPMENT" },
  { label: "🔍 Staging", value: "STAGING" },
  { label: "🚀 Production", value: "PRODUCTION" },
];

const secretTypeOptions = [
  { label: "🔑 Generic Secret", value: "GENERIC" },
  { label: "🔒 Password", value: "PASSWORD" },
  { label: "🔌 API Key", value: "API_KEY" },
  { label: "⚙️ Environment Variable", value: "ENV_VARIABLE" },
  { label: "🛡️ SSH Key", value: "SSH_KEY" },
  { label: "💾 Database Credential", value: "DATABASE_CREDENTIAL" },
  { label: "🎟️ Token", value: "TOKEN" },
];

const EditSecretPopup = ({ open, onOpenChange, secret }: EditSecretPopupProps) => {
  const { showToast } = useToast();
  const socket = useSocket();
  const [isPending, setIsPending] = useState(false);
  const { vaultId }: { vaultId: string } = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: secret?.key || "",
      value: secret?.value || "",
      environment: secret?.environment || "DEVELOPMENT",
      type: secret?.type || "GENERIC",
    },
  });

  // Update form values when secret changes
  useEffect(() => {
    if (secret) {
      form.reset({
        key: secret.key || "",
        value: secret.value || "",
        environment: secret.environment || "DEVELOPMENT",
        type: secret.type || "GENERIC",
      });
    }
  }, [secret, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsPending(true);
      const publicKey = getPublicKey();

      if (!publicKey) {
        showToast({
          type: "error",
          message: "No public key found",
        })
      }
      const encryptedSecret = await encryptSecret(data, vaultId);

      socket.emit("update-secret", {
        secretId: secret.id,
        encryptedSecret: encryptedSecret,
        vaultId: secret.vaultId,
      });

      onOpenChange(false);

    } catch (error) {
      console.error(error);
      showToast({
        type: "error",
        message: "Failed to update secret",
      })
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>🔐</span> Edit Secret
          </DialogTitle>
          <DialogDescription>
            Update your secret details. All secrets are encrypted at rest.
          </DialogDescription>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
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
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. DATABASE_URL, API_TOKEN, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secret Value</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your secret value"
                      className="font-mono min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>Update Secret</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSecretPopup;
