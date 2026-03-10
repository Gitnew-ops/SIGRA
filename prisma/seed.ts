import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.notification.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fine.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.report.deleteMany();
  await prisma.municipalityStats.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const user1 = await prisma.user.create({
    data: {
      email: "admin@sigra.ao",
      name: "Administrador",
      phone: "+244923456789",
      role: "admin",
      province: "Luanda",
      municipality: "Luanda",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "agent@sigra.ao",
      name: "Agente de Trânsito",
      phone: "+244923456790",
      role: "agent",
      province: "Luanda",
      municipality: "Luanda",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: "driver@sigra.ao",
      name: "Motorista",
      phone: "+244923456791",
      role: "driver",
      province: "Luanda",
      municipality: "Luanda",
    },
  });

  // Criar motoristas
  const drivers = [];
  for (let i = 1; i <= 100; i++) {
    const driver = await prisma.driver.create({
      data: {
        name: `Motorista ${i}`,
        licenseNumber: `AO${String(i).padStart(6, "0")}`,
        licenseCategory: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
        licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        points: Math.floor(Math.random() * 12),
        phone: `+244923${String(i).padStart(6, "0")}`,
        province: "Luanda",
        municipality: "Luanda",
      },
    });
    drivers.push(driver);
  }

  // Criar veículos
  const vehicles = [];
  const brands = ["Toyota", "Honda", "Volkswagen", "Ford", "Hyundai"];
  const colors = ["Preto", "Branco", "Cinzento", "Azul", "Vermelho"];

  for (let i = 1; i <= 100; i++) {
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: `AO-${String(i).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: `Modelo ${i}`,
        year: 2020 + Math.floor(Math.random() * 4),
        color: colors[Math.floor(Math.random() * colors.length)],
        ownerId: user1.id,
        ownerName: user1.name,
        province: "Luanda",
        municipality: "Luanda",
        status: "active",
      },
    });
    vehicles.push(vehicle);
  }

  // Criar multas
  const violations = [
    { code: "V001", desc: "Excesso de velocidade" },
    { code: "V002", desc: "Estacionamento proibido" },
    { code: "V003", desc: "Semáforo vermelho" },
    { code: "V004", desc: "Falta de documentação" },
    { code: "V005", desc: "Condutor sem licença" },
  ];

  for (let i = 1; i <= 200; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const violation =
      violations[Math.floor(Math.random() * violations.length)];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await prisma.fine.create({
      data: {
        vehicleId: vehicle.id,
        vehiclePlate: vehicle.plate,
        driverId: driver.id,
        driverName: driver.name,
        driverUserId: user3.id,
        agentId: user2.id,
        agentName: user2.name,
        violationCode: violation.code,
        violationDescription: violation.desc,
        category: "traffic",
        amount: 5000 + Math.random() * 15000,
        location: "Luanda",
        province: "Luanda",
        municipality: "Luanda",
        status: Math.random() > 0.5 ? "paid" : "pending",
        points: Math.floor(Math.random() * 12),
        dueDate,
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
  console.log("📊 Dados criados:");
  console.log(`   - 3 Utilizadores`);
  console.log(`   - 100 Motoristas`);
  console.log(`   - 100 Veículos`);
  console.log(`   - 200 Multas`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });