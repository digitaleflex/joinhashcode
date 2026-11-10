-- Migration : explications de quiz et feedback par option (#428, HEF-WS-04).
-- Additive uniquement : colonnes nullables, aucune ligne existante modifiée.
-- `question.explanation` existait déjà ; on ajoute le lien vers la leçon qui
-- explique la notion et le feedback de chaque option.

-- AlterTable
ALTER TABLE "question" ADD COLUMN     "conceptContentId" TEXT;

-- AlterTable
ALTER TABLE "option" ADD COLUMN     "feedback" TEXT;

-- CreateIndex
CREATE INDEX "question_conceptContentId_idx" ON "question"("conceptContentId");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_conceptContentId_fkey" FOREIGN KEY ("conceptContentId") REFERENCES "content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
