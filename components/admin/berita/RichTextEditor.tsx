// components/admin/berita/RichTextEditor.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { compressImageToWebP } from '@/lib/utils/image-compression';
import { uploadBeritaInlineImageAction } from '@/app/admin/berita/actions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onUploadImage?: (file: File) => Promise<string | null>;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Tulis isi berita di sini...',
  disabled = false,
  onUploadImage,
  className,
}: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleProcessImageRef = useRef<(file: File) => Promise<void>>(async () => {});

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto my-4 border shadow-sm',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Tulis isi berita di sini...',
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose dark:prose-invert max-w-none focus:outline-none min-h-[260px] p-4 text-foreground',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files.length > 0
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleProcessImageRef.current(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event) => {
        if (
          event.clipboardData &&
          event.clipboardData.files &&
          event.clipboardData.files.length > 0
        ) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleProcessImageRef.current(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  const editorRef = useRef(editor);
  editorRef.current = editor;

  const handleProcessImage = useCallback(
    async (file: File) => {
      const currentEditor = editorRef.current;
      if (!file || !file.type.startsWith('image/')) {
        toast.error('File yang dipilih bukan gambar yang valid');
        return;
      }

      setIsUploadingImage(true);
      try {
        // 1. Compress image to WebP
        const compressedFile = await compressImageToWebP(file);

        // 2. Upload
        let uploadedUrl: string | null = null;
        if (onUploadImage) {
          uploadedUrl = await onUploadImage(compressedFile);
        } else {
          const formData = new FormData();
          formData.append('image', compressedFile);
          const res = await uploadBeritaInlineImageAction(formData);
          if (res.success && res.url) {
            uploadedUrl = res.url;
          } else {
            throw new Error(res.message || 'Gagal mengunggah gambar');
          }
        }

        if (uploadedUrl && currentEditor) {
          currentEditor
            .chain()
            .focus()
            .setImage({ src: uploadedUrl, alt: file.name })
            .run();
          toast.success('Gambar berhasil disisipkan');
        } else {
          throw new Error('Gagal mendapatkan URL gambar');
        }
      } catch (error: unknown) {
        const msg =
          (error as Error)?.message || 'Gagal mengunggah gambar';
        toast.error(msg);
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onUploadImage]
  );

  handleProcessImageRef.current = handleProcessImage;

  // Sync value from props when changed externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessImage(files[0]);
    }
  };

  const openLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  };

  const handleSaveLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editor) return;

    const trimmed = linkUrl.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      let finalUrl = trimmed;
      if (
        !/^https?:\/\//i.test(finalUrl) &&
        !/^mailto:/i.test(finalUrl) &&
        !/^tel:/i.test(finalUrl) &&
        !/^#/i.test(finalUrl)
      ) {
        finalUrl = `https://${finalUrl}`;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: finalUrl })
        .run();
    }
    setIsLinkDialogOpen(false);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setIsLinkDialogOpen(false);
  };

  if (!editor) {
    return (
      <div
        className={cn(
          'rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[320px] flex items-center justify-center p-4',
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          'group/editor relative rounded-2xl border border-border/80 bg-card shadow-xs transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/60 overflow-hidden flex flex-col',
          disabled && 'opacity-70 cursor-not-allowed bg-muted/20',
          className
        )}
      >
        {/* Mobile-Friendly Sticky Toolbar Header */}
        <div
          className="sticky top-0 z-10 flex items-center gap-1 p-1.5 sm:p-2 border-b border-border/80 bg-muted/70 dark:bg-muted/40 backdrop-blur-md overflow-x-auto scrollbar-none select-none"
          role="toolbar"
          aria-label="Editor Toolbar"
        >
          {/* Group 1: Hierarchy */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              label="Paragraf"
              ariaLabel="Paragraf"
              textLabel="P"
              isActive={editor.isActive('paragraph')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().setParagraph().run()}
            />
            <ToolbarButton
              label="Heading 1"
              ariaLabel="Heading 1"
              icon={<Heading1 className="h-4 w-4" />}
              isActive={editor.isActive('heading', { level: 1 })}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            />
            <ToolbarButton
              label="Heading 2"
              ariaLabel="Heading 2"
              icon={<Heading2 className="h-4 w-4" />}
              isActive={editor.isActive('heading', { level: 2 })}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            />
            <ToolbarButton
              label="Heading 3"
              ariaLabel="Heading 3"
              icon={<Heading3 className="h-4 w-4" />}
              isActive={editor.isActive('heading', { level: 3 })}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            />
          </div>

          <ToolbarDivider />

          {/* Group 2: Inline Formatting */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              label="Tebal (Bold)"
              ariaLabel="Tebal (Bold)"
              icon={<Bold className="h-4 w-4" />}
              isActive={editor.isActive('bold')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              label="Miring (Italic)"
              ariaLabel="Miring (Italic)"
              icon={<Italic className="h-4 w-4" />}
              isActive={editor.isActive('italic')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              label="Garis Bawah (Underline)"
              ariaLabel="Garis Bawah (Underline)"
              icon={<UnderlineIcon className="h-4 w-4" />}
              isActive={editor.isActive('underline')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <ToolbarButton
              label="Coret (Strikethrough)"
              ariaLabel="Coret (Strikethrough)"
              icon={<Strikethrough className="h-4 w-4" />}
              isActive={editor.isActive('strike')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </div>

          <ToolbarDivider />

          {/* Group 3: Block Formatting */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              label="Kutipan (Blockquote)"
              ariaLabel="Kutipan (Blockquote)"
              icon={<Quote className="h-4 w-4" />}
              isActive={editor.isActive('blockquote')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
              label="Daftar Poin (Bullet List)"
              ariaLabel="Daftar Poin (Bullet List)"
              icon={<List className="h-4 w-4" />}
              isActive={editor.isActive('bulletList')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              label="Daftar Angka (Ordered List)"
              ariaLabel="Daftar Angka (Ordered List)"
              icon={<ListOrdered className="h-4 w-4" />}
              isActive={editor.isActive('orderedList')}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              label="Garis Pemisah (Divider)"
              ariaLabel="Garis Pemisah (Divider)"
              icon={<Minus className="h-4 w-4" />}
              isActive={false}
              isDisabled={disabled}
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            />
          </div>

          <ToolbarDivider />

          {/* Group 4: Media & Links */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              label={editor.isActive('link') ? 'Edit Tautan' : 'Sisipkan Tautan'}
              ariaLabel="Sisipkan Tautan"
              icon={<LinkIcon className="h-4 w-4" />}
              isActive={editor.isActive('link')}
              isDisabled={disabled}
              onClick={openLinkDialog}
            />
            <ToolbarButton
              label="Unggah Gambar"
              ariaLabel="Unggah Gambar"
              icon={
                isUploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )
              }
              isActive={false}
              isDisabled={disabled || isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>

          <ToolbarDivider />

          {/* Group 5: History */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolbarButton
              label="Undo (Urungkan)"
              ariaLabel="Undo"
              icon={<Undo className="h-4 w-4" />}
              isActive={false}
              isDisabled={disabled || !editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            />
            <ToolbarButton
              label="Redo (Ulangi)"
              ariaLabel="Redo"
              icon={<Redo className="h-4 w-4" />}
              isActive={false}
              isDisabled={disabled || !editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            />
          </div>
        </div>

        {/* Hidden File Input for Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          data-testid="rich-text-image-input"
          onChange={handleFileInputChange}
          disabled={disabled || isUploadingImage}
        />

        {/* Editor Content Area (with iOS auto-zoom prevention: text-base on mobile, text-sm on sm+) */}
        <div className="relative min-h-[280px] sm:min-h-[320px] cursor-text bg-card text-base sm:text-sm [&_.ProseMirror]:min-h-[280px] sm:[&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:p-3.5 sm:[&_.ProseMirror]:p-5 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror.is-editor-empty:first-child::before]:text-muted-foreground/70 [&_.ProseMirror.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror.is-editor-empty:first-child::before]:float-left [&_.ProseMirror.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror.is-editor-empty:first-child::before]:h-0">
          <EditorContent editor={editor} />
        </div>

        {/* Link Modal Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-md p-5 sm:p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {editor.isActive('link') ? 'Edit Tautan' : 'Sisipkan Tautan'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Masukkan alamat web URL yang ingin ditautkan pada teks terpilih.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveLink} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="link-url-input" className="text-xs font-medium">URL Tautan</Label>
                <Input
                  id="link-url-input"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  autoFocus
                  className="h-10 text-base sm:h-9 sm:text-sm"
                />
              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between sm:space-x-0 pt-2">
                {editor.isActive('link') && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLink}
                    className="h-10 sm:h-8 text-xs sm:mr-auto"
                  >
                    <Unlink className="h-4 w-4 mr-1.5" />
                    Hapus Tautan
                  </Button>
                )}
                <div className="flex gap-2 justify-end w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLinkDialogOpen(false)}
                    className="h-10 sm:h-8 text-xs flex-1 sm:flex-none"
                  >
                    Batal
                  </Button>
                  <Button type="submit" size="sm" className="h-10 sm:h-8 text-xs flex-1 sm:flex-none">
                    Simpan Tautan
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

interface ToolbarButtonProps {
  label: string;
  icon?: React.ReactNode;
  textLabel?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

function ToolbarButton({
  label,
  icon,
  textLabel,
  isActive = false,
  isDisabled = false,
  onClick,
  ariaLabel,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          disabled={isDisabled}
          aria-label={ariaLabel}
          aria-pressed={isActive}
          className={cn(
            'h-9 w-9 sm:h-8 sm:w-8 shrink-0 rounded-lg inline-flex items-center justify-center text-xs font-medium transition-all active:scale-[0.96] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
            isActive
              ? 'bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/40'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
          )}
        >
          {icon ? icon : <span className="font-semibold text-xs">{textLabel}</span>}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return (
    <div
      className="h-5 w-px bg-border mx-0.5 self-center shrink-0"
      aria-hidden="true"
    />
  );
}
