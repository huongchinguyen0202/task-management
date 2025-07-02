-- Thêm cột status cho bảng tasks
ALTER TABLE tasks ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
-- Cập nhật các task đã hoàn thành (nếu có cột completed)
UPDATE tasks SET status = 'completed' WHERE completed = true;
UPDATE tasks SET status = 'pending' WHERE completed = false;
-- Nếu không cần cột completed nữa, có thể xóa:
-- ALTER TABLE tasks DROP COLUMN completed;
