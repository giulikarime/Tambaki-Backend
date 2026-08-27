# Tambaki B2B — Backend

Backend do sistema **Tambaki**, uma aplicação completa de gerenciamento de restaurantes, desenvolvida como Trabalho de Conclusão de Curso (TCC) para o curso Técnico em Desenvolvimento de Sistemas — Turma TDS03, formandos de 2026, do SENAI Mariano Ferraz.

Este repositório contém apenas a **API REST**, construída com NestJS. O frontend (aplicação React) é mantido em um projeto separado.

## Funcionalidades

* Registro e gerenciamento de pedidos
* Análise de custos
* Gestão de estoque
* Abertura e fechamento de caixa
* Cadastro e autenticação de usuários

## Tecnologias Utilizadas

* NestJS
* Prisma ORM
* TypeScript
* RxJS

## Banco de Dados

* PostgreSQL

## Estrutura do Projeto

```
Tambaki-Backend/
│
├── prisma/
│   ├── migrations/                 # Migrações do banco de dados
│   │   ├── 20260818233958_init/
│   │   ├── 20260819222055_init/
│   │   ├── 20260820171029/
│   │   ├── 20260825194727/
│   │   ├── 20260827015624_init/
│   │   └── migration_lock.toml
│   ├── schema.prisma                # Esquema de dados (Prisma)
│   └── seed.ts                      # População inicial do banco de dados
│
├── src/
│   ├── auth/                        # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── login.dto.ts
│   │   └── register-client.dto.ts
│   ├── orders/                      # Módulo de pedidos
│   │   ├── add-order-item.dto.ts
│   │   ├── create-order.dto.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   ├── prisma/                      # Serviço de acesso ao Prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── products/                    # Módulo de produtos
│   │   ├── create-product.dto.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   ├── reservations/                # Módulo de reservas
│   │   ├── create-reservation.dto.ts
│   │   ├── reservations.controller.ts
│   │   ├── reservations.module.ts
│   │   └── reservations.service.ts
│   ├── tables/                      # Módulo de mesas
│   │   ├── create-table.dto.ts
│   │   ├── tables.controller.ts
│   │   ├── tables.module.ts
│   │   ├── tables.service.ts
│   │   └── update-table.dto.ts
│   ├── app.controller.ts
│   ├── app.module.ts                # Módulo principal da aplicação
│   ├── app.service.ts
│   └── main.ts                      # Ponto de entrada do NestJS
│
├── eslint.config.mjs               # Configuração do linter (ESLint)
├── nest-cli.json                   # Configuração da CLI do NestJS
├── package.json                    # Dependências e scripts do projeto
├── prisma.config.ts                # Configuração do Prisma
├── README.md
├── skills-lock.json
├── tsconfig.build.json
└── tsconfig.json
```

## Pré-requisitos

* Node.js instalado
* pgAdmin (PostgreSQL) instalado na máquina

## Como Executar o Projeto

1. Acesse a pasta do backend e instale as dependências:

```
cd nest-backend
npm install
```

2. Configure o arquivo `.env` de acordo com o modelo disponibilizado em `.env.example`.

3. Rode as migrações, gere o client do Prisma e popule o banco de dados:

```
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

4. Inicie o servidor em modo de desenvolvimento:

```
npm run start
```

O backend estará disponível em:

```
http://localhost:3000
```

## Variáveis de Ambiente

Antes de executar o projeto, configure o arquivo `.env` com base no modelo:

```
nest-backend/.env.example
```

## Autores

* Laura S. Borges
* Júlia Resplandes
* Gabriele I. Sousa
* Rafael S. Pereira
* Giuliana K. Durães

## Projeto Acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Desenvolvimento de Sistemas — TDS03, do SENAI Mariano Ferraz, com conclusão prevista para 2026.
