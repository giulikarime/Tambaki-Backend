import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AccessLevel,
  EmployType,
  PrismaClient,
  ReservationStatus,
  ShiftType,
  TableStatus
} from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL'],
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.user.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.storeUnit.deleteMany();

  // Lojas
  const storeData = {
    company_name: 'Doce Sabor LTDA',
    trade_name: 'Sabor & Cia',
    cnpj: '12345678000199',
    adress: 'Rua das Flores, 123, Centro',
    email: 'docesabor@email.com',
    phone: '11987654321',
  };

  const storeUnit = await prisma.storeUnit.create({
    data: storeData,
  });

  // Users
  const users = [
    {
      name: 'Carlos Silva',
      cpf: '12345678901',
      email: 'carlos.gerente@saborecia.com',
      phone: '11911112222',
      password: 'password_1',
      role: 'Gerente Geral',
      access_level: AccessLevel.Master,
      employ_type: EmployType.CLT,
      shift: ShiftType.Full_Time,
      hire_date: new Date('2023-01-15'),
      weekly_hours: 44,
      salary: 4500.00,
      bankName: 'Banco do Brasil',
      active: true,
    },
    {
      name: 'Ana Souza',
      cpf: '98765432100',
      email: 'ana.souza@saborecia.com',
      phone: '11933334444',
      password: 'password_2',
      role: 'Atendente',
      access_level: AccessLevel.Junior,
      employ_type: EmployType.CLT,
      shift: ShiftType.Noite,
      hire_date: new Date('2023-06-01'),
      weekly_hours: 36,
      salary: 2100.00,
      bankName: 'Nubank',
      active: true,
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        storeUnitId: storeUnit.id,
      },
    });
  }

  // mesas
  const table1 = await prisma.table.create({
    data: {
      table_number: 1,
      capacity: 4,
      status: TableStatus.Livre,
      unitId: storeUnit.id,
    },
  });

  const table2 = await prisma.table.create({
    data: {
      table_number: 2,
      capacity: 2,
      status: TableStatus.Livre,
      unitId: storeUnit.id,
    },
  });

  // reservas
  await prisma.reservation.createMany({
    data: [
      {
        name: 'Larissa Manoela',
        phone: '11987654321',
        quantityPeople: 4,
        startsAtDate: new Date('2026-09-10'),
        startsAtHours: new Date('1970-01-01T19:00:00Z'),
        endsAtDate: new Date('2026-09-10'),
        endsAtHours: new Date('1970-01-01T21:00:00Z'),
        status: ReservationStatus.Pendente,
        tableId: table1.id,
        unitId: storeUnit.id,
      },
      {
        name: 'João Guilherme',
        phone: '21976543210',
        quantityPeople: 2,
        startsAtDate: new Date('2026-09-10'),
        startsAtHours: new Date('1970-01-01T20:30:00Z'),
        endsAtDate: new Date('2026-09-10'),
        endsAtHours: new Date('1970-01-01T22:30:00Z'),
        status: ReservationStatus.Confirmada,
        tableId: table2.id,
        unitId: storeUnit.id,
      },
    ],
  });

  // Fornecedores
  await prisma.supplier.createMany({
    data: [
      {
        company_name: 'Peixe Nobre LTDA',
        trade_name: 'Peixe Nobre',
        cnpj: '12345678900',
        phone: '11988887777',
        email: 'contato@peixenobre.com',
        adress: 'Av. Amazonas, 500',
        businnes_hours: '08:00 às 18:00',
        resposible_name: 'Roberto Santos',
        payment_terms: '30 dias',
        lead_time_days: 3,
      },
      {
        company_name: 'Mercado Santa Luzia LTDA',
        trade_name: 'Mercado Santa Luzia',
        cnpj: '12345678000195',
        phone: '11987654321',
        email: 'pedidos@mercadosantaluzia.com.br',
        adress: 'Ceagesp - Av. Dr. Gastão Vidigal, 1946, Pavilhão M-10, Vila Leopoldina - São Paulo / SP',
        businnes_hours: 'Seg-Sáb: 04:00 às 14:00',
        resposible_name: 'Michael Jaylison',
        payment_terms: 'Semanal / 7 dias',
        lead_time_days: 1,
      },
      {
        company_name: 'Distribuidora de Bebidas Vale do Sol S.A.',
        trade_name: 'Vale do Sol Bebidas',
        cnpj: '98765432000110',
        phone: '1133445566',
        email: 'vendas@valedosolbebidas.com.br',
        adress: 'Av. Imperatriz Leopoldina, 800, Vila Leopoldina - São Paulo / SP',
        businnes_hours: 'Seg-Sex: 07:00 às 17:00',
        resposible_name: 'Stefanni Germanota',
        payment_terms: '14/28 dias',
        lead_time_days: 2,
      },
    ],
  });

  console.log(' Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });