# Tambaki B2B - Backend

API REST do sistema Tambaki, uma aplicação de gerenciamento de restaurantes desenvolvida com NestJS, Prisma e PostgreSQL.

## Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator

## Como executar

### Pré-requisitos

- Node.js
- PostgreSQL

### Instalação

```bash
npm install
```

Configure as variáveis de ambiente no arquivo `.env` e execute as migrações e o seed:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Inicie a API:

```bash
npm run start
```

A API fica disponível em `http://localhost:3000`.

## API

### Informações gerais

- URL base: `http://localhost:3000`
- Os identificadores `:id` são números inteiros.
- Os endpoints que recebem dados usam JSON no corpo da requisição.
- Rotas `PATCH` aceitam apenas os campos que serão alterados.
- Datas devem estar no formato ISO 8601, por exemplo: `2026-09-02T19:00:00.000Z`.

### Health check

| Método | Rota | O que faz |
| --- | --- | --- |
| `GET` | `/` | Retorna a mensagem inicial da API. |

### Autenticação

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/auth/register` | Registra um cliente/restaurante. |
| `POST` | `/auth/login` | Realiza autenticação com e-mail e senha. |
| `POST` | `/auth/logout` | Retorna a resposta de logout. |

Exemplo de login:

```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Usuários

| Método | Rota | O que faz |
| --- | --- | --- |
| `GET` | `/users` | Lista todos os usuários. |
| `POST` | `/users` | Cadastra um funcionário ou usuário. |
| `PATCH` | `/users/:id` | Atualiza os dados de um usuário. |
| `DELETE` | `/users/:id` | Exclui um usuário. |

Campos principais de cadastro/atualização: `name`, `cpf`, `email`, `phone`, `password`, `role`, `access_level`, `employ_type`, `shift`, `hire_date`, `weekly_hours`, `salary`, `bankName`, `active` e `storeUnitId`.

### Produtos

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/products` | Cria um produto. |
| `GET` | `/products` | Lista todos os produtos. |
| `GET` | `/products/:id` | Busca um produto pelo ID. |
| `GET` | `/products/enums` | Lista os valores disponíveis de enums do produto. |
| `PATCH` | `/products/:id` | Atualiza um produto. |
| `DELETE` | `/products/:id` | Exclui um produto. |
| `PATCH` | `/products/:id/write-off` | Realiza baixa de estoque de um produto. |

Campos principais: `name`, `cost_price`, `category`, `brand`, `allergens`, `stock_quantity`, `unit_of_product`, `measure_unit_of_product`, `unit_of_measure`, `document_url`, `min_stock`, `max_stock`, `manufacture_date`, `expiration_date`, `storageLocation`, `status`, `batch`, `supplierId` e `unitId`.

### Cardápio

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/menu` | Cria um item do cardápio. |
| `GET` | `/menu` | Lista todos os itens do cardápio. |
| `GET` | `/menu/:id` | Busca um item do cardápio. |
| `PATCH` | `/menu/:id` | Atualiza um item do cardápio. |
| `DELETE` | `/menu/:id` | Exclui um item do cardápio. |
| `POST` | `/menu/:id/tags/:tagId` | Associa uma tag ao item do cardápio. |
| `DELETE` | `/menu/:id/tags/:tagId` | Remove a associação da tag. |

Campos principais: `name`, `description`, `category`, `price`, `img`, `available` e `unitId`.

### Tags

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/tags` | Cria uma tag. |
| `GET` | `/tags` | Lista todas as tags. |
| `PATCH` | `/tags/:id` | Atualiza uma tag. |
| `DELETE` | `/tags/:id` | Exclui uma tag. |

### Pedidos

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/orders` | Cria um pedido. |
| `GET` | `/orders` | Lista todos os pedidos. |
| `GET` | `/orders/:id` | Busca um pedido pelo ID. |
| `PATCH` | `/orders/:id` | Atualiza um pedido. |
| `POST` | `/orders/:id/items` | Adiciona um item ao pedido. |
| `PATCH` | `/orders/:id/close` | Fecha um pedido. |
| `DELETE` | `/orders/:id` | Exclui um pedido. |

Para criar um pedido, geralmente são enviados `tableId`, `service_type`, `nameClient`, `unitId` e, opcionalmente, `status`, `total_value` e `menuId`. Para adicionar um item, enviam-se `menuId` e `quantity`.

### Reservas

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/reservations` | Cria uma reserva. |
| `GET` | `/reservations` | Lista todas as reservas. |
| `GET` | `/reservations/:id` | Busca uma reserva. |
| `PATCH` | `/reservations/:id` | Atualiza uma reserva. |
| `PATCH` | `/reservations/:id/cancel` | Cancela uma reserva. |
| `DELETE` | `/reservations/:id` | Exclui uma reserva. |

Campos principais: `name`, `phone`, `quantityPeople`, `startsAtDate`, `startsAtHours`, `endsAtDate`, `endsAtHours`, `tableId` e `unitId`.

### Mesas

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/tables` | Cadastra uma mesa. |
| `GET` | `/tables` | Lista todas as mesas. |
| `GET` | `/tables/:id` | Busca uma mesa pelo ID. |
| `PATCH` | `/tables/:id` | Atualiza uma mesa. |
| `DELETE` | `/tables/:id` | Exclui uma mesa. |

Campos principais: `table_number`, `capacity`, `status` e `unitId`.

### Fornecedores

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/suppliers` | Cadastra um fornecedor. |
| `GET` | `/suppliers` | Lista todos os fornecedores. |
| `GET` | `/suppliers/:id` | Busca um fornecedor pelo ID. |
| `PATCH` | `/suppliers/:id` | Atualiza um fornecedor. |
| `DELETE` | `/suppliers/:id` | Exclui um fornecedor. |

Campos principais: `company_name`, `trade_name`, `cnpj`, `phone`, `email`, `adress`, `businnes_hours`, `resposible_name`, `payment_terms` e `lead_time_days`.

### Notificações

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/notifications` | Cria uma notificação. |
| `GET` | `/notifications` | Lista notificações. |
| `GET` | `/notifications/:id` | Busca uma notificação pelo ID. |
| `PATCH` | `/notifications/:id/read` | Marca a notificação como lida. |
| `DELETE` | `/notifications/:id` | Exclui uma notificação. |


### Upload de arquivos

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/uploads` | Faz upload de um arquivo e retorna a URL pública. |

O upload salva o arquivo em `./uploads` e retorna um endereço no formato `http://localhost:3000/uploads/<nome-do-arquivo>`.

## Frontend

O frontend correspondente está disponível em: [Tambaki-Frontend](https://github.com/giulikarime/Tambaki-Frontend.git).

## Projeto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso do curso Técnico em Desenvolvimento de Sistemas - TDS03, do SENAI Mariano Ferraz, com conclusão prevista para 2026.

## Autores

- Laura S. Borges
- Júlia Resplandes
- Gabriele I. Sousa
- Rafael S. Pereira
- Giuliana K. Durães
