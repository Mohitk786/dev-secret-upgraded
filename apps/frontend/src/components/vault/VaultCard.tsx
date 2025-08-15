import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { APP_ROUTES } from "@/constants/data";
import { User } from "@/types/types";

const VaultCard = ({ vault, user }: { vault: any; user: User }) => {
  const isOwner = vault?.ownerId === user?.id;

  return (
    <Link
      href={`${isOwner ? APP_ROUTES.VAULTS : APP_ROUTES.VAULT_DETAIL_SHARED}/${vault?.id}`}
      key={vault?.id}
    >
      <Card className="h-full overflow-hidden transition-all ">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">{vault?.icon}</div>
              <span className="text-sm font-medium text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">
                {vault?._count?.secrets || 0} secrets
              </span>
            </div>
            <p>
              {" "}
                <span className="text-xs text-muted-foreground ">
                  {vault?._count?.collaborators || 0} collaborators
                </span>
              
            </p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg  transition-colors">
              {vault?.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {vault?.description}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{vault?.type}</span>
            <span className="text-xs font-medium text-gray-200">
              View details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VaultCard;
