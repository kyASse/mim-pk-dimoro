import Image from "next/image";
import type { PersonilOrganisasi, SlotJabatan } from "@/lib/types/content";
import { resolveSlotPersonil } from "@/lib/utils/struktur-organisasi";
import { cn } from "@/lib/utils";

export type OrgNodeCardVariant = "spotlight" | "partner" | "default" | "compact";

export interface OrgNodeCardProps {
  slot: SlotJabatan;
  personil: PersonilOrganisasi[];
  variant?: OrgNodeCardVariant;
  className?: string;
}

interface VariantStyleConfig {
  outerClass: string;
  cardClass: string;
  avatarClass: string;
  sizes: string;
  badgeClass: string;
  nameClass: string;
  contentWrapperClass: string;
}

const VARIANT_CONFIG: Record<OrgNodeCardVariant, VariantStyleConfig> = {
  spotlight: {
    outerClass: "ring-1 ring-border/50 bg-muted/20 p-1.5 rounded-2xl shadow-sm",
    cardClass:
      "bg-card rounded-[calc(1rem-0.375rem)] border border-primary/25 px-5 py-4 flex flex-col items-center text-center shadow-sm",
    avatarClass:
      "relative size-20 sm:size-24 rounded-2xl overflow-hidden shrink-0 ring-2 ring-primary/30 bg-muted/40 shadow-md mb-3",
    sizes: "(max-width: 640px) 80px, 96px",
    badgeClass:
      "inline-flex items-center justify-center rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm mb-1.5",
    nameClass: "font-bold text-sm sm:text-base leading-snug text-balance",
    contentWrapperClass: "flex flex-col items-center min-w-0",
  },
  partner: {
    outerClass: "",
    cardClass:
      "bg-card/90 border border-dashed border-primary/35 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 text-left shadow-sm hover:border-primary/55 transition-colors",
    avatarClass:
      "relative size-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/25 bg-muted/40 shadow-sm",
    sizes: "56px",
    badgeClass:
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-1",
    nameClass: "font-bold text-sm leading-snug",
    contentWrapperClass: "min-w-0 flex-1",
  },
  default: {
    outerClass: "",
    cardClass:
      "bg-card border border-border/70 rounded-2xl px-4 py-3.5 flex flex-col items-center text-center shadow-sm hover:border-primary/40 hover:shadow-sm transition-all",
    avatarClass:
      "relative size-14 sm:size-16 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 bg-muted/40 shadow-sm mb-2.5",
    sizes: "64px",
    badgeClass:
      "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 mb-1.5 leading-tight",
    nameClass: "font-semibold text-xs sm:text-sm leading-snug text-balance",
    contentWrapperClass: "flex flex-col items-center min-w-0 w-full",
  },
  compact: {
    outerClass: "",
    cardClass:
      "bg-card border border-border/60 rounded-xl px-3 py-3 flex flex-col items-center text-center shadow-sm hover:border-primary/35 transition-colors",
    avatarClass:
      "relative size-12 rounded-full overflow-hidden shrink-0 border border-border/70 bg-muted/40 mb-2",
    sizes: "48px",
    badgeClass:
      "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-secondary text-secondary-foreground border border-primary/15 mb-1 leading-tight",
    nameClass: "font-semibold text-xs leading-snug text-balance",
    contentWrapperClass: "flex flex-col items-center min-w-0 w-full",
  },
};

/**
 * OrgNodeCard
 * Kartu simpul bagan struktur organisasi publik.
 * Sesuai standar keseragaman: hanya menampilkan Foto, Jabatan, dan Nama + Gelar.
 */
export default function OrgNodeCard({
  slot,
  personil,
  variant = "default",
  className,
}: OrgNodeCardProps) {
  const resolved = resolveSlotPersonil(slot, personil);
  const style = VARIANT_CONFIG[variant];

  const cardBody = (
    <div
      data-slot-id={style.outerClass ? undefined : slot.id}
      className={cn(style.cardClass, !style.outerClass && className)}
    >
      <div className={style.avatarClass}>
        <Image
          src={resolved.fotoUrl}
          alt={`Foto ${resolved.nama} - ${slot.jabatan}`}
          fill
          className="object-cover object-top"
          sizes={style.sizes}
        />
      </div>
      <div className={style.contentWrapperClass}>
        <span className={style.badgeClass}>{slot.jabatan}</span>
        <p
          className={cn(
            style.nameClass,
            resolved.isAssigned ? "text-foreground" : "text-muted-foreground italic"
          )}
        >
          {resolved.nama}
        </p>
      </div>
    </div>
  );

  if (!style.outerClass) {
    return cardBody;
  }

  return (
    <div data-slot-id={slot.id} className={cn(style.outerClass, className)}>
      {cardBody}
    </div>
  );
}
