import { query } from '../db';
import { Task, TaskSchema } from '../models/Task';

export class TaskRepository {
  static async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    TaskSchema.parse(task);
    const result = await query(
      `INSERT INTO tasks (user_id, category_id, priority_id, title, description, due_date, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [task.user_id, task.category_id ?? null, task.priority_id ?? null, task.title, task.description ?? '', task.due_date ?? null, task.completed ?? false]
    );
    return result.rows[0];
  }

  static async findById(id: number): Promise<Task | null> {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async update(id: number, task: Partial<Task>): Promise<Task | null> {
    // Only update provided fields
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in task) {
      fields.push(`${key} = $${idx}`);
      values.push((task as any)[key]);
      idx++;
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await query(
      `UPDATE tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async findAllByUser(user_id: number, filters: any = {}): Promise<Task[]> {
    let sql = 'SELECT * FROM tasks WHERE user_id = $1';
    const values: any[] = [user_id];
    let idx = 2;
    if (filters.completed !== undefined) {
      sql += ` AND completed = $${idx}`;
      values.push(filters.completed);
      idx++;
    }
    if (filters.category_id) {
      sql += ` AND category_id = $${idx}`;
      values.push(filters.category_id);
      idx++;
    }
    if (filters.priority_id) {
      sql += ` AND priority_id = $${idx}`;
      values.push(filters.priority_id);
      idx++;
    }
    if (filters.due_date) {
      sql += ` AND due_date = $${idx}`;
      values.push(filters.due_date);
      idx++;
    }
    // Search by title or description
    if (filters.search) {
      sql += ` AND (title ILIKE $${idx} OR description ILIKE $${idx})`;
      values.push(`%${filters.search}%`);
      idx++;
    }
    sql += ' ORDER BY due_date ASC, created_at DESC';
    const result = await query(sql, values);
    return result.rows;
  }

  static async findWithRelations(id: number): Promise<any | null> {
    const result = await query(
      `SELECT t.*, c.name as category, p.name as priority
       FROM tasks t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN priorities p ON t.priority_id = p.id
       WHERE t.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }
}
