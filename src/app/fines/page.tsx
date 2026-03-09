'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  CreditCard,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  XCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { ANGOLA_PROVINCES, VIOLATION_TYPES } from '@/types';

interface Fine {
  id: string;
  vehiclePlate: string;
  driverName: string;
  agentName: string;
  violationCode: string;
  violationDescription: string;
  category: string;
  amount: number;
  location: string;
  province: string;
  municipality: string;
  status: string;
  points: number;
  date: string;
  dueDate: string;
  paymentDate?: string;
  paymentReference?: string;
  vehicle?: { brand: string; model: string; color: string };
}

export default function FinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchFines();
  }, [page, provinceFilter, statusFilter]);

  const fetchFines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(provinceFilter && { province: provinceFilter }),
        ...(statusFilter && { status: statusFilter }),
      });
      const response = await fetch(`/api/fines?${params}`);
      const data = await response.json();
      setFines(data.fines || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching fines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchFines();
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', text: 'Pendente', icon: <Clock className="w-3 h-3 mr-1" /> },
      paid: { bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', text: 'Paga', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
      contested: { bg: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', text: 'Contestada', icon: <AlertCircle className="w-3 h-3 mr-1" /> },
      cancelled: { bg: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400', text: 'Anulada', icon: <XCircle className="w-3 h-3 mr-1" /> },
    };
    const { bg, text, icon } = config[status] || config.pending;
    return (
      <Badge className={`${bg} flex items-center`}>
        {icon}
        {text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestão de Multas</h1>
          <p className="text-muted-foreground mt-1">Gerir infrações e pagamentos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />Nova Multa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Aplicar Nova Multa</DialogTitle>
              <DialogDescription>Preencha os dados da infração</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Matrícula</Label>
                  <Input placeholder="LD-AB-12" className="uppercase" />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Condutor</Label>
                  <Input placeholder="Nome completo" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Infração</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecionar infração" /></SelectTrigger>
                  <SelectContent>
                    {VIOLATION_TYPES.map((v) => (
                      <SelectItem key={v.code} value={v.code}>
                        {v.code} - {v.description} ({formatCurrency(v.amount)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Província</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      {ANGOLA_PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Município</Label>
                  <Input placeholder="Município" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Local da Infração</Label>
                <Input placeholder="Endereço ou referência" />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Notas adicionais..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Aplicar Multa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por matrícula, condutor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
            <Select value={provinceFilter} onValueChange={setProvinceFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Província" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {ANGOLA_PROVINCES.slice(0, 10).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="contested">Contestado</SelectItem>
                <SelectItem value="cancelled">Anulado</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="w-4 h-4 mr-2" />Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-muted-foreground">A carregar...</p>
            </div>
          ) : fines.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma multa encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead className="hidden md:table-cell">Infração</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Local</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(fine.date)}</p>
                        <p className="text-xs text-muted-foreground">{fine.violationCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{fine.vehiclePlate}</p>
                        {fine.vehicle && (
                          <p className="text-xs text-muted-foreground">{fine.vehicle.brand} {fine.vehicle.model}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[200px]">
                        <p className="truncate">{fine.violationDescription}</p>
                        {fine.points > 0 && <p className="text-xs text-amber-600">{fine.points} pontos</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold">{formatCurrency(fine.amount)}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="max-w-[150px]">
                        <p className="truncate text-sm">{fine.location}</p>
                        <p className="text-xs text-muted-foreground">{fine.municipality}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(fine.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Ver Detalhes</DropdownMenuItem>
                          {fine.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem><DollarSign className="w-4 h-4 mr-2" />Registar Pagamento</DropdownMenuItem>
                            </>
                          )}
                          {fine.status === 'pending' && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600"><XCircle className="w-4 h-4 mr-2" />Anular Multa</DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Página {page} de {totalPages}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
            <ChevronLeft className="w-4 h-4" />Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
            Próximo<ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
