
import {  UseFormReturn } from "react-hook-form";
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
import { useCreateSecretMutation } from "@/hooks/mutations/useSecretMutations";
import { Loader2 } from "lucide-react";

import { Secret, AddSecretFormValues } from "@/types/types";



interface AddSecretPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AddSecretFormValues>;
  onSubmit: (data: AddSecretFormValues) => void;
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

const AddSecretPopup = ({ open, onOpenChange, form, onSubmit }: AddSecretPopupProps) => {
  const createSecretMutation = useCreateSecretMutation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>🔐</span> Add New Secret
          </DialogTitle>
          <DialogDescription>
            Add a new secret to your vault. All secrets are encrypted at rest.
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
                disabled={createSecretMutation.isPending}
              >
                {createSecretMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Secret</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
};

export default AddSecretPopup;
