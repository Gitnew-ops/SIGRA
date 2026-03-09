import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import type { User, Vehicle, Driver, Fine } from '@prisma/client';

// Províncias de Angola com municípios
const PROVINCES_MUNICIPALITIES: Record<string, string[]> = {
  'Luanda': ['Belas', 'Cacuaco', 'Cazenga', 'Luanda', 'Talatona', 'Viana'],
  'Huíla': ['Lubango', 'Caconda', 'Caluquembe', 'Chibia', 'Gambos'],
  'Benguela': ['Benguela', 'Lobito', 'Catumbela', 'Baía Farta', 'Cubal'],
  'Huambo': ['Huambo', 'Caála', 'Bailundo', 'Londuimbali', 'Longonjo'],
  'Bié': ['Kuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar'],
  'Cuanza Sul': ['Sumbe', 'Porto Amboim', 'Amboim', 'Gabela', 'Libolo'],
  'Uíge': ['Uíge', 'Negage', 'Damba', 'Mucaba', 'Sanza Pombo'],
  'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cangandala', 'Quela'],
  'Cabinda': ['Cabinda', 'Belize', 'Buco-Zau', 'Cacongo'],
  'Zaire': ['Soio', 'Mabanza Congo', 'Tomboco', 'Nezeto'],
  'Cunene': ['Ondjiva', 'Cahama', 'Cuanhama', 'Cuvelai'],
  'Namibe': ['Moçâmedes', 'Tômbwa', 'Bibala', 'Camucuio'],
  'Cuando Cubango': ['Menongue', 'Cuito Cuanavale', 'Mavinga', 'Dirico'],
  'Moxico': ['Luena', 'Camanongue', 'Léua', 'Luau'],
  'Lunda Sul': ['Saurimo', 'Cacolo', 'Dala', 'Muconda'],
  'Lunda Norte': ['Lucapa', 'Dundo', 'Chitato', 'Cuango'],
  'Bengo': ['Caxito', 'Dande', 'Nambuangongo', 'Ambriz'],
  'Cuanza Norte': ['Ndalatando', 'Golungo Alto', 'Cambambe', 'Banga']
};

const BRANDS_MODELS: Record<string, string[]> = {
  'Toyota': ['Hilux', 'Corolla', 'Land Cruiser', 'RAV4', 'Fortuner'],
  'Hyundai': ['Tucson', 'Accent', 'Elantra', 'Santa Fe', 'i20'],
  'Mercedes': ['C-Class', 'E-Class', 'Sprinter', 'GLA', 'GLC'],
  'BMW': ['Série 3', 'Série 5', 'X3', 'X5', 'X1'],
  'Ford': ['Ranger', 'Focus', 'EcoSport', 'Fiesta', 'Territory'],
  'Volkswagen': ['Golf', 'Polo', 'Tiguan', 'Passat', 'Amarok'],
  'Nissan': ['X-Trail', 'Navara', 'Qashqai', 'Sentra', 'Frontier'],
  'Kia': ['Sportage', 'Cerato', 'Sorento', 'Rio', 'Picanto'],
  'Honda': ['CR-V', 'Civic', 'HR-V', 'Fit', 'Accord'],
  'Mitsubishi': ['Pajero', 'L200', 'ASX', 'Outlander', 'Mirage']
};

const COLORS = ['Branco', 'Preto', 'Prata', 'Cinza', 'Azul', 'Vermelho', 'Verde', 'Bege'];
const CATEGORIES = ['A', 'B', 'C', 'D', 'E'];
const VIOLATIONS = [
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
];

const FIRST_NAMES = ['António', 'Maria', 'João', 'Ana', 'José', 'Fernanda', 'Pedro', 'Lucia', 'Manuel', 'Catarina', 'Francisco', 'Rosa', 'Carlos', 'Helena', 'Paulo', 'Isabel', 'Miguel', 'Teresa', 'Luís', 'Sandra'];
const LAST_NAMES = ['Silva', 'Santos', 'Fernandes', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Almeida', 'Mendes', 'Gomes', 'Araújo', 'Ferreira', 'Carvalho', 'Nunes', 'Ribeiro', 'Dias', 'Moreira', 'Lopes', 'Teixeira'];

function randomItem<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePlate(province: string): string {
  const prefixes: Record<string, string> = {
    'Luanda': 'LA', 'Huíla': 'HL', 'Benguela': 'BG', 'Huambo': 'HO',
    'Bié': 'BI', 'Cuanza Sul': 'CS', 'Uíge': 'UG', 'Malanje': 'MA',
    'Cabinda': 'CB', 'Zaire': 'ZA', 'Cunene': 'CU', 'Namibe': 'NM',
    'Cuando Cubango': 'CC', 'Moxico': 'MO', 'Lunda Sul': 'LS',
    'Lunda Norte': 'LN', 'Bengo': 'BE', 'Cuanza Norte': 'CN'
  };
  const prefix = prefixes[province] || 'AN';
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(Math.random() * 90) + 10;
  return `${prefix}-${letters}-${numbers}`;
}

function generateLicenseNumber(): string {
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numbers = Math.floor(Math.random() * 9000000) + 1000000;
  return `${letters}${numbers}`;
}

function generatePhone(): string {
  const prefixes = ['923', '924', '925', '926', '927', '928', '929'];
  return `+244 ${randomItem(prefixes)} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`;
}

// GET /api/seed - Gerar dados de exemplo
export async function GET() {
  try {
    console.log('Starting seed...');
    
    // Limpar dados existentes
    await db.payment.deleteMany().catch(() => {});
    await db.fine.deleteMany().catch(() => {});
    await db.vehicleDocument.deleteMany().catch(() => {});
    await db.vehicle.deleteMany().catch(() => {});
    await db.driver.deleteMany().catch(() => {});
    await db.user.deleteMany().catch(() => {});
    
    console.log('Dados antigos removidos');

    // Criar utilizadores
    const users: User[] = [];
    
    try {
      const admin = await db.user.create({
        data: { email: 'admin@sigra.ao', name: 'Administrador SIGRA', role: 'admin', phone: '+244 923 456 789' }
      });
      users.push(admin);
    } catch {
      console.log('Admin user already exists');
      const existing = await db.user.findUnique({ where: { email: 'admin@sigra.ao' } });
      if (existing) users.push(existing);
    }
    
    try {
      const manager = await db.user.create({
        data: { email: 'manager@luanda.ao', name: 'Gestor Luanda', role: 'manager', province: 'Luanda', phone: '+244 924 567 890' }
      });
      users.push(manager);
    } catch {
      console.log('Manager user already exists');
    }
    
    try {
      const agent = await db.user.create({
        data: { email: 'agent@dnvt.ao', name: 'Agente Paulo Dias', role: 'agent', province: 'Luanda', phone: '+244 925 678 901' }
      });
      users.push(agent);
    } catch {
      console.log('Agent user already exists');
    }

    console.log(`Created ${users.length} users`);

    // Criar veículos (100 veículos para demonstração)
    const vehicles: Vehicle[] = [];
    const provinces = Object.keys(PROVINCES_MUNICIPALITIES);
    
    for (let i = 0; i < 100; i++) {
      const province = randomItem(provinces);
      const municipality = randomItem(PROVINCES_MUNICIPALITIES[province]);
      const brand = randomItem(Object.keys(BRANDS_MODELS));
      const model = randomItem(BRANDS_MODELS[brand]);
      const ownerName = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
      
      try {
        const vehicle = await db.vehicle.create({
          data: {
            plate: generatePlate(province),
            brand,
            model,
            year: Math.floor(Math.random() * 15) + 2010,
            color: randomItem(COLORS),
            ownerId: users[0]?.id || 'default',
            ownerName,
            province,
            municipality,
            status: 'active'
          }
        });
        vehicles.push(vehicle);
      } catch {
        // Skip duplicate plates
      }
    }

    console.log(`Created ${vehicles.length} vehicles`);

    // Criar motoristas (100 motoristas)
    const drivers: Driver[] = [];
    for (let i = 0; i < 100; i++) {
      const province = randomItem(provinces);
      const municipality = randomItem(PROVINCES_MUNICIPALITIES[province]);
      const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
      
      const licenseExpiry = new Date();
      licenseExpiry.setFullYear(licenseExpiry.getFullYear() + Math.floor(Math.random() * 5));
      
      try {
        const driver = await db.driver.create({
          data: {
            name,
            licenseNumber: generateLicenseNumber(),
            licenseCategory: randomItem(CATEGORIES),
            licenseExpiry: licenseExpiry.toISOString().split('T')[0],
            points: Math.floor(Math.random() * 20),
            phone: generatePhone(),
            province,
            municipality
          }
        });
        drivers.push(driver);
      } catch {
        // Skip duplicate licenses
      }
    }

    console.log(`Created ${drivers.length} drivers`);

    // Criar multas (200 multas)
    const fines: Fine[] = [];
    const statuses = ['pending', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'paid', 'contested', 'cancelled'];
    
    for (let i = 0; i < 200; i++) {
      if (vehicles.length === 0 || drivers.length === 0) break;
      
      const vehicle = randomItem(vehicles);
      const driver = randomItem(drivers);
      const violation = randomItem(VIOLATIONS);
      const status = randomItem(statuses) as 'pending' | 'paid' | 'contested' | 'cancelled';
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      const dueDate = new Date(date);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const paymentReference = `MULT${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      try {
        const fine = await db.fine.create({
          data: {
            vehicleId: vehicle.id,
            vehiclePlate: vehicle.plate,
            driverId: driver.id,
            driverName: driver.name,
            agentId: users[2]?.id || null,
            agentName: users[2]?.name || 'Sistema',
            violationCode: violation.code,
            violationDescription: violation.description,
            category: violation.category,
            amount: violation.amount,
            location: `Estrada Nacional, ${vehicle.municipality}`,
            province: vehicle.province,
            municipality: vehicle.municipality,
            status,
            points: violation.points,
            date,
            dueDate,
            paymentDate: status === 'paid' ? new Date(date.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
            paymentReference
          }
        });
        fines.push(fine);
      } catch (e) {
        console.log('Error creating fine:', e);
      }
    }

    console.log(`Created ${fines.length} fines`);

    // Criar pagamentos para multas pagas
    const paidFines = fines.filter(f => f.status === 'paid');
    let paymentCount = 0;
    for (const fine of paidFines) {
      try {
        await db.payment.create({
          data: {
            fineId: fine.id,
            userId: users[0]?.id || null,
            amount: fine.amount,
            method: randomItem(['multicaixa', 'transfer', 'cash'] as const),
            status: 'completed',
            reference: `PAY${Date.now().toString().slice(-8)}`,
            date: fine.paymentDate || new Date()
          }
        });
        paymentCount++;
      } catch (e) {
        console.log('Error creating payment:', e);
      }
    }

    console.log(`Created ${paymentCount} payments`);

    // Criar notificações de exemplo
    const notificationTypes = [
      { type: 'fine_created', title: 'Nova Multa Registada', message: 'Foi registada uma nova multa para o veículo LA-AB-12 no valor de Kz 25.000,00' },
      { type: 'fine_paid', title: 'Pagamento Confirmado', message: 'O pagamento da multa MULT123456 foi confirmado com sucesso.' },
      { type: 'payment_reminder', title: 'Lembrete de Pagamento', message: 'A multa MULT789012 vence em 5 dias. Valor: Kz 15.000,00' },
      { type: 'system_alert', title: 'Sistema Atualizado', message: 'O SIGRA foi atualizado para a versão 2.0 com novas funcionalidades.' },
    ];

    let notificationCount = 0;
    for (const notif of notificationTypes) {
      try {
        await db.notification.create({
          data: {
            userId: users[0]?.id || null,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            channel: 'in_app',
            status: 'sent',
            sentAt: new Date()
          }
        });
        notificationCount++;
      } catch (e) {
        console.log('Error creating notification:', e);
      }
    }

    console.log(`Created ${notificationCount} notifications`);

    return NextResponse.json({
      success: true,
      message: 'Dados de exemplo criados com sucesso!',
      stats: {
        users: users.length,
        vehicles: vehicles.length,
        drivers: drivers.length,
        fines: fines.length,
        payments: paymentCount,
        notifications: notificationCount
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      error: 'Erro ao criar dados de exemplo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
