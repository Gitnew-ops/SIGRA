import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';

// GET /api/drivers - Listar motoristas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const province = searchParams.get('province');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (province) where.province = province;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { licenseNumber: { contains: search.toUpperCase() } },
        { phone: { contains: search } }
      ];
    }
    
    const [drivers, total] = await Promise.all([
      db.driver.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.driver.count({ where })
    ]);
    
    return NextResponse.json({
      drivers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Erro ao buscar motoristas' }, { status: 500 });
  }
}

// POST /api/drivers - Criar motorista
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const driver = await db.driver.create({
      data: {
        name: body.name,
        licenseNumber: body.licenseNumber.toUpperCase(),
        licenseCategory: body.licenseCategory,
        licenseExpiry: body.licenseExpiry,
        points: body.points || 0,
        phone: body.phone,
        email: body.email,
        province: body.province,
        municipality: body.municipality,
        address: body.address
      }
    });
    
    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Erro ao criar motorista' }, { status: 500 });
  }
}
