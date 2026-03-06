import { notFound } from "next/navigation";
import { getFamilyByToken } from "@/lib/sheets";
import { HeroSplash } from "@/components/HeroSplash";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export default async function TokenSplashPage({ params }: Props) {
  const { token } = await params;

  const family = await getFamilyByToken(token);
  if (!family) {
    notFound();
  }

  return <HeroSplash nextHref={`/rsvp/${token}/home`} />;
}
