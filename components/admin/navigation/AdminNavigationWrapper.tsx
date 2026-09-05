"use client"

import * as React from "react"
import { useState } from "react"
import { AdminMobileNav } from "./AdminMobileNav"
import { AdminMoreSheet } from "./AdminMoreSheet"

export interface AdminNavigationWrapperProps {
  className?: string
}

export function AdminNavigationWrapper({ className }: AdminNavigationWrapperProps = {}) {
  const [isMoreOpen, setIsMoreOpen] = useState(false)

  return (
    <>
      <AdminMobileNav
        onOpenMore={() => setIsMoreOpen(true)}
        isMoreOpen={isMoreOpen}
        className={className}
      />
      <AdminMoreSheet
        open={isMoreOpen}
        onOpenChange={setIsMoreOpen}
      />
    </>
  )
}
