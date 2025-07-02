import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Log thư mục hiện tại và __dirname để debug
console.log('process.cwd():', process.cwd());
console.log('__dirname:', __dirname);

// Nạp .env từ thư mục gốc dự án (điều chỉnh đường dẫn nếu cần)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('Database URL:', process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optionally, add more pool options here (e.g., max, idleTimeoutMillis)
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Thêm hàm testConnection để test kết nối DB
export const testConnection = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query("select 'huong' as email");
    // Trả về hàng đầu tiên (first row) nếu có
    return result.rows[0];
  } finally {
    client.release();
  }
};

export default pool;

