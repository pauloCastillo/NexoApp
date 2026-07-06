import axios from 'axios';
import PushToken from '@/db/models/pushToken.js';

// ponytail: Expo Push API directa, sin expo-server-sdk

class NotificationService {
  async sendToUser(userId: string, title: string, body: string, data?: Record<string, unknown>) {
    const pushToken = await PushToken.findOne({ userId });
    if (!pushToken) return;

    await axios.post('https://exp.host/--/api/v2/push/send', {
      to: pushToken.token,
      title,
      body,
      data: data || {},
    });
  }

  async sendToCompany(companyId: string, title: string, body: string, data?: Record<string, unknown>) {
    const tokens = await PushToken.find({ companyId });
    if (tokens.length === 0) return;

    const messages = tokens.map(t => ({
      to: t.token,
      title,
      body,
      data: data || {},
    }));

    for (let i = 0; i < messages.length; i += 100) {
      await axios.post('https://exp.host/--/api/v2/push/send', messages.slice(i, i + 100));
    }
  }
}

export default new NotificationService();
