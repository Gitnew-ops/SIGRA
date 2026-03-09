'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatLargeNumber } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Car,
  Users,
  Download,
  Calendar,
  PieChart,
  LineChart,
} from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart as RechartsPie, Cell, ResponsiveContainer, Area, AreaChart, CartesianGrid, Line } from 'recharts';
import { ANGOLA_PROVINCES } from '@/types';

interface ReportData {
  totalVehicles: number;
  totalDrivers: number;
  totalFines: number;
  totalRevenue: number;
  pendingRevenue: number;
  pendingFines: number;
  paidFines: number;
  contestedFines: number;
  cancelledFines: number;
  collectionRate: number;
  provinceStats: { province: string; total: number; amount: number }[];
  monthlyTrend: { month: string; fines: number; revenue: number }[];
  topViolations: { code: string; description: string; count: number; amount: number }[];
}

const chartConfig = {
  fines: { label: "Multas", color: "#6366f1" },
  revenue: { label: "Receita", color: "#10b981" },
} satisfies ChartConfig;

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [province, setProvince] = useState('');

  useEffect(() => {
    fetchReportData();
  }, [period, province]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stats');
      const reportData = await response.json();
      setData(reportData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statusData = [
    { name: 'Pagas', value: data.paidFines, color: '#10b981' },
    { name: 'Pendentes', value: data.pendingFines, color: '#f59e0b' },
    { name: 'Contestadas', value: data.contestedFines, color: '#ec4899' },
    { name: 'Anuladas', value: data.cancelledFines, color: '#64748b' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Relatórios Analíticos</h1>
          <p className="text-muted-foreground mt-1">Análise estatística e relatórios do sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="quarter">Último Trimestre</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Receita Total</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(data.totalRevenue)}</p>
                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +7.2% vs período anterior
                </p>
              </div>
              <DollarSign className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Multas Pagas</p>
                <p className="text-2xl font-bold mt-1">{data.paidFines}</p>
                <p className="text-xs opacity-80 mt-1">{data.collectionRate.toFixed(1)}% taxa de cobrança</p>
              </div>
              <FileText className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pendente de Cobrança</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(data.pendingRevenue)}</p>
                <p className="text-xs opacity-80 mt-1">{data.pendingFines} multas pendentes</p>
              </div>
              <Calendar className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Multas</p>
                <p className="text-2xl font-bold mt-1">{data.totalFines}</p>
                <p className="text-xs opacity-80 mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" /> -2.5% vs período anterior
                </p>
              </div>
              <BarChart3 className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-600" />Tendência Mensal
            </CardTitle>
            <CardDescription>Multas e receita dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={data.monthlyTrend}>
                <defs>
                  <linearGradient id="colorFines" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area yAxisId="left" type="monotone" dataKey="fines" stroke="#6366f1" fillOpacity={1} fill="url(#colorFines)" name="Multas" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', strokeWidth: 2 }} name="Receita" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />Distribuição por Estado
            </CardTitle>
            <CardDescription>Status das multas registadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />Multas por Província
            </CardTitle>
            <CardDescription>Top 8 províncias com mais infrações</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={data.provinceStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis type="category" dataKey="province" stroke="#94a3b8" fontSize={10} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="total" fill="#6366f1" radius={[0, 4, 4, 0]} name="Multas" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />Infrações Mais Comuns
            </CardTitle>
            <CardDescription>Top 5 tipos de infrações</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Ocorrências</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topViolations.map((violation) => (
                  <TableRow key={violation.code}>
                    <TableCell><Badge variant="secondary">{violation.code}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate">{violation.description}</TableCell>
                    <TableCell className="text-center font-medium">{violation.count}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(violation.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
          <CardDescription>Visão geral do período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Car className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
              <p className="text-2xl font-bold">{data.totalVehicles}</p>
              <p className="text-sm text-muted-foreground">Veículos Registados</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold">{data.totalDrivers}</p>
              <p className="text-sm text-muted-foreground">Motoristas Registados</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold">{data.totalFines}</p>
              <p className="text-sm text-muted-foreground">Multas Emitidas</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <p className="text-2xl font-bold">{formatLargeNumber(data.totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Receita Total (Kz)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
