import { z } from "zod";

export const QuizSubmissionSchema = z.object({
  answers: z.array(z.string()).min(1),
  responseTimes: z.array(z.number()).optional(),
});

export type QuizSubmissionInput = z.infer<typeof QuizSubmissionSchema>;
