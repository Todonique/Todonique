export type AdminRole = 'admin' | 'superadmin';

export type Admin = {
  user_id: number;
  name: string;
  email: string;
  role: AdminRole;
  created_at: Date;
  last_login: Date | null;
  is_active: boolean;
};

export type CreateAdmin = Omit<Admin, 'user_id' | 'created_at' | 'last_login'>;

export type UpdateAdmin = Partial<Omit<Admin, 'user_id' | 'created_at' | 'last_login'>>;

export type ReadAdmin = Admin;
