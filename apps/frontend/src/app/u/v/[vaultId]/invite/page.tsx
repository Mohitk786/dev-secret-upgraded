"use client"

import { useState } from 'react';
import { useInviteCollab } from '@/hooks/mutations/useCollab';
import { useParams } from 'next/navigation';
import { useGetVaultQuery } from '@/hooks/queries/useVaultQuery';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import  useToast  from '@/hooks/utils/useToast';
import { UserPlus, ArrowLeft, ShieldCheck, PenLine, Trash2, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const InviteColloborators = () => {

  const  vaultId:any  = useParams().vaultId 
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState({
    canView: true,
    canEdit: false,
    canDelete: false,
    canAdd: false,
  });

  const { mutate: inviteCollab, isPending } = useInviteCollab();
  const { data: vault, isLoading: vaultLoading } = useGetVaultQuery(vaultId);
 

  const handleInvite = () => {
    if (!email || !email.includes('@')) {
      showToast({
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }

    inviteCollab(
      { 
        email, 
        vaultId: vaultId as string, 
        ...permissions 
      }, 
      {
        onSuccess: () => {
          showToast({
            type: "success",
            message: `An invitation has been sent to ${email}`
          });
          setEmail('');
        },
        onError: (error: any) => {
          showToast({
            type: "error",
            message: error.response?.data?.message || "Failed to send invitation",
          });
        }
      }
    );
  };

  
    
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold">Invite Collaborators</h1>
        <p className="text-muted-foreground">
          {!vaultLoading && vault ? `Share "${vault.name}" with your team` : 'Share your vault with your team'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" /> 
            Send Invitation
          </CardTitle>
          <CardDescription>
            Invite someone to collaborate on this vault
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="colleague@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="font-medium">Permissions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <Label htmlFor="view-permission" className="font-normal">
                    Can view secrets
                  </Label>
                </div>
                <Switch 
                  id="view-permission" 
                  checked={permissions.canView} 
                  onCheckedChange={(checked) => setPermissions({...permissions, canView: checked})}
                  disabled={true} // Always required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-green-500" />
                  <Label htmlFor="edit-permission" className="font-normal">
                    Can edit secrets
                  </Label>
                </div>
                <Switch 
                  id="edit-permission" 
                  checked={permissions.canEdit} 
                  onCheckedChange={(checked) => setPermissions({...permissions, canEdit: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <Label htmlFor="delete-permission" className="font-normal">
                    Can delete secrets
                  </Label>
                </div>
                <Switch 
                  id="delete-permission" 
                  checked={permissions.canDelete} 
                  onCheckedChange={(checked) => setPermissions({...permissions, canDelete: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-500" />
                  <Label htmlFor="add-permission" className="font-normal">
                    Can Add secrets
                  </Label>
                </div>
                <Switch 
                id="add-permission" 
                  checked={permissions.canAdd} 
                  onCheckedChange={(checked) => setPermissions({...permissions, canAdd: checked})}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleInvite} 
            disabled={isPending || !email}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InviteColloborators;
