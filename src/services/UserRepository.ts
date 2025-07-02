import bcrypt from 'bcrypt';
import { query } from '../db';
import { User, UserSchema } from '../models/User';

export class UserRepository {
  static async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    UserSchema.parse(user); // Validate input
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [user.email, hashedPassword]
    );
    return { id: result.rows[0].id, email: result.rows[0].email, password: '', created_at: result.rows[0].created_at };
  }

  static async findById(id: number): Promise<User | null> {
    const result = await query('SELECT id, email, password_hash as password, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT id, email, password_hash as password, created_at FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  static async update(id: number, user: Partial<User>): Promise<User | null> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    // Only update provided fields
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key in user) {
      if (key === 'created_at') continue;
      if (key === 'password') {
        fields.push(`password_hash = $${idx}`);
      } else {
        fields.push(`${key} = $${idx}`);
      }
      values.push((user as any)[key]);
      idx++;
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, email, created_at`,
      values
    );
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
