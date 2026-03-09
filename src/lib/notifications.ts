// SIGRA - Sistema de Notificação Gratuito
// Serviços integrados: Web Push (nativo), Email (simulado), SMS/WhatsApp (simulado)

import { db } from './db';

// Tipos de notificação
export type NotificationType = 
  | 'fine_created'
  | 'fine_paid'
  | 'fine_contested'
  | 'payment_reminder'
  | 'license_expiry'
  | 'document_expiry'
  | 'system_alert';

export type NotificationChannel = 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';

// Interface de notificação
export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
  userId?: string;
  data?: Record<string, any>;
  channels?: NotificationChannel[];
}

// Templates de notificação em Português de Angola
const NOTIFICATION_TEMPLATES: Record<NotificationType, { title: string; getMessage: (data: any) => string }> = {
  fine_created: {
    title: 'Nova Multa Registada',
    getMessage: (data) => `Foi registada uma multa de ${formatCurrency(data.amount)} para o veículo ${data.plate}. Infração: ${data.violation}`
  },
  fine_paid: {
    title: 'Multa Paga',
    getMessage: (data) => `O pagamento de ${formatCurrency(data.amount)} referente à multa ${data.reference} foi confirmado.`
  },
  fine_contested: {
    title: 'Multa Contestada',
    getMessage: (data) => `A multa ${data.reference} foi contestada. Aguarde a análise.`
  },
  payment_reminder: {
    title: 'Lembrete de Pagamento',
    getMessage: (data) => `A multa ${data.reference} vence em ${data.daysLeft} dias. Valor: ${formatCurrency(data.amount)}`
  },
  license_expiry: {
    title: 'Carta de Condução a Expirar',
    getMessage: (data) => `A sua carta de condução expira em ${data.daysLeft} dias. Renove atempadamente.`
  },
  document_expiry: {
    title: 'Documento a Expirar',
    getMessage: (data) => `O ${data.documentType} do veículo ${data.plate} expira em ${data.daysLeft} dias.`
  },
  system_alert: {
    title: 'Alerta do Sistema',
    getMessage: (data) => data.message
  }
};

// Formatar moeda angolana
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(value).replace('AOA', 'Kz');
}

// Serviço de Notificação Principal
export class NotificationService {
  
  // Criar e enviar notificação
  static async send(notification: NotificationData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Criar registo na base de dados
      const dbNotification = await db.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data ? JSON.stringify(notification.data) : null,
          channel: 'in_app',
          status: 'pending'
        }
      });

      // Enviar por canais especificados
      const channels = notification.channels || ['in_app'];
      const results = await Promise.allSettled(
        channels.map(channel => this.sendToChannel(channel, notification))
      );

      // Atualizar status
      const allSuccessful = results.every(r => r.status === 'fulfilled');
      await db.notification.update({
        where: { id: dbNotification.id },
        data: {
          status: allSuccessful ? 'sent' : 'partial',
          sentAt: new Date()
        }
      });

      return { success: true, id: dbNotification.id };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error: String(error) };
    }
  }

  // Enviar para canal específico
  private static async sendToChannel(
    channel: NotificationChannel, 
    notification: NotificationData
  ): Promise<void> {
    switch (channel) {
      case 'in_app':
        // Notificação in-app é guardada na BD e mostrada no frontend
        break;
      
      case 'push':
        // Web Push Notification (nativo do browser - GRATUITO)
        await this.sendPushNotification(notification);
        break;
      
      case 'email':
        // Email (simulado - em produção usar Resend gratuito)
        await this.sendEmail(notification);
        break;
      
      case 'sms':
        // SMS (simulado - em produção usar Twilio trial gratuito)
        await this.sendSMS(notification);
        break;
      
      case 'whatsapp':
        // WhatsApp (simulado - em produção usar Twilio WhatsApp API)
        await this.sendWhatsApp(notification);
        break;
    }
  }

  // Web Push Notification (GRATUITO - nativo do browser)
  private static async sendPushNotification(notification: NotificationData): Promise<void> {
    // Em produção, usar Web Push API com VAPID keys
    // Por agora, simular o envio
    console.log(`[PUSH] ${notification.title}: ${notification.message}`);
    
    // Simular envio bem-sucedido
    // Em produção, implementar:
    // 1. Registrar Service Worker no frontend
    // 2. Subscrever o usuário ao push
    // 3. Enviar usando web-push library
  }

  // Email (GRATUITO - Resend tem 100 emails/dia grátis)
  private static async sendEmail(notification: NotificationData): Promise<void> {
    // Simular envio de email
    console.log(`[EMAIL] Para: ${notification.userId} | Assunto: ${notification.title}`);
    console.log(`[EMAIL] Corpo: ${notification.message}`);
    
    // Em produção com Resend (gratuito):
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'SIGRA <noreply@sigra.ao>',
    //   to: user.email,
    //   subject: notification.title,
    //   html: `<p>${notification.message}</p>`
    // });
  }

  // SMS (SIMULADO - Twilio tem trial gratuito)
  private static async sendSMS(notification: NotificationData): Promise<void> {
    // Simular envio de SMS
    console.log(`[SMS] ${notification.title}: ${notification.message}`);
    
    // Em produção com Twilio (trial gratuito):
    // const client = require('twilio')(accountSid, authToken);
    // await client.messages.create({
    //   body: notification.message,
    //   from: '+1234567890',
    //   to: userPhone
    // });
  }

  // WhatsApp (SIMULADO - Twilio WhatsApp API)
  private static async sendWhatsApp(notification: NotificationData): Promise<void> {
    // Simular envio de WhatsApp
    console.log(`[WHATSAPP] ${notification.title}: ${notification.message}`);
    
    // Em produção com Twilio WhatsApp:
    // await client.messages.create({
    //   from: 'whatsapp:+1234567890',
    //   body: notification.message,
    //   to: `whatsapp:${userPhone}`
    // });
  }

  // Obter notificações do usuário
  static async getUserNotifications(
    userId: string, 
    options: { limit?: number; unreadOnly?: boolean } = {}
  ): Promise<any[]> {
    const { limit = 20, unreadOnly = false } = options;
    
    return db.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: null } // Notificações globais
        ],
        ...(unreadOnly && { readAt: null })
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Marcar como lida
  static async markAsRead(notificationId: string): Promise<void> {
    await db.notification.update({
      where: { id: notificationId },
      data: { 
        status: 'read',
        readAt: new Date() 
      }
    });
  }

  // Marcar todas como lidas
  static async markAllAsRead(userId: string): Promise<void> {
    await db.notification.updateMany({
      where: { 
        userId,
        readAt: null 
      },
      data: { 
        status: 'read',
        readAt: new Date() 
      }
    });
  }

  // Contar não lidas
  static async countUnread(userId: string): Promise<number> {
    return db.notification.count({
      where: {
        OR: [
          { userId },
          { userId: null }
        ],
        readAt: null
      }
    });
  }

  // Criar notificação a partir de template
  static async createFromTemplate(
    type: NotificationType,
    data: Record<string, any>,
    userId?: string,
    channels?: NotificationChannel[]
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    const template = NOTIFICATION_TEMPLATES[type];
    
    return this.send({
      type,
      title: template.title,
      message: template.getMessage(data),
      userId,
      data,
      channels
    });
  }
}

export default NotificationService;
