# Redesign View Page /admin/galeri dan /admin/galeri/tambah Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/admin/galeri` into a Media Gallery Hub with 4 category metric cards, live caption search, responsive category pill tabs, desktop grid/table views, lightbox image preview, and redesign `/admin/galeri/tambah` into an upload studio with 2-column split layout, live file inspector, mobile sticky bottom dock, and full dark mode styling.

**Architecture:** Server page `/admin/galeri/page.tsx` fetches gallery items and renders header & breadcrumbs. `GaleriAdminHub.tsx` handles interactive filtering, category tabs, live search, metrics, and renders cards via `GaleriCard.tsx` and lightbox via `GaleriPreviewDialog.tsx`. `GaleriUploadForm.tsx` handles client-side form validation with Zod, drag-and-drop file inspection, and mobile sticky dock.

**Tech Stack:** Next.js 15+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI (`Card`, `Badge`, `Button`, `Input`, `Dialog`, `Select`), Lucide React, Sonner, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-02-redesign-admin-galeri-design.md`

## Global Constraints

- Never hardcode raw color classes (`bg-white`, `text-gray-900`, `text-gray-600`, `border-gray-200`, `bg-gray-50`). Always use semantic tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border/80`, `bg-muted/40`).
- Touch targets must be at least 40px: use `h-10 text-sm sm:h-8 sm:text-xs` for interactive inputs and action buttons.
- Horizontal category pill tabs must include `shrink-0 whitespace-nowrap min-w-max px-4` to prevent text clipping on mobile devices.
- Mobile form workflows must include a Sticky Floating Bottom Action Dock (`fixed bottom-0 lg:hidden`) for primary submission buttons.
- In administrative record sheets/dossiers, DO NOT put icons on individual key-value data rows.
- All tests must pass before completing any task.

---

### Task 1: Refactor `DeleteImageButton.tsx` and `EditImageButton.tsx` for Dark Mode Alignment

**Files:**
- Modify: `app/admin/galeri/DeleteImageButton.tsx`
- Modify: `app/admin/galeri/EditImageButton.tsx`

**Interfaces:**
- `DeleteImageButton({ galeriId, imageUrl }: { galeriId: number; imageUrl: string })`
- `EditImageButton({ galeriId, imageUrl, keterangan, kategori, onUpdated }: Props)`

- [ ] **Step 1: Inspect and update `DeleteImageButton.tsx`**
  Ensure the AlertDialog content, header, description, and trigger button use semantic dark mode classes (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`).
- [ ] **Step 2: Inspect and update `EditImageButton.tsx`**
  Replace hardcoded `bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200` with clean semantic tokens (`bg-muted/60 hover:bg-muted text-foreground border-border/80`). Update dialog inputs, labels, and card preview to be dark-mode compliant.
- [ ] **Step 3: Run existing action tests to ensure no regressions**
  Run `npx vitest run app/admin/galeri/__tests__/actions.test.ts`.
- [ ] **Step 4: Git commit**
  Commit changes with message `refactor(admin-galeri): align DeleteImageButton and EditImageButton with dark mode tokens`.

---

### Task 2: Create `GaleriPreviewDialog.tsx` & `GaleriCard.tsx`

**Files:**
- Create: `components/admin/galeri/GaleriPreviewDialog.tsx`
- Create: `components/admin/galeri/GaleriCard.tsx`
- Create: `components/admin/galeri/__tests__/GaleriCard.test.tsx`

**Interfaces:**
- `GaleriItem`: `{ id: number; image_url: string; keterangan: string | null; kategori: string | null; created_at?: string; }`
- `GaleriCard({ item, onPreview }: { item: GaleriItem; onPreview: (item: GaleriItem) => void; })`
- `GaleriPreviewDialog({ item, open, onOpenChange }: { item: GaleriItem | null; open: boolean; onOpenChange: (open: boolean) => void; })`

- [ ] **Step 1: Write test for `GaleriCard.tsx`**
  Verify thumbnail rendering, category badge styling, caption display, preview button trigger, and action buttons.
- [ ] **Step 2: Run test to confirm failure (TDD)**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriCard.test.tsx`.
- [ ] **Step 3: Implement `GaleriPreviewDialog.tsx`**
  Build clean dialog lightbox showing full resolution image, category badge, caption, and close/view full size actions.
- [ ] **Step 4: Implement `GaleriCard.tsx`**
  Build card with `aspect-square`, hover zoom overlay, category badge, caption, and quick action bar (preview, edit, delete).
- [ ] **Step 5: Run test to verify it passes**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriCard.test.tsx`.
- [ ] **Step 6: Git commit**
  Commit changes with message `feat(admin-galeri): create GaleriCard and GaleriPreviewDialog components`.

---

### Task 3: Create `GaleriAdminHub.tsx` (Summary Metrics, Category Tabs, Search, and Grid/Table Views)

**Files:**
- Create: `components/admin/galeri/GaleriAdminHub.tsx`
- Create: `components/admin/galeri/__tests__/GaleriAdminHub.test.tsx`

**Interfaces:**
- Consumes: `GaleriItem[]`.
- Produces: `GaleriAdminHub({ items }: { items: GaleriItem[] })`

- [ ] **Step 1: Write test for `GaleriAdminHub.tsx`**
  Verify:
  1. Global calculation of 4 metric cards (Total, Kegiatan Belajar, Ibadah, Acara Khusus/Lainnya).
  2. Category pill tab filtering updates visible items.
  3. Live search query filters by caption/keterangan.
  4. Empty state is shown when no photos match with a reset button.
- [ ] **Step 2: Run test to confirm failure (TDD)**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriAdminHub.test.tsx`.
- [ ] **Step 3: Implement `GaleriAdminHub.tsx`**
  - Metric summary cards (Total Foto, Kegiatan Belajar, Ibadah, Acara Khusus) with click-to-filter support.
  - Horizontal swipeable category tabs with `shrink-0 whitespace-nowrap min-w-max px-4`.
  - Live search input with clear icon.
  - Responsive grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  - List / Table layout toggle.
  - Integrated `GaleriPreviewDialog`.
  - Semantically styled empty states with reset filter action.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriAdminHub.test.tsx`.
- [ ] **Step 5: Git commit**
  Commit changes with message `feat(admin-galeri): create GaleriAdminHub with metrics, category tabs, and search`.

---

### Task 4: Modernize `/admin/galeri/page.tsx` (Server Page)

**Files:**
- Modify: `app/admin/galeri/page.tsx`
- Create: `app/admin/galeri/__tests__/page.test.tsx`

**Interfaces:**
- Next.js Server Component fetching gallery records and passing them to `GaleriAdminHub`.

- [ ] **Step 1: Write test for `app/admin/galeri/page.tsx`**
  Mock Supabase server client and test breadcrumb rendering, page header, shortcut to public gallery (`/galeri`), and delegation to `GaleriAdminHub`.
- [ ] **Step 2: Run test to verify behavior**
  Run `npx vitest run app/admin/galeri/__tests__/page.test.tsx`.
- [ ] **Step 3: Update `app/admin/galeri/page.tsx`**
  Implement breadcrumb `Dasbor / Galeri Foto`, modern title and description, public link shortcut button, and render `GaleriAdminHub`.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run app/admin/galeri/__tests__/page.test.tsx`.
- [ ] **Step 5: Git commit**
  Commit changes with message `refactor(admin-galeri): modernize /admin/galeri page with breadcrumbs and GaleriAdminHub`.

---

### Task 5: Create `GaleriUploadForm.tsx` (2-Column Studio Layout & Mobile Bottom Dock)

**Files:**
- Create: `components/admin/galeri/GaleriUploadForm.tsx`
- Create: `components/admin/galeri/__tests__/GaleriUploadForm.test.tsx`

**Interfaces:**
- Produces: `GaleriUploadForm()` client component with drag-and-drop file inspection, Zod validation, and responsive submission docks.

- [ ] **Step 1: Write test for `GaleriUploadForm.tsx`**
  Verify input fields, category selector, image file selection & preview display, metadata badge (size, type), and submit trigger.
- [ ] **Step 2: Run test to confirm failure (TDD)**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriUploadForm.test.tsx`.
- [ ] **Step 3: Implement `GaleriUploadForm.tsx`**
  - Left column: interactive drag-and-drop zone with dark mode border tokens, live image preview, metadata badge, and change image button.
  - Right column: title/caption input (`h-10 text-sm sm:h-8 sm:text-xs`), category selector, photography tips card.
  - Desktop submit button + Sticky Floating Bottom Action Dock (`fixed bottom-0 lg:hidden`) for mobile thumb ergonomics.
  - Supabase storage upload & database insert integration.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run components/admin/galeri/__tests__/GaleriUploadForm.test.tsx`.
- [ ] **Step 5: Git commit**
  Commit changes with message `feat(admin-galeri): create GaleriUploadForm with 2-column studio layout and mobile dock`.

---

### Task 6: Modernize `/admin/galeri/tambah/page.tsx`

**Files:**
- Modify: `app/admin/galeri/tambah/page.tsx`
- Create: `app/admin/galeri/tambah/__tests__/page.test.tsx`

**Interfaces:**
- Next.js Client/Server page rendering breadcrumbs `Dasbor / Galeri Foto / Tambah Foto` and hosting `GaleriUploadForm`.

- [ ] **Step 1: Write test for `/admin/galeri/tambah/page.tsx`**
  Verify breadcrumbs navigation, title, back button, and form rendering.
- [ ] **Step 2: Run test**
  Run `npx vitest run app/admin/galeri/tambah/__tests__/page.test.tsx`.
- [ ] **Step 3: Update `app/admin/galeri/tambah/page.tsx`**
  Clean up monolithic form and replace with sleek layout using `GaleriUploadForm`.
- [ ] **Step 4: Run test to verify it passes**
  Run `npx vitest run app/admin/galeri/tambah/__tests__/page.test.tsx`.
- [ ] **Step 5: Git commit**
  Commit changes with message `refactor(admin-galeri): modernize /admin/galeri/tambah page with breadcrumbs and studio layout`.

---

### Task 7: Full System Verification & Quality Assurance

- [ ] **Step 1: Run all Vitest test suites**
  Run `npm test`.
- [ ] **Step 2: Run TypeScript typecheck**
  Run `npx tsc --noEmit`.
- [ ] **Step 3: Check git status and diff**
  Verify all files adhere to code conventions, no console errors, zero raw color leaks.
- [ ] **Step 4: Final commit**
  Finalize branch commits if needed.
