
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
import { useCreateSecretMutation } from "@/hooks/mutations/useSecretMutations";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { encryptData, getPublicKey } from "@/lib/rsaKeyGen";
import { useToast } from "@/hooks/utils/use-toast";

const formSchema = z.object({
  key: z.string().min(1, { message: "Secret name is required" }),
  value: z.string().min(1, { message: "Secret value is required" }),
  environment: z.enum(["DEVELOPMENT", "STAGING", "PRODUCTION"]),
  type: z.enum(["GENERIC", "PASSWORD", "API_KEY", "ENV_VARIABLE", "SSH_KEY", "DATABASE_CREDENTIAL", "TOKEN"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSecretPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultId: string;
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

const AddSecretPopup = ({ open, onOpenChange, vaultId }: AddSecretPopupProps) => {
  const createSecretMutation = useCreateSecretMutation();
  const {toast} = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
      value: "",
      environment: "DEVELOPMENT",
      type: "GENERIC",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {

      const publicKey = getPublicKey();

      if(!publicKey) {
        toast({
          title: "No public key found",
          description: "Login again to get a public key",
        })
      }



      const encryptedValue = await encryptData(data.value, publicKey);
      const encryptedKey = await encryptData(data.key, publicKey);


      await createSecretMutation.mutateAsync({
        ...data,
        key: encryptedKey,
        value: encryptedValue,
        vaultId,
      });

      toast({
        title: "Secret added successfully!",
        description: "Your secret has been added to the vault",
      });
      form.reset();
      onOpenChange(false);

    } catch (error) {
      console.log("error", error);
      toast({
        title: "Failed to add secret",
        description: error.message,
      });
    }
  };

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
