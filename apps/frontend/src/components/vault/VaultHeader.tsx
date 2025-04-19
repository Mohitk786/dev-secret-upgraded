
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash, 
  Copy, 
  Users,
  FileText
} from "lucide-react";
import { useAuth } from "@/hooks/queries/authQueries";
import  useSocket  from "@/hooks/utils/useSocket";
import { APP_ROUTES } from "@/constants/data";
interface VaultHeaderProps {
  vault: any;
  setIsAddSecretOpen: (value: boolean) => void;
}

const VaultHeader = ({ vault, setIsAddSecretOpen }: VaultHeaderProps) => {

  const socket = useSocket();
  const { user } = useAuth();
  const isOwner = vault?.ownerId === user?.id;

  const handleDeleteVault = async (vaultId: string) => {
     socket.emit("delete-vault", {vaultId});
  };
  
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-primary">
            {vault?.icon || "🔒"}
          </span>
          {vault?.name}
        </h1>
        <p className="text-muted-foreground mt-1">{vault?.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href={`${APP_ROUTES.VAULTS}/${vault?.id}/logs`}>
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Activity Logs</span>
          </Link>
        </Button>

    
        <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link href={`${APP_ROUTES.VAULTS}/${vault?.id}/collaborators`}>
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Collaborators</span>
          </Link>
        </Button>


        {/* owner ho ya add permission ho */}
        {isOwner || vault?.permissions?.canAdd ? <Button 
          className="gap-1" 
          onClick={() => setIsAddSecretOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Secret
        </Button> : null}
        </>
        
        
        {isOwner ? <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`${APP_ROUTES.VAULTS}/${vault?.id}/edit`} className="cursor-pointer flex items-center">
                <Pencil className="h-4 w-4 mr-2" /> Edit Vault
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${APP_ROUTES.VAULTS}/${vault?.id}/invite`} className="cursor-pointer flex items-center">
                <Users className="h-4 w-4 mr-2" /> Invite Members
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" /> Copy Vault ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" onClick={() => handleDeleteVault(vault?.id)}>
              <Trash className="h-4 w-4 mr-2" /> Delete Vault
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> : null}
      </div>
    </div>
  );
};

export default VaultHeader;
