type NotificationChannel = 'email' | 'sms' | 'push';

interface NotificationOptions {
    channel?: NotificationChannel;
    to: string;
    subject?: string;
    message: string;
}

export class NotificationService {
    // Gửi thông báo nhắc nhở task sắp đến hạn
    async sendTaskReminder(to: string, taskTitle: string, dueDate: string, channel: NotificationChannel = 'email') {
        const subject = `Reminder: Task "${taskTitle}" is due soon`;
        const message = `Your task "${taskTitle}" is due on ${dueDate}. Please make sure to complete it on time.`;
        await this.send({ to, subject, message, channel });
    }

    // Gửi cảnh báo khi task đã đến hạn
    async sendDueDateAlert(to: string, taskTitle: string, dueDate: string, channel: NotificationChannel = 'email') {
        const subject = `Alert: Task "${taskTitle}" is now due`;
        const message = `Your task "${taskTitle}" is now due (deadline: ${dueDate}). Please take action immediately.`;
        await this.send({ to, subject, message, channel });
    }

    // Gửi thông báo khi task được phân công cho user
    async sendTaskAssignment(to: string, taskTitle: string, assigner: string, channel: NotificationChannel = 'email') {
        const subject = `You have been assigned a new task: "${taskTitle}"`;
        const message = `You have been assigned the task "${taskTitle}" by ${assigner}. Please check your task list.`;
        await this.send({ to, subject, message, channel });
    }

    // Hàm gửi notification (mô phỏng, có thể tích hợp email, SMS, push...)
    async send(options: NotificationOptions) {
        // TODO: Tích hợp thực tế với email service, SMS gateway, push notification...
        // Ở đây chỉ log ra console để mô phỏng
        console.log(`[Notification][${options.channel || 'email'}] To: ${options.to} | Subject: ${options.subject || ''} | Message: ${options.message}`);
        // Trả về true để giả lập gửi thành công
        return true;
    }
}
