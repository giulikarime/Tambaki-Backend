import { canAccessRoute } from './access-policy';

describe('canAccessRoute', () => {
  it('grants Master unrestricted access', () => {
    expect(canAccessRoute('Master', 'DELETE', 'audit-logs')).toBe(true);
    expect(canAccessRoute('Master', 'POST', 'costs')).toBe(true);
  });

  it('limits Senior to user CRUD and read-only finance and home', () => {
    expect(canAccessRoute('Senior', 'PATCH', 'users')).toBe(true);
    expect(canAccessRoute('Senior', 'GET', 'costs')).toBe(true);
    expect(canAccessRoute('Senior', 'POST', 'costs')).toBe(false);
    expect(canAccessRoute('Senior', 'GET', 'orders')).toBe(true);
    expect(canAccessRoute('Senior', 'POST', 'orders')).toBe(false);
  });

  it('limits Pleno to stock and suppliers CRUD, with read-only menu and home', () => {
    expect(canAccessRoute('Pleno', 'PATCH', 'products')).toBe(true);
    expect(canAccessRoute('Pleno', 'DELETE', 'suppliers')).toBe(true);
    expect(canAccessRoute('Pleno', 'GET', 'menu')).toBe(true);
    expect(canAccessRoute('Pleno', 'POST', 'menu')).toBe(false);
    expect(canAccessRoute('Pleno', 'GET', 'tables')).toBe(true);
    expect(canAccessRoute('Pleno', 'PATCH', 'tables')).toBe(false);
  });

  it('limits Junior CRUD to menu and home', () => {
    expect(canAccessRoute('Junior', 'POST', 'menu')).toBe(true);
    expect(canAccessRoute('Junior', 'DELETE', 'tables')).toBe(true);
    expect(canAccessRoute('Junior', 'GET', 'products', ['enums'])).toBe(true);
    expect(canAccessRoute('Junior', 'GET', 'costs')).toBe(false);
    expect(canAccessRoute('Junior', 'GET', 'users')).toBe(false);
    expect(canAccessRoute('Junior', 'GET', 'notifications')).toBe(false);
  });
});
