import { Suspense } from "react";
import { requireSession } from "@/lib/auth-guard";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Award, ArrowLeft } from "lucide-react";

function CertificatesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-[2rem] p-8 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card rounded-[3rem] border border-border">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Award className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-black text-foreground mb-2">Aucun certificat</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6 font-medium">
        Complétez un cours pour obtenir votre premier certificat.
      </p>
      <Button asChild className="rounded-full px-8 font-black text-xs uppercase tracking-widest">
        <Link href="/academy/courses">Voir les cours</Link>
      </Button>
    </div>
  );
}

async function CertificatesList() {
  const session = await requireSession();

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: {
      course: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  if (certificates.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {certificates.map((cert) => (
        <div key={cert.id} className="bg-card border border-border rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Award className="size-6 text-primary" />
          </div>
          <h3 className="font-black text-foreground mb-2">{cert.course.title}</h3>
          <p className="text-sm font-bold text-muted-foreground mb-4">
            Certificat #{cert.certificateNumber}
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            Délivré le {new Date(cert.issuedAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function AcademyCertificatesPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <Link href="/academy" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="size-4" /> Retour
        </Link>
        <h1 className="text-4xl font-black text-foreground tracking-tight mt-4">Mes certificats</h1>
        <p className="text-muted-foreground font-medium mt-1">Vos certificats de completion</p>
      </div>

      <Suspense fallback={<CertificatesListSkeleton />}>
        <CertificatesList />
      </Suspense>
    </div>
  );
}
