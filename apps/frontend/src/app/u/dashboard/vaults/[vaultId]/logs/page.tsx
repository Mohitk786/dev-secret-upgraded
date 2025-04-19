"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";
import { useGetVaultQuery } from "@/hooks/queries/useVaultQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Search,
    Filter,
    PlusCircle,
    Pencil,
    Trash,
    Eye
} from "lucide-react";
import moment from "moment";

interface AuditLog {
    id: string;
    action: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
    secret: {
        id: string;
        key: string;
        type: string;
    };
}

const getActionIcon = (action: string) => {
    switch (action) {
        case "secret_created":
            return <PlusCircle className="h-4 w-4 text-green-500" />;
        case "secret_updated":
            return <Pencil className="h-4 w-4 text-amber-500" />;
        case "secret_deleted":
            return <Trash className="h-4 w-4 text-red-500" />;
        case "secret_viewed":
            return <Eye className="h-4 w-4 text-blue-500" />;
        default:
            return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
};

const getActionColor = (action: string) => {
    switch (action) {
        case "secret_created":
            return "bg-green-500/10 text-green-500 border-green-500/20";
        case "secret_updated":
            return "bg-amber-500/10 text-amber-500 border-amber-500/20";
        case "secret_deleted":
            return "bg-red-500/10 text-red-500 border-red-500/20";
        case "secret_viewed":
            return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        default:
            return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
};

interface VaultLogs {
    id: string;
    action: string;
    createdAt: string;
    description: string;
    actor: {
        name: string;
        email: string;
        avatarUrl?: string;
    };
}

const VaultActivityLogs = () => {
    const { vaultId } = useParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState<string>("ALL");

    const { data: vault } = useGetVaultQuery(vaultId as string);

    const { data: vaultLogs, isLoading } = useQuery({
        queryKey: ["vault-logs", vaultId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/vaults/${vaultId}/logs`);
            return response.data?.logs;
        },
    });



    const filteredLogs = vaultLogs && vaultLogs.filter((log: VaultLogs) => {
        const matchesSearch =
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.actor.name && log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

        return matchesSearch && matchesAction;
    })


    return (
        <div className="space-y-6">

            <div>
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h1 className="text-3xl font-bold">Activity Logs</h1>
                </div>
                <p className="text-muted-foreground">
                    {vault ? `View all activity for "${vault.name}"` : 'View all vault activity'}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Activity Logs
                    </CardTitle>
                    <CardDescription>
                        Track all changes and access to secrets in this vault
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-52">
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="Filter by action" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Actions</SelectItem>
                                    <SelectItem value="secret_created">Created</SelectItem>
                                    <SelectItem value="secret_updated">Updated</SelectItem>
                                    <SelectItem value="secret_deleted">Deleted</SelectItem>
                                    <SelectItem value="secret_viewed">Viewed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="p-8 text-center">
                            <p>Loading activity logs...</p>
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">No activity logs found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs && filteredLogs.map((log: VaultLogs) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {log.actor.name}
                                            <p className="text-muted-foreground text-xs">{log.actor.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getActionColor(log.action)}>
                                                {getActionIcon(log.action)}
                                                <span className="ml-1">
                                                    {log.action.charAt(0) + log.action.slice(1).toLowerCase()}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {log.description}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {moment(log.createdAt).format("MMM d, yyyy, h:mm a")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VaultActivityLogs;
