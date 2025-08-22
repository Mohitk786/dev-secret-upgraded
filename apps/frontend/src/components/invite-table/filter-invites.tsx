"use client"

import React, { useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const FilterInvites = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleStatusChange = ({ value = "ALL" }: { value?: string }) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", value);
    replace(`${pathname}?${params.toString()}`);
  };


  
  useEffect(() => {
    if (!searchParams.get("status")) {
      handleStatusChange({ value: "ALL" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex justify-end">
      <Select
        value={searchParams.get("status") || "ALL"}
        onValueChange={(value) => handleStatusChange({ value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Invites</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="ACCEPTED">Accepted</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterInvites;
