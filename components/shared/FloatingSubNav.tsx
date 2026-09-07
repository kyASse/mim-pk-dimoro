"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SubNavItem {
  id: string;
  label: string;
  icon: LucideIcon | React.ElementType;
}

export interface FloatingSubNavProps {
  items: SubNavItem[];
  ariaLabel?: string;
  className?: string;
}

export default function FloatingSubNav({
  items,
  ariaLabel = "Navigasi Cepat Halaman",
  className,
}: FloatingSubNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      items.length === 0
    ) {
      return;
    }

    try {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          const topSection = visibleEntries[0];
          if (topSection?.target?.id) {
            setActiveId(topSection.target.id);
          }
        }
      };

      const observer = new window.IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "-15% 0px -65% 0px",
        threshold: 0,
      });

      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.observe(element);
        }
      });

      return () => {
        observer.disconnect();
      };
    } catch {
      // Fallback gracefully if IntersectionObserver fails in certain test environments
    }
  }, [items]);

  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeBtnRef.current;
      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();

      if (
        buttonRect.left < containerRect.left ||
        buttonRect.right > containerRect.right
      ) {
        button.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeId]);

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "sticky top-16 md:top-[4.25rem] z-40 mx-auto w-[calc(100%-1.5rem)] max-w-5xl my-2 transition-all duration-300",
        className
      )}
    >
      <div className="relative rounded-full backdrop-blur-2xl bg-background/85 dark:bg-zinc-950/85 border border-border/60 shadow-md p-1 sm:p-1.5 ring-1 ring-black/5 dark:ring-white/10">
        <div
          ref={containerRef}
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                ref={
                  isActive
                    ? (el) => {
                        activeBtnRef.current = el;
                      }
                    : undefined
                }
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all shrink-0 select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-bold scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-zinc-800/60 active:scale-95"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isActive ? "text-primary-foreground" : "text-primary/70"
                  )}
                />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
