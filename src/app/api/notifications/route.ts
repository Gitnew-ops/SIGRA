import { db } from '@/lib/db';
import { NotificationService } from '@/lib/notifications';
import { NextResponse, NextRequest } from 'next/server';

// GET /api/notifications - Listar notificações
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await db.notification.findMany({
      where: {
        OR: [
          { userId },
          { userId: null }
        ],
        ...(unreadOnly && { readAt: null })
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const unreadCount = await db.notification.count({
      where: {
        OR: [
          { userId },
          { userId: null }
        ],
        readAt: null
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Erro ao buscar notificações' }, { status: 500 });
  }
}

// POST /api/notifications - Criar notificação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await NotificationService.send({
      type: body.type,
      title: body.title,
      message: body.message,
      userId: body.userId,
      data: body.data,
      channels: body.channels
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Erro ao criar notificação' }, { status: 500 });
  }
}

// PATCH /api/notifications - Marcar como lida
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.markAll && body.userId) {
      await NotificationService.markAllAsRead(body.userId);
    } else if (body.notificationId) {
      await NotificationService.markAsRead(body.notificationId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Erro ao atualizar notificação' }, { status: 500 });
  }
}
