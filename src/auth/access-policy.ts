export type AccessLevel = 'Master' | 'Senior' | 'Pleno' | 'Junior';

export function canAccessRoute(
  level: AccessLevel,
  method: string,
  route: string,
  routeDetails: string[] = [],
): boolean {
  if (level === 'Master') return true;

  const readOnly = method === 'GET';
  switch (route) {
    case 'users':
      return level === 'Senior';
    case 'costs':
      return level === 'Senior' && readOnly;
    case 'cmv-planning':
      return level === 'Senior' && readOnly;
    case 'products':
      if (
        level === 'Junior' &&
        method === 'GET' &&
        routeDetails[0] === 'enums'
      ) {
        return true;
      }
      return level === 'Pleno';
    case 'product-lookups':
    case 'suppliers':
      return level === 'Pleno';
    case 'menu':
    case 'tags':
      return level === 'Junior' || (level === 'Pleno' && readOnly);
    case 'orders':
    case 'reservations':
    case 'tables':
      return (
        level === 'Junior' ||
        ((level === 'Senior' || level === 'Pleno') && readOnly)
      );
    case 'uploads':
      return true;
    default:
      return false;
  }
}
