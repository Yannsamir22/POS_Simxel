export type AccessLevel = "manager" | "admin" | null;

export interface AuthState {
  isAuthenticated: boolean;
//   isConfigured: boolean | null;
  accessLevel: AccessLevel;
  isAdmin: boolean;
  user: string | null;
  loading: boolean;
}

export interface AuthActions {

  // setupSystem: (
  //   mainPassword: string,
  //   adminPassword: string
  // ) => Promise<{ success: boolean; error?: string }>;

  checkAuth: () => Promise<void>;

  loginAsManager: (data: {
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;

  loginAsAdmin: (data: {
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;

  managerLogout: () => Promise<void>;

  adminLogout: () => Promise<void>;

  changeAdminPassword: (
    oldPass: string,
    newPass: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export type AuthStore = AuthState & AuthActions;