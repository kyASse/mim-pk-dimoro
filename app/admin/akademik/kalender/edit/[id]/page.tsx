import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditKegiatanAkademikRedirect({ params }: PageProps) {
	const { id } = await params;
	redirect(`/admin/kalender/edit/${id}`);
}

