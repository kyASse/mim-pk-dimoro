"use client"

import LayoutContent from "./LayoutContent";

export default function ClientLayoutContent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LayoutContent>{children}</LayoutContent>
    );
}