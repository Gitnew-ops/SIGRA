import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/stats - Estatísticas do Dashboard
export async function GET() {
  try {
    // Total de veículos
    const totalVehicles = await db.vehicle.count();
    
    // Total de motoristas
    const totalDrivers = await db.driver.count();
    
    // Total de multas
    const totalFines = await db.fine.count();
    
    // Multas por status
    const pendingFines = await db.fine.count({ where: { status: 'pending' } });
    const paidFines = await db.fine.count({ where: { status: 'paid' } });
    const contestedFines = await db.fine.count({ where: { status: 'contested' } });
    const cancelledFines = await db.fine.count({ where: { status: 'cancelled' } });
    
    // Receita total (multas pagas)
    const paidFinesData = await db.fine.findMany({
      where: { status: 'paid' },
      select: { amount: true }
    });
    const totalRevenue = paidFinesData.reduce((sum, fine) => sum + fine.amount, 0);
    
    // Receita pendente
    const pendingFinesData = await db.fine.findMany({
      where: { status: 'pending' },
      select: { amount: true }
    });
    const pendingRevenue = pendingFinesData.reduce((sum, fine) => sum + fine.amount, 0);
    
    // Taxa de cobrança
    const collectionRate = totalFines > 0 ? (paidFines / totalFines) * 100 : 0;
    
    // Multas por província
    const provinceStatsRaw = await db.fine.groupBy({
      by: ['province'],
      _count: { id: true },
      _sum: { amount: true }
    });
    
    const provinceStats = provinceStatsRaw.map(p => ({
      province: p.province,
      total: p._count.id,
      amount: p._sum.amount || 0
    })).sort((a, b) => b.total - a.total).slice(0, 8);
    
    // Multas recentes
    const recentFines = await db.fine.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { brand: true, model: true } }
      }
    });
    
    // Tendência mensal (últimos 6 meses)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const monthlyFines = await db.fine.findMany({
      where: {
        date: { gte: sixMonthsAgo }
      },
      select: {
        date: true,
        amount: true,
        status: true
      }
    });
    
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyTrend: { month: string; fines: number; revenue: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[monthDate.getMonth()];
      const monthFines = monthlyFines.filter(f => {
        const fineDate = new Date(f.date);
        return fineDate.getMonth() === monthDate.getMonth() && 
               fineDate.getFullYear() === monthDate.getFullYear();
      });
      
      monthlyTrend.push({
        month: monthName,
        fines: monthFines.length,
        revenue: monthFines.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0)
      });
    }
    
    // Tipos de infrações mais comuns
    const violationTypes = await db.fine.groupBy({
      by: ['violationCode', 'violationDescription'],
      _count: { id: true },
      _sum: { amount: true }
    });
    
    const topViolations = violationTypes
      .map(v => ({
        code: v.violationCode,
        description: v.violationDescription,
        count: v._count.id,
        amount: v._sum.amount || 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalVehicles,
      totalDrivers,
      totalFines,
      totalRevenue,
      pendingRevenue,
      pendingFines,
      paidFines,
      contestedFines,
      cancelledFines,
      collectionRate,
      provinceStats,
      recentFines,
      monthlyTrend,
      topViolations
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }
}
