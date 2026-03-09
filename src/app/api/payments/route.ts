import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// GET /api/payments - Listar pagamentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const fineId = searchParams.get('fineId');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (fineId) where.fineId = fineId;
    
    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          fine: { select: { vehiclePlate: true, violationDescription: true } }
        }
      }),
      db.payment.count({ where })
    ]);
    
    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 });
  }
}

// POST /api/payments - Registrar pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const reference = `PAY${Date.now().toString().slice(-8)}`;
    
    const payment = await db.payment.create({
      data: {
        fineId: body.fineId,
        userId: body.userId,
        amount: body.amount,
        method: body.method,
        status: 'completed',
        reference
      }
    });
    
    // Atualizar status da multa
    await db.fine.update({
      where: { id: body.fineId },
      data: {
        status: 'paid',
        paymentDate: new Date()
      }
    });
    
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 });
  }
}
