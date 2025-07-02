import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  category_id: z.number().nullable().optional(),
  priority_id: z.number().nullable().optional(),
  priority: z.string().optional(), // Thêm priority dạng string cho mapping frontend/backend
  title: z.string().min(1),
  description: z.string().optional(),
  due_date: z.string().optional(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  status: z.string().optional(), // Add status as optional
});

export type Task = z.infer<typeof TaskSchema>;
