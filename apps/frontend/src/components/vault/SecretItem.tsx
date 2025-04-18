import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Edit, Trash, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useToast from "@/hooks/utils/useToast";
import { useDeleteSecretMutation } from "@/hooks/mutations/useSecretMutations";
import { SecretItemProps } from "@/types/types";
import { decryptSecret } from "@/hooks/utils/useDecryptSecret";
import { useAuth } from "@/hooks/queries/authQueries";

const SecretItem: React.FC<SecretItemProps> = ({
  secret,
  visibleSecrets,
  toggleSecretVisibility,
  onEditSecret,
  isSharedVault
}) => {

  // const { user } = useAuth();
  const { showToast } = useToast();


  const copyToClipboard = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    showToast({
      type: "success",
      message: `Copied ${name} to clipboard`
    });
  };

  const getEnvironmentEmoji = (environment: string) => {
    const emojiMap: Record<string, string> = {
      "DEVELOPMENT": "🧪",
      "STAGING": "🔍",
      "PRODUCTION": "🚀",
    };

    return emojiMap[environment] || "✨";
  };

  const getTypeEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      "GENERIC": "🔑",
      "PASSWORD": "🔒",
      "API_KEY": "🔌",
      "ENV_VARIABLE": "⚙️",
      "SSH_KEY": "🛡️",
      "DATABASE_CREDENTIAL": "💾",
      "TOKEN": "🎟️",
    };

    return emojiMap[type] || "🔑";
  };

  return (
    <div className="secret-item flex flex-col sm:flex-row  to-secondary/10 p-4 rounded-lg">
      <div className="flex-1">
        <h3 className="font-medium flex items-center gap-2">
          <span className="text-xl">{getTypeEmoji(secret.type)}</span>
          {secret.key}
        </h3>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span>{getEnvironmentEmoji(secret.environment)}</span>
            {secret.environment}
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-0 flex items-center gap-2">
        <div className="relative bg-secondary px-3 py-1.5 rounded text-sm font-mono overflow-hidden max-w-xs">
          {visibleSecrets.includes(secret?.id || "")
            ? secret?.value
            : "••••••••••••••••••••••••"}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleSecretVisibility(secret?.id || "")}
        >
          {visibleSecrets.includes(secret?.id || "")
            ? <EyeOff className="h-4 w-4" />
            : <Eye className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(secret?.value || "", secret?.key || "")}
        >
          <Copy className="h-4 w-4" />
        </Button>
        {/* {(vault.canEdit || vault?.vault?.ownerId === user?.id) && <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditSecret(secret)}
        >
          <Edit className="h-4 w-4" />
        </Button>}

        {(vault.canDelete || vault?.vault?.ownerId === user?.id) && <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Secret</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this secret? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteSecret(secret.id)}
                className="bg-destructive text-destructive-foreground"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Secret"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>} */}
      </div>
    </div>
  );
};

export default SecretItem;
