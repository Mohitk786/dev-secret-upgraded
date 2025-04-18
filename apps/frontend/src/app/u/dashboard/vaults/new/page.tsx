"use client"

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, Sparkles } from "lucide-react";
import { useCreateVaultMutation } from "@/hooks/mutations/useVaultMutations";
import { cn } from "@/lib/utils"; // helper for classnames
import {encryptVaultKeyWithRSA } from "@/E2E/encryption";
import useToast from "@/hooks/utils/useToast";


const vaultFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
    description: z.string().max(200, "Description must be less than 200 characters").optional(),
    icon: z.string().default("🔒"),
});

const iconOptions = ["🔒", "🔑", "🔐", "🛡️", "📊", "💼", "🚀", "🔮", "💾", "🧩", "⚙️", "🌈", "🎮", "💻"];

const CreateVault = () => {
    const createVaultMutation = useCreateVaultMutation();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "🔒",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear on change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
        const result = vaultFormSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err: any) => {
                if (err.path[0]) fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
       
        const encryptedVaultKeyBase64 = await encryptVaultKeyWithRSA();

        const payload = {
            ...result.data,
            encryptedVaultKeyBase64
            }
            createVaultMutation.mutate(payload);
        } catch (error) {
            console.error("Error creating vault:", error);
            showToast({ type: "error", message: "Failed to create vault. Please try again." });
        }
    };

    return (
        <>
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" /> Create New Vault
                </h1>
                <p className="text-muted-foreground mt-1">
                    Set up a new secure vault to store your development secrets.
                </p>
            </div>

            <Card className="border-primary/10">
                <CardHeader>
                    <CardTitle>Vault Details</CardTitle>
                    <CardDescription>Configure your new vault's properties</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Vault Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="My Project Secrets"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                <p className="text-sm text-muted-foreground">A descriptive name for your vault</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Contains API keys and secrets for my development environment"
                                    className="resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                <p className="text-sm text-muted-foreground">A brief description of what this vault will contain</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Choose an Icon</Label>
                                <div className="grid grid-cols-7 gap-2 mt-2">
                                    {iconOptions.map((icon) => (
                                        <Button
                                            key={icon}
                                            type="button"
                                            variant={formData.icon === icon ? "default" : "outline"}
                                            className={cn("h-12 w-12 text-xl", formData.icon === icon && "bg-primary")}
                                            onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                                        >
                                            {icon}
                                        </Button>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">Select an icon that represents this vault</p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" className="gap-2">
                                <Save className="h-4 w-4" />
                                Create Vault
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>


    );
};

export default CreateVault;
