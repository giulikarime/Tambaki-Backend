import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

jest.mock('../../generated/prisma/client', () => ({
  ServiceType: { Mesa: 'Mesa', Balcao: 'Balcao' },
  OrderStatus: { Aberta: 'Aberta', Fechada: 'Fechada', Paga: 'Paga' },
}));

describe('CreateOrderDto', () => {
  it('accepts a reservationId when validating reservation orders', async () => {
    const dto = plainToInstance(CreateOrderDto, {
      nameClient: 'Cliente',
      tableId: 5,
      reservationId: 8,
      service_type: 'Mesa',
    });

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors).toHaveLength(0);
  });
});
