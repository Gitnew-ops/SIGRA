// SIGRA - Tipos TypeScript

export type UserRole = 'developer' | 'admin' | 'manager' | 'agent' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  province?: string;
  municipality?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  ownerId: string;
  ownerName: string;
  province: string;
  municipality: string;
  status: 'active' | 'suspended' | 'stolen';
  documents: VehicleDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  type: 'insurance' | 'inspection' | 'registration';
  number: string;
  issueDate: string;
  expiryDate: string;
  valid: boolean;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  points: number;
  phone: string;
  email?: string;
  province: string;
  municipality: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fine {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId?: string;
  driverName?: string;
  driverUserId?: string;
  agentId?: string;
  agentName?: string;
  violationCode: string;
  violationDescription: string;
  category: string;
  amount: number;
  location: string;
  province: string;
  municipality: string;
  status: 'pending' | 'paid' | 'contested' | 'cancelled';
  points: number;
  date: Date;
  dueDate: Date;
  paymentDate?: Date;
  paymentReference?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  fineId: string;
  userId?: string;
  amount: number;
  method: 'multicaixa' | 'transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MunicipalityStats {
  id: string;
  name: string;
  province: string;
  totalFines: number;
  totalAmount: number;
  pendingFines: number;
  paidFines: number;
  contestedFines: number;
  fatalAccidents: number;
  seriousAccidents: number;
  minorAccidents: number;
  propertyDamage: number;
}

export interface DashboardStats {
  totalVehicles: number;
  totalDrivers: number;
  totalFines: number;
  totalRevenue: number;
  pendingFines: number;
  paidFines: number;
  contestedFines: number;
  cancelledFines: number;
  collectionRate: number;
  provinceStats: ProvinceStat[];
  recentFines: Fine[];
  monthlyTrend: MonthlyTrend[];
}

export interface ProvinceStat {
  province: string;
  total: number;
  amount: number;
}

export interface MonthlyTrend {
  month: string;
  fines: number;
  revenue: number;
}

// 18 Províncias de Angola
export const ANGOLA_PROVINCES = [
  'Luanda',
  'Huíla',
  'Benguela',
  'Huambo',
  'Bié',
  'Cuanza Sul',
  'Uíge',
  'Malanje',
  'Cabinda',
  'Zaire',
  'Cunene',
  'Namibe',
  'Cuando Cubango',
  'Moxico',
  'Lunda Sul',
  'Lunda Norte',
  'Bengo',
  'Cuanza Norte'
] as const;

// Tipos de Infrações
export const VIOLATION_TYPES = [
  { code: 'ART-001', description: 'Excesso de velocidade até 20 km/h', category: 'Velocidade', amount: 15000, points: 2 },
  { code: 'ART-002', description: 'Excesso de velocidade acima de 20 km/h', category: 'Velocidade', amount: 30000, points: 4 },
  { code: 'ART-003', description: 'Passagem de sinal vermelho', category: 'Sinalização', amount: 25000, points: 3 },
  { code: 'ART-004', description: 'Condução sob influência de álcool', category: 'Perigo', amount: 100000, points: 6 },
  { code: 'ART-005', description: 'Não uso do cinto de segurança', category: 'Segurança', amount: 7500, points: 1 },
  { code: 'ART-006', description: 'Estacionamento em local proibido', category: 'Estacionamento', amount: 5000, points: 1 },
  { code: 'ART-007', description: 'Ultrapassagem em local proibido', category: 'Perigo', amount: 20000, points: 3 },
  { code: 'ART-008', description: 'Condução sem carta de condução', category: 'Documentação', amount: 50000, points: 5 },
  { code: 'ART-009', description: 'Veículo sem seguro válido', category: 'Documentação', amount: 35000, points: 3 },
  { code: 'ART-010', description: 'Uso de telemóvel durante condução', category: 'Perigo', amount: 10000, points: 2 },
] as const;
