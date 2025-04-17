
import { Link } from "react-router-dom";
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

interface VaultHeaderProps {
  vault: any;
  setIsAddSecretOpen: (value: boolean) => void;
  isSharedVault: boolean;
}

const VaultHeader = ({ vault, setIsAddSecretOpen, isSharedVault }: VaultHeaderProps) => {

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-between sm:items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-primary">
            {vault?.vault?.icon || "🔒"}
          </span>
          {vault?.vault?.name}
        </h1>
        <p className="text-muted-foreground mt-1">{vault?.vault?.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link to={`/vaults/${vault?.vault?.id}/logs`}>
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Activity Logs</span>
          </Link>
        </Button>

       { !isSharedVault && (
        <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          asChild
        >
          <Link to={`/vaults/${vault?.vault?.id}/collaborators`}>
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Collaborators</span>
          </Link>
        </Button>

        <Button 
          className="gap-1" 
          onClick={() => setIsAddSecretOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Secret
        </Button>
        </>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/vaults/edit/${vault?.vault?.id}`} className="cursor-pointer flex items-center">
                <Pencil className="h-4 w-4 mr-2" /> Edit Vault
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/vaults/invite/${vault?.vault?.id}`} className="cursor-pointer flex items-center">
                <Users className="h-4 w-4 mr-2" /> Invite Members
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" /> Copy Vault ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash className="h-4 w-4 mr-2" /> Delete Vault
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VaultHeader;
