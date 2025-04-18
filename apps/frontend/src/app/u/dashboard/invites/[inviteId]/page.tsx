'use client'

import { useState, useEffect } from "react";
import { useCollabQuery } from "@/hooks/queries/useCollabQuery";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Shield, PenLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useToast from "@/hooks/utils/useToast";

const AcceptInvite = () => {
    const { inviteId } = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const [accepted, setAccepted] = useState(false);
    const { data, isLoading, error } = useCollabQuery(inviteId as string);

    useEffect(() => {
        if (data && data.message) {
            setAccepted(true);
            showToast({
                type: "success",
                message: "You've successfully joined the vault"
            });

            // Redirect to vaults after 3 seconds
            const timer = setTimeout(() => {
                router.push("/u/dashboard/vaults/shared-with-me");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [data, router, showToast]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="animate-pulse bg-primary/20 h-12 w-12 rounded-full mx-auto flex items-center justify-center">
                                <Shield className="h-6 w-6 text-primary/70" />
                            </div>
                            <h3 className="text-xl font-medium">Processing invitation...</h3>
                            <p className="text-muted-foreground">Please wait while we verify your invitation</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-md border-destructive/20">
                    <CardHeader>
                        <CardTitle className="text-center text-destructive">Invitation Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <div className="bg-destructive/10 h-12 w-12 rounded-full mx-auto flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <p>This invitation may have expired or is no longer valid.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full" onClick={() => router.push("/u/dashboard/vaults/shared-with-me")}>
                            Return to Vaults
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (accepted) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card className="w-full max-w-md border-green-500/20">
                    <CardHeader>
                        <CardTitle className="text-center text-green-500">Invitation Accepted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <div className="bg-green-500/10 h-16 w-16 rounded-full mx-auto flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium mb-2">Success!</h3>
                                <p className="text-muted-foreground">
                                    You now have access to the shared vault.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => router.push("/vaults")}>
                            Go to Vaults
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Vault Invitation</CardTitle>
                    <CardDescription>
                        You've been invited to collaborate on a vault
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Access will be granted with the following permissions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                <Shield className="h-3 w-3 mr-1" /> View Access
                            </Badge>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <PenLine className="h-3 w-3 mr-1" /> Edit Access
                            </Badge>
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                <Trash2 className="h-3 w-3 mr-1" /> Delete Access
                            </Badge>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/vaults")}>
                        Decline
                    </Button>
                    <Button onClick={() => router.push(`/invites/${inviteId}`)}>
                        Accept Invitation
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AcceptInvite;
