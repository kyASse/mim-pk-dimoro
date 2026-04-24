'use client';

import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateStatusPendaftaran } from "../../actions";

const statusOptions = [
    { value: "Menunggu Persetujuan", label: "Menunggu Persetujuan", variant: "secondary" as const },
    { value: "Diterima", label: "Diterima", variant: "default" as const },
    { value: "Akun Dibuat", label: "Akun Dibuat", variant: "default" as const },
    { value: "Ditolak", label: "Ditolak", variant: "destructive" as const },
    { value: "Revisi", label: "Revisi", variant: "outline" as const },
];

const getStatusColor = (status: string | null) => {
    switch (status) {
        case "Akun Dibuat":
            return "bg-green-100 text-green-800 border-green-200";
        case "Diterima":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Ditolak":
            return "bg-red-100 text-red-800 border-red-200";
        case "Revisi":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

export default function StatusSelect({ id, value }: { id: string, value: string | null }) {
    const [isPending, startTransition] = useTransition();

    const handleValueChange = (newStatus: string) => {
        startTransition(async () => {
            await updateStatusPendaftaran(id, newStatus);
        });
    };

    const currentStatus = value || "Menunggu Persetujuan";
    
    return (
        <div className="flex items-center gap-2">
            <Select
                value={currentStatus}
                onValueChange={handleValueChange}
                disabled={isPending}
            >
                <SelectTrigger className={`w-auto h-auto px-2 py-1 text-xs font-medium border ${getStatusColor(currentStatus)}`}>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                <Badge variant={option.variant} className="text-xs">
                                    {option.label}
                                </Badge>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isPending && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            )}
        </div>
    );
}