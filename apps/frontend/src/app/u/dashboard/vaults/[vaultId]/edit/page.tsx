"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";
import { useUpdateVaultMutation } from "@/hooks/mutations/useVaultMutations";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional(),
  icon: z.string().max(10, { message: "Icon should be a single emoji or short text" }).optional(),
});

const commonEmojis = [
  { emoji: "🔒", label: "Lock" },
  { emoji: "🔑", label: "Key" },
  { emoji: "📝", label: "Note" },
  { emoji: "💳", label: "Card" },
  { emoji: "📂", label: "Folder" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "🌐", label: "Globe" },
  { emoji: "💻", label: "Laptop" },
  { emoji: "🔐", label: "Locked" },
  { emoji: "⚙️", label: "Settings" },
  { emoji: "🔧", label: "Tool" },
  { emoji: "🛠️", label: "Tools" },
  { emoji: "🧰", label: "Toolbox" },
  { emoji: "🗄️", label: "Cabinet" },
  { emoji: "📊", label: "Chart" },
  { emoji: "📈", label: "Graph" },
  { emoji: "🏢", label: "Building" },
  { emoji: "🌟", label: "Star" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🔌", label: "Plugin" },
];

const EditVault = () => {
  const { vaultId } = useParams<{ vaultId: string }>();
  const router = useRouter();
  const { data: vault, isLoading, error } = useGetVaultQuery(vaultId || "");
  const updateVaultMutation = useUpdateVaultMutation();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  useEffect(() => {
    if (vault) {
      form.reset({
        name: vault.name,
        description: vault.description || "",
        icon: vault.icon || "",
      });
    }
  }, [vault, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!vaultId) return;
    
    try {
      await updateVaultMutation.mutateAsync({
        vaultId: vaultId,
        data: values
      });
      router.push(`/u/dashboard/vaults/${vaultId}`);
    } catch (error) {
      console.error("Failed to update vault:", error);
    }
  };

  const selectEmoji = (emoji: string) => {
    form.setValue("icon", emoji);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading vault...</span>
      </div>
    );
  }


  if (error || !vault) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-destructive">Error Loading Vault</h2>
        <p className="text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Could not find the requested vault"}
        </p>
        <Button onClick={() => router.push("/u/dashboard/vaults")} className="mt-4">
          Back to Vaults
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
     

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Vault</h1>
        <p className="text-muted-foreground mt-1">
          Update your vault details and preferences.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Vault Information</CardTitle>
          <CardDescription>
            Change how your vault appears and is organized.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vault Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Secure Vault" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your vault.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Store important secrets for this project..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional details about what this vault is used for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-md flex items-center justify-center w-10 h-10 text-2xl">
                          {field.value || "📂"}
                        </div>
                        <Input 
                          placeholder="📂" 
                          {...field}
                          className="w-20"
                          maxLength={4}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Choose an emoji that represents your vault.
                    </FormDescription>
                    <div className="mt-2 grid grid-cols-10 gap-2">
                      {commonEmojis.map((item) => (
                        <button
                          key={item.emoji}
                          type="button"
                          onClick={() => selectEmoji(item.emoji)}
                          className="w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-secondary cursor-pointer"
                          title={item.label}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => router.push(`/u/dashboard/vaults/${vaultId}`)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateVaultMutation.isPending} 
                  className="gap-2"
                >
                  {updateVaultMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditVault;
