// components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
}

export default function LogoutButton({ className, children }: LogoutButtonProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/') 
    }

    return <Button
        variant="outline"
        onClick={handleSignOut}
        className={cn("rounded-full hover:bg-highlight/80 text-highlight-foreground hover:text-highlight-foreground", className)}
    >
        {children || "Logout"}
    </Button>
}