export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { requireSession, AuthError } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { ArrowLeft, User, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ReplyForm } from "@/components/academy/reply-form";

interface PageProps {
  params: Promise<{ id: string; topicId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topicId } = await params;
  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    select: { title: true },
  });
  return { title: topic ? `${topic.title} — Forum` : "Forum — Academy" };
}

export default async function ForumTopicPage({ params }: PageProps) {
  try {
    await requireSession();
  } catch (error) {
    if (error instanceof AuthError) redirect("/signin");
    throw error;
  }

  const { id, topicId } = await params;

  const { getTopicWithPosts } = await import("@/app/actions/academy/forum");
  const topic = await getTopicWithPosts({ topicId });

  if (!topic) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link
        href={`/academy/my-courses/${id}`}
        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest mb-8"
      >
        <ArrowLeft className="size-4" /> Retour au cours
      </Link>

      {/* Topic header */}
      <div className="bg-card border border-border rounded-[2rem] p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
            <User className="size-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {topic.author.name ?? "Anonyme"}
            </p>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <Clock className="size-3" />
              {formatDistanceToNow(new Date(topic.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-black text-foreground tracking-tight mb-4">
          {topic.title}
        </h1>
        <div className="p-5 bg-secondary/40 rounded-2xl border border-border/60">
          <p className="text-sm text-foreground font-medium leading-relaxed whitespace-pre-wrap">
            {topic.content}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-bold">
          <MessageSquare className="size-3" />
          {topic.posts.length} réponse{topic.posts.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Posts */}
      {topic.posts.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-black text-foreground uppercase tracking-widest">
            Réponses
          </h2>
          {topic.posts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="size-9 rounded-xl bg-secondary flex items-center justify-center">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {post.author.name ?? "Anonyme"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Discussions module (inline) */}
      <div className="bg-card border border-border rounded-[2rem] p-6">
        <h2 className="text-lg font-black text-foreground uppercase tracking-widest mb-6">
          Ta réponse
        </h2>
        <ReplyForm topicId={topicId} />
      </div>
    </div>
  );
}