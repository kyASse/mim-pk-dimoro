"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface OpiniRichTextEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
}

interface ToolbarButtonProps {
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
}

function ToolbarButton({
  label,
  ariaLabel,
  icon,
  isActive = false,
  isDisabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={ariaLabel}
      disabled={isDisabled}
      onMouseDown={(e) => {
        // Prevent toolbar button click from stealing focus and collapsing selection in editor
        e.preventDefault();
      }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1.5 text-xs font-medium transition-colors shrink-0 h-8 w-8",
        isActive
          ? "bg-primary text-primary-foreground shadow-xs font-semibold"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isDisabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
      )}
    >
      {icon}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="h-5 w-px bg-border/60 mx-1 shrink-0 self-center" />;
}

export default function OpiniRichTextEditor({
  value,
  onChange,
  placeholder = "Tuliskan naskah gagasan, opini, atau pemikiran Anda di sini...",
  disabled = false,
  minHeight = "min-h-[280px]",
  className,
}: OpiniRichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline font-medium cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none p-4",
          minHeight,
          "text-foreground leading-relaxed selection:bg-primary/20"
        ),
      },
    },
    onCreate: ({ editor }) => {
      // If legacy plain text was passed without HTML tags, sync parsed HTML to parent
      if (value && !/<[a-z][\s\S]*>/i.test(value)) {
        onChange(editor.getHTML(), editor.getText());
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
  });

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

  const openLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  };

  const handleSaveLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editor) return;

    const trimmed = linkUrl.trim();
    if (!trimmed) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
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
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    }
    setIsLinkDialogOpen(false);
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-input bg-background overflow-hidden transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
        disabled && "opacity-60 cursor-not-allowed bg-muted/20",
        className
      )}
    >
      {/* Editorial Formatting Toolbar */}
      <div className="flex items-center gap-1 p-1.5 border-b border-border/50 bg-muted/30 overflow-x-auto scrollbar-thin">
        {/* Headings */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            label="Sub Judul Utama (Heading 2)"
            ariaLabel="Heading 2"
            icon={<Heading2 className="h-4 w-4" />}
            isActive={editor?.isActive("heading", { level: 2 })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            label="Sub Judul Bagian (Heading 3)"
            ariaLabel="Heading 3"
            icon={<Heading3 className="h-4 w-4" />}
            isActive={editor?.isActive("heading", { level: 3 })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          />
        </div>

        <ToolbarDivider />

        {/* Inline formatting */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            label="Tebal (Bold)"
            ariaLabel="Tebal (Bold)"
            icon={<Bold className="h-4 w-4" />}
            isActive={editor?.isActive("bold")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="Miring (Italic)"
            ariaLabel="Miring (Italic)"
            icon={<Italic className="h-4 w-4" />}
            isActive={editor?.isActive("italic")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            label="Garis Bawah (Underline)"
            ariaLabel="Garis Bawah (Underline)"
            icon={<UnderlineIcon className="h-4 w-4" />}
            isActive={editor?.isActive("underline")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            label="Coret (Strikethrough)"
            ariaLabel="Coret (Strikethrough)"
            icon={<Strikethrough className="h-4 w-4" />}
            isActive={editor?.isActive("strike")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </div>

        <ToolbarDivider />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            label="Kutipan (Blockquote)"
            ariaLabel="Kutipan (Blockquote)"
            icon={<Quote className="h-4 w-4" />}
            isActive={editor?.isActive("blockquote")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            label="Daftar Poin (Bullet List)"
            ariaLabel="Daftar Poin (Bullet List)"
            icon={<List className="h-4 w-4" />}
            isActive={editor?.isActive("bulletList")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Daftar Angka (Ordered List)"
            ariaLabel="Daftar Angka (Ordered List)"
            icon={<ListOrdered className="h-4 w-4" />}
            isActive={editor?.isActive("orderedList")}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Garis Pemisah (Divider)"
            ariaLabel="Garis Pemisah (Divider)"
            icon={<Minus className="h-4 w-4" />}
            isActive={false}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          />
        </div>

        <ToolbarDivider />

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            label="Rata Kiri (Align Left)"
            ariaLabel="Rata Kiri (Align Left)"
            icon={<AlignLeft className="h-4 w-4" />}
            isActive={editor?.isActive({ textAlign: "left" })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          />
          <ToolbarButton
            label="Rata Tengah (Align Center)"
            ariaLabel="Rata Tengah (Align Center)"
            icon={<AlignCenter className="h-4 w-4" />}
            isActive={editor?.isActive({ textAlign: "center" })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          />
          <ToolbarButton
            label="Rata Kanan (Align Right)"
            ariaLabel="Rata Kanan (Align Right)"
            icon={<AlignRight className="h-4 w-4" />}
            isActive={editor?.isActive({ textAlign: "right" })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          />
          <ToolbarButton
            label="Rata Kanan Kiri (Justify)"
            ariaLabel="Rata Kanan Kiri (Justify)"
            icon={<AlignJustify className="h-4 w-4" />}
            isActive={editor?.isActive({ textAlign: "justify" })}
            isDisabled={disabled || !editor}
            onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          />
        </div>

        <ToolbarDivider />

        {/* Links */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            label={editor?.isActive("link") ? "Edit Tautan" : "Sisipkan Tautan"}
            ariaLabel="Sisipkan Tautan"
            icon={<LinkIcon className="h-4 w-4" />}
            isActive={editor?.isActive("link")}
            isDisabled={disabled || !editor}
            onClick={openLinkDialog}
          />
          {editor?.isActive("link") && (
            <ToolbarButton
              label="Hapus Tautan"
              ariaLabel="Hapus Tautan"
              icon={<Unlink className="h-4 w-4 text-destructive" />}
              isDisabled={disabled || !editor}
              onClick={handleRemoveLink}
            />
          )}
        </div>

        <ToolbarDivider />

        {/* History */}
        <div className="flex items-center gap-0.5 shrink-0 ml-auto">
          <ToolbarButton
            label="Urungkan (Undo)"
            ariaLabel="Undo"
            icon={<Undo className="h-4 w-4" />}
            isDisabled={disabled || !editor?.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Ulangi (Redo)"
            ariaLabel="Redo"
            icon={<Redo className="h-4 w-4" />}
            isDisabled={disabled || !editor?.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
          />
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Dialog Link */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tautan Teks</DialogTitle>
            <DialogDescription>
              Masukkan URL tujuan untuk teks yang dipilih dalam naskah opini.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="link-url">URL Tujuan</Label>
              <Input
                id="link-url"
                type="text"
                placeholder="https://contoh-referensi.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              {editor?.isActive("link") ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveLink}
                >
                  Hapus Tautan
                </Button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLinkDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm">
                  Simpan
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
