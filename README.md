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
| `POST` | `/auth/register` | Cadastra um cliente/restaurante. Retorna `201 Created`. |
| `POST` | `/auth/login` | Autentica um usuário usando e-mail e senha. |
| `POST` | `/auth/logout` | Encerra a sessão do usuário. |

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
| `POST` | `/users` | Cadastra um funcionário/usuário. |
| `PATCH` | `/users/:id` | Atualiza os dados de um usuário. |
| `DELETE` | `/users/:id` | Exclui um usuário. |

O cadastro de usuário pode receber: `name`, `cpf`, `email`, `phone`, `password`, `role`, `active`, `access_level`, `employ_type`, `shift`, `hire_date`, `weekly_hours`, `salary`, `bankName` e `storeUnitId`.

### Produtos

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/products` | Cadastra um produto no estoque. Retorna `201 Created`. |
| `GET` | `/products` | Lista todos os produtos. |
| `GET` | `/products/:id` | Busca um produto pelo ID. |
| `PATCH` | `/products/:id` | Atualiza os dados de um produto. |
| `DELETE` | `/products/:id` | Exclui um produto. |

Os principais campos de produto são: `name`, `cost_price`, `category`, `brand`, `allergens`, `stock_quantity`, `unit_of_measure`, `current_stock`, `min_stock`, `max_stock`, `manufacture_date`, `expiration_date`, `available`, `storageLocation`, `status`, `batch`, `supplierId` e `unitId`.

### Cardápio

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/menu` | Cadastra um item no cardápio. Retorna `201 Created`. |
| `GET` | `/menu` | Lista todos os itens do cardápio. |
| `GET` | `/menu/:id` | Busca um item do cardápio pelo ID. |
| `PATCH` | `/menu/:id` | Atualiza um item do cardápio. |
| `DELETE` | `/menu/:id` | Exclui um item do cardápio. |

Os campos de criação são: `name`, `description`, `category`, `price`, `available` e `unitId`.

### Tags

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/tags` | Cadastra uma tag. Retorna `201 Created`. |
| `GET` | `/tags` | Lista todas as tags. |
| `PATCH` | `/tags/:id` | Atualiza uma tag. |
| `DELETE` | `/tags/:id` | Exclui uma tag. |

Para adicionar uma tag a um item do cardápio:

Use os IDs do item do cardápio e da tag já cadastrados:

```http
POST /menu/1/tags/1
```

Nesse exemplo, o primeiro `1` é o ID do item do cardápio e o segundo `1` é o ID da tag. Essa rota não precisa de corpo JSON.

Para consultar o item com suas tags, use `GET /menu/1`. Para remover a associação, use `DELETE /menu/1/tags/1`.

### Pedidos

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/orders` | Cria um pedido. Retorna `201 Created`. |
| `GET` | `/orders` | Lista todos os pedidos. |
| `GET` | `/orders/:id` | Busca um pedido pelo ID. |
| `PATCH` | `/orders/:id` | Atualiza o tipo, status ou mesa do pedido. |
| `POST` | `/orders/:id/items` | Adiciona um item a um pedido. Retorna `201 Created`. |
| `PATCH` | `/orders/:id/close` | Fecha um pedido. |
| `DELETE` | `/orders/:id` | Exclui um pedido e seus itens. |

Para criar um pedido, envie `tableId` e `service_type`; também podem ser enviados `status`, `total_value`, `unitId` e `menuId`. Para adicionar um item, envie `menuId` e `quantity`.

### Reservas

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/reservations` | Cria uma reserva. Retorna `201 Created`. |
| `GET` | `/reservations` | Lista todas as reservas. |
| `GET` | `/reservations/:id` | Busca uma reserva pelo ID. |
| `PATCH` | `/reservations/:id` | Atualiza os dados e o período da reserva. |
| `PATCH` | `/reservations/:id/cancel` | Cancela uma reserva. |
| `DELETE` | `/reservations/:id` | Exclui uma reserva. |

Os campos obrigatórios para criar uma reserva são `name`, `phone`, `quantityPeople`, `startsAt`, `endsAt` e `tableId`. `status` e `unitId` são opcionais.

### Mesas

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/tables` | Cadastra uma mesa. Retorna `201 Created`. |
| `GET` | `/tables` | Lista todas as mesas. |
| `GET` | `/tables/:id` | Busca uma mesa pelo ID. |
| `PATCH` | `/tables/:id` | Atualiza os dados de uma mesa. |
| `DELETE` | `/tables/:id` | Exclui uma mesa. |

Os campos de criação são `table_number`, `capacity`, `status` e `unitId`.

### Fornecedores

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/suppliers` | Cadastra um fornecedor. |
| `GET` | `/suppliers` | Lista todos os fornecedores. |
| `GET` | `/suppliers/:id` | Busca um fornecedor pelo ID. |
| `PATCH` | `/suppliers/:id` | Atualiza os dados de um fornecedor. |
| `DELETE` | `/suppliers/:id` | Exclui um fornecedor. |

Os campos de criação são: `company_name`, `trade_name`, `cnpj`, `phone`, `email`, `adress`, `businnes_hours`, `resposible_name`, `payment_terms` e `lead_time_days`.

## Frontend

O frontend React está disponível no repositório [Tambaki-Frontend](https://github.com/giulikarime/Tambaki-Frontend.git).

## Projeto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso do curso Técnico em Desenvolvimento de Sistemas - TDS03, do SENAI Mariano Ferraz, com conclusão prevista para 2026.

## Autores

- Laura S. Borges
- Júlia Resplandes
- Gabriele I. Sousa
- Rafael S. Pereira
- Giuliana K. Durães
