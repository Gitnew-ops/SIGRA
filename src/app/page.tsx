'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Car,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

interface DashboardStats {
  totalVehicles: number;
  totalDrivers: number;
  totalFines: number;
  totalRevenue: number;
  pendingRevenue: number;
  pendingFines: number;
  paidFines: number;
  collectionRate: number;
}

const defaultStats: DashboardStats = {
  totalVehicles: 0,
  totalDrivers: 0,
  totalFines: 0,
  totalRevenue: 0,
  pendingRevenue: 0,
  pendingFines: 0,
  paidFines: 0,
  collectionRate: 0,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('AOA', 'Kz');
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    try {
      setError(false);
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setStats({ ...defaultStats, ...data });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const initDatabase = async () => {
    try {
      setLoading(true);
      await fetch('/api/seed');
      await fetchStats();
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao SIGRA - Sistema Integrado de Gestão Rodoviária de Angola
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="flex-1">
                <p className="font-medium">Banco de dados não configurado</p>
                <p className="text-sm text-muted-foreground">
                  Clique no botão abaixo para inicializar o banco de dados
                </p>
              </div>
              <Button onClick={initDatabase}>
                Inicializar Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Veículos */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Veículos</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? '...' : stats.totalVehicles.toLocaleString('pt-AO')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Car className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Motoristas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Motoristas Registados</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? '...' : stats.totalDrivers.toLocaleString('pt-AO')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Multas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Multas</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? '...' : stats.totalFines.toLocaleString('pt-AO')}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receita Total */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Receita Total</p>
                <p className="text-3xl font-bold mt-1">
                  {loading ? '...' : formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Multas Pendentes</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.pendingFines}</p>
                {stats.pendingRevenue > 0 && (
                  <p className="text-xs text-muted-foreground">{formatCurrency(stats.pendingRevenue)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Multas Pagas</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.paidFines}</p>
                {stats.totalFines > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {((stats.paidFines / stats.totalFines) * 100).toFixed(1)}% do total
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Cobrança</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.collectionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Navegue rapidamente pelas funcionalidades do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/vehicles">
                <Car className="w-5 h-5" />
                <span>Veículos</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/drivers">
                <Users className="w-5 h-5" />
                <span>Motoristas</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/fines">
                <FileText className="w-5 h-5" />
                <span>Multas</span>
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/reports">
                <BarChart3 className="w-5 h-5" />
                <span>Relatórios</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>SIGRA - Sistema Integrado de Gestão Rodoviária de Angola</p>
        <p className="text-xs mt-1">© {new Date().getFullYear()} Ministério do Interior - DNVT</p>
      </div>
    </div>
  );
}
