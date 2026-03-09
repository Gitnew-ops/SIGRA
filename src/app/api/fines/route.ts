import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// GET /api/fines - Listar multas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const province = searchParams.get('province');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (province) where.province = province;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { vehiclePlate: { contains: search.toUpperCase() } },
        { driverName: { contains: search } },
        { agentName: { contains: search } },
        { violationCode: { contains: search.toUpperCase() } }
      ];
    }
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }
    
    const [fines, total] = await Promise.all([
      db.fine.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          vehicle: { select: { brand: true, model: true, color: true } }
        }
      }),
      db.fine.count({ where })
    ]);
    
    return NextResponse.json({
      fines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching fines:', error);
    return NextResponse.json({ error: 'Erro ao buscar multas' }, { status: 500 });
  }
}

// POST /api/fines - Criar multa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 dias para pagamento
    
    const paymentReference = `MULT${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const fine = await db.fine.create({
      data: {
        vehicleId: body.vehicleId,
        vehiclePlate: body.vehiclePlate.toUpperCase(),
        driverId: body.driverId,
        driverName: body.driverName,
        driverUserId: body.driverUserId,
        agentId: body.agentId,
        agentName: body.agentName,
        violationCode: body.violationCode,
        violationDescription: body.violationDescription,
        category: body.category,
        amount: body.amount,
        location: body.location,
        province: body.province,
        municipality: body.municipality,
        status: 'pending',
        points: body.points || 0,
        date: new Date(),
        dueDate,
        paymentReference,
        notes: body.notes
      }
    });
    
    return NextResponse.json(fine, { status: 201 });
  } catch (error) {
    console.error('Error creating fine:', error);
    return NextResponse.json({ error: 'Erro ao criar multa' }, { status: 500 });
  }
}
