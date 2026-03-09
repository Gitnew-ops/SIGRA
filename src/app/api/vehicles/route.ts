import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// GET /api/vehicles - Listar veículos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const province = searchParams.get('province');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (province) where.province = province;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { plate: { contains: search.toUpperCase() } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { ownerName: { contains: search } }
      ];
    }
    
    const [vehicles, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          documents: true
        }
      }),
      db.vehicle.count({ where })
    ]);
    
    return NextResponse.json({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Erro ao buscar veículos' }, { status: 500 });
  }
}

// POST /api/vehicles - Criar veículo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const vehicle = await db.vehicle.create({
      data: {
        plate: body.plate.toUpperCase(),
        brand: body.brand,
        model: body.model,
        year: body.year,
        color: body.color,
        ownerId: body.ownerId || 'default',
        ownerName: body.ownerName,
        province: body.province,
        municipality: body.municipality,
        status: body.status || 'active'
      }
    });
    
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Erro ao criar veículo' }, { status: 500 });
  }
}
