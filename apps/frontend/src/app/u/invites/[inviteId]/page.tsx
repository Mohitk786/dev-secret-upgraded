'use client'

import { useEffect, useState } from "react";
import { useAcceptInvite, useRejectInvite } from "@/hooks/mutations/useCollab";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Shield, PenLine, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { APP_ROUTES } from "@/constants/data";
import { getInvite } from "@/services/collabServices";
import { useQuery } from "@tanstack/react-query";


interface Invite {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canAdd: boolean;
    inviteeId: string;
    status: string;
}

const Page = () => {
    const { inviteId } = useParams();
    const router = useRouter();
    const [accepted, setAccepted] = useState(false);
    const { mutate: acceptInvite, isPending: acceptPending, error: acceptError } = useAcceptInvite();
    const { mutate: rejectInvite, isPending: rejectPending, error: rejectError } = useRejectInvite();
    const  {data: invite, isLoading: inviteLoading} = useQuery<Invite>({
        queryKey: ['invite', inviteId],
        queryFn: () => getInvite(inviteId as string),
    })  

    useEffect(() => {
        if(invite?.status === 'ACCEPTED' || invite?.status === 'REJECTED'){
            router.push(APP_ROUTES.SHARED_WITH_ME);
        }
    }, [invite])    


    if (!acceptPending || !rejectPending) {
        const timer = setTimeout(() => {
            router.push(APP_ROUTES.SHARED_WITH_ME);
        }, 2000);

        clearTimeout(timer);
    }

    if (rejectPending || acceptPending) {
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

    if (acceptError || rejectError) {
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
                            <p>This invitation may have expired or is no longer valid or you are not authorized to accept it</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary" className="w-full" onClick={() => router.push(APP_ROUTES.SHARED_WITH_ME)}>
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
                        <Button className="w-full" onClick={() => router.push(APP_ROUTES.VAULTS)}>
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
                        {!inviteLoading && <div className="flex flex-wrap gap-2">
                           {invite?.canView && <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                <Shield className="h-3 w-3 mr-1" /> View Access
                            </Badge>}
                            {invite?.canEdit && <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                    <PenLine className="h-3 w-3 mr-1" /> Edit Access
                                </Badge>}
                            {invite?.canDelete && <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                <Trash2 className="h-3 w-3 mr-1" /> Delete Access
                            </Badge>}
                            {invite?.canAdd && <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                                <Plus className="h-3 w-3 mr-1" /> Add Secret
                            </Badge>
                            }
                        </div>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => rejectInvite(inviteId as string)}>
                        Decline
                    </Button>
                    <Button onClick={() => {
                        acceptInvite(inviteId as string); 
                        setAccepted(true)
                    }}>
                        Accept Invitation
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Page;
