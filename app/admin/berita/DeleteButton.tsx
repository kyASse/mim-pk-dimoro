'use client';

import { useState, useTransition } from 'react';
import { deleteBeritaAction } from './actions';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

type DeleteButtonProps = {
  beritaId: number;
  imageUrl: string;
};

export default function DeleteButton({ beritaId, imageUrl }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteBeritaAction(beritaId, imageUrl);
        if (result.success) {
          toast.success('Berita berhasil dihapus!');
          setOpen(false);
        } else {
          toast.error(result.message || 'Gagal menghapus berita');
        }
      } catch (error) {
        console.error('Error deleting news:', error);
        toast.error('Terjadi kesalahan saat menghapus berita');
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          aria-label="Hapus berita"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card text-card-foreground border-border max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Hapus Berita?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Apakah Anda yakin ingin menghapus berita ini secara permanen? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="border-border">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirmDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              'Ya, Hapus'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
