"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface NavSubItem {
  title: string
  url: string
}

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string | number
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavMainProps {
  groups?: NavGroup[]
  items?: NavItem[]
}

export function NavMain({ groups, items }: NavMainProps) {
  const pathname = usePathname()

  const navGroups: NavGroup[] = groups || (items ? [{ label: "Menu Utama", items }] : [])

  const isRouteActive = (url: string) => {
    if (!pathname) return false
    if (url === "/admin") {
      return pathname === "/admin"
    }
    return pathname === url || pathname.startsWith(`${url}/`)
  }

  return (
    <>
      {navGroups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const hasSubItems = Boolean(item.items && item.items.length > 0)
              const isSubActive = hasSubItems && item.items?.some((sub) => isRouteActive(sub.url))
              const isItemActive = isRouteActive(item.url) || isSubActive

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isItemActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {hasSubItems ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isItemActive}
                            className={cn(
                              isItemActive &&
                                "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            )}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => {
                              const activeSub = isRouteActive(subItem.url)
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={activeSub}
                                    className={cn(
                                      activeSub &&
                                        "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                    )}
                                  >
                                    <Link href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        asChild
                        isActive={isItemActive}
                        className={cn(
                          isItemActive &&
                            "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        )}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
