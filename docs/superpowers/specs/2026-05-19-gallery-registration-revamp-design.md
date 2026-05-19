# Design Spec: Gallery and Registration Page Revamp (MIM Dimoro)

**Date:** 2026-05-19
**Status:** Draft
**Topic:** Revamp of public Gallery and Registration pages to align with shadcn/ui standards and the "MIM Dimoro" branding.

## 1. Background & Goals
The current Gallery and Registration pages use a mix of custom components and older patterns. This revamp aims to:
- Standardize the UI using **shadcn/ui** primitives.
- Improve accessibility and responsiveness.
- Correct the school branding from "TK ABA Mertosanan" to **"MIM Dimoro"**.
- Enhance the user experience for parents registering their children.

## 2. Page: Gallery (`/galeri`)

### 2.1 UI/UX Improvements
- **Layout:** Responsive grid (1 col mobile, 2 col sm, 3 col md, 4 col lg).
- **Components:**
    - `shadcn/Card`: Container for each gallery item.
    - `shadcn/AspectRatio`: Fixed 4:3 ratio for all thumbnails to ensure a uniform grid.
    - `shadcn/Skeleton`: Loading placeholders for images and metadata.
    - `shadcn/ToggleGroup` or `shadcn/Tabs`: For category filtering.
- **Lightbox:**
    - Replace custom lightbox with `shadcn/Dialog`.
    - Content: Full-resolution image, title, and description.
    - Navigation: Previous/Next buttons using Lucide icons (`ChevronLeft`, `ChevronRight`).
- **Interactions:** Subtle scale effect on card hover.

### 2.2 Data Handling
- Continue using Server Components to fetch gallery data and unique categories from Supabase.
- Optimize client-side filtering by passing transformed data to `GalleryClient`.

## 3. Page: Registration (`/pendaftaran`)

### 3.1 UI/UX Improvements
- **Branding Update:** Replace all instances of "TK ABA Mertosanan" with "MIM Dimoro".
- **Navigation:**
    - `shadcn/Tabs`: High-contrast, centered navigation for "Persyaratan", "Alur", and "Formulir".
    - Icons: Add `FileText`, `GitMerge`, and `UserPlus` to tab labels.
- **Informational Content:**
    - **Fees:** Use `shadcn/Table` for the registration cost breakdown.
    - **Flow:** Vertical timeline using `Separator` and `Badge` for step numbers.
    - **Important Notes:** Use `shadcn/Alert` (info/warning variant) for critical notices.
- **Form Refactoring:**
    - **Layout:** Single-page form divided by `Separator` and descriptive `h3` headers (e.g., "Data Calon Siswa", "Data Orang Tua").
    - **Standard Patterns:** Use shadcn `FieldGroup` and `Field` for consistent label/input spacing.
    - **Components:** Utilize shadcn `Input`, `Select`, `Switch`, `Checkbox`, and `Textarea`.
    - **Success State:** Enhanced `sonner` toast and a prominent success card/alert with a clear WhatsApp confirmation link.

### 3.2 Data & Validation
- **Validation:** Continue using `react-hook-form` with `zod`.
- **Submission:** Maintain Supabase client-side insertion with storage upload for supporting documents.

## 4. Technical Constraints
- **Tech Stack:** Next.js 15+ (App Router), Tailwind CSS v4, shadcn/ui, Supabase.
- **Components:** All UI components must reside in `components/ui/` or follow shadcn composition rules.
- **Icons:** Use `lucide-react` as established in the project.

## 5. Success Criteria
- [ ] Gallery displays a uniform grid of images.
- [ ] Lightbox works with keyboard navigation and fits the shadcn aesthetic.
- [ ] Registration form is logically segmented and easy to read.
- [ ] All references to the school name are corrected to "MIM Dimoro".
- [ ] No regressions in form submission or document upload functionality.
