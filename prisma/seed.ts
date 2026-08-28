import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AcessLevel,
  EmployType,
  PrismaClient,
  ShiftType,
  TableStatus
} from '../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL'],
});
const prisma = new PrismaClient({ adapter });

async function main() {

  const storeData = {
      company_name: 'Doce Sabor LTDA',
      trade_name: 'Sabor & Cia',
      cnpj: '12345678000199',
      adress: 'Rua das Flores, 123, Centro',
      email: 'docesabor@email.com',
      phone: '11987654321',
  };

  const storeUnit = await prisma.storeUnit.upsert({
    where: {
      company_name_cnpj: {
        company_name: storeData.company_name,
        cnpj: storeData.cnpj,
      },
    },
    update: storeData,
    create: storeData,
  });

  const users = [
    {
            name: 'Carlos Silva',
            cpf: '12345678901',
            email: 'carlos.gerente@saborecia.com',
            phone: '11911112222',
            password: 'password_1', 
            role: 'Gerente Geral',
            acess_level: AcessLevel.Master, 
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
            acess_level: AcessLevel.Junior, 
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

    await prisma.user.upsert({
      where: {
        email_cpf: {
          email: user.email,
          cpf: user.cpf,
        },
      },
      update: { ...user, password: hashedPassword, storeUnitId: storeUnit.id },
      create: { ...user, password: hashedPassword, storeUnitId: storeUnit.id },
    });
  }

    const table = await prisma.table.upsert({
    where: { id: 1 },
    update: {
      table_number: 1,
      capacity: 4,
      status: TableStatus.Livre,
      unitId: storeUnit.id,
    },
    create: {
      id: 1,
      table_number: 1,
      capacity: 4,
      status: TableStatus.Livre,
      unitId: storeUnit.id,
    },
  });

  await prisma.reservation.deleteMany();
  await prisma.reservation.createMany({
    data: [
      {
        name: 'João Guilherme',
        phone: '11987654321',
        quantityPeople: 4,
        startsAt: new Date('2023-10-15T19:00:00Z'),
        status: 'Pendente',
        tableId: table.id,
        unitId: storeUnit.id,
      },  
      {
        name: 'Larissa Manoela',
        phone: '11912345678',
        quantityPeople: 2, 
        startsAt: new Date('2023-10-16T18:30:00Z'),
        status: 'Confirmada',
        tableId: table.id,
        unitId: storeUnit.id,
      },

    ]
  });

  console.log(' Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });