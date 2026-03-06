import { notFound } from "next/navigation";
import { getFamilyByToken } from "@/lib/sheets";
import { Nav } from "@/components/Nav";

interface Props {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function ContentLayout({ children, params }: Props) {
  const { token } = await params;

  const family = await getFamilyByToken(token);
  if (!family) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Nav token={token} familyName={family.family_name} />
      <main className="flex-1">{children}</main>
      <footer className="bg-rose-900 text-rose-200 text-center py-5 text-sm">
        With love — Marissa &amp; Ross
      </footer>
    </div>
  );
}
