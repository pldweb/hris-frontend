import { useAuthStore } from '@/stores/auth';

export const can = permission => {
  const authStore = useAuthStore();

  if (authStore.user?.roles?.includes('superadmin')) {
    return true;
  }

  const userPermissions = authStore.user?.permissions || [];

  return userPermissions.includes(permission);
};

export const canOneOf = permissions => {
  const authStore = useAuthStore();

  if (authStore.user?.roles?.includes('superadmin')) {
    return true;
  }

  const userPermissions = authStore.user?.permissions || [];

  if (!permissions || permissions.length === 0) {
    return false;
  }

  return permissions.some(permission => userPermissions.includes(permission));
};
