/** Standard API error item (validation) */
export type ApiErrorItem = {
  field: string;
  message: string;
};

/** Parsed failure from Pliz API */
export class PlizApiError extends Error {
  readonly status: number;
  readonly errors: ApiErrorItem[];

  constructor(
    message: string,
    status: number,
    errors: ApiErrorItem[] = []
  ) {
    super(message);
    this.name = 'PlizApiError';
    this.status = status;
    this.errors = errors;
  }
}

export type SignupRequestBody = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignupUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  isProfileComplete: boolean;
  isSuspended: boolean;
  isUnderInvestigation: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SignupSuccessResponse = {
  success: true;
  message: string;
  data: {
    user: SignupUser;
  };
};

export type SignupErrorResponse = {
  success: false;
  message: string;
  errors?: ApiErrorItem[];
};

/** POST /api/auth/profile/complete */
export type CompleteProfileBody = {
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  displayName?: string;
  agreeToTerms: boolean;
  isAnonymous?: boolean;
};

export type CompletedProfile = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string;
  displayName: string | null;
  isAnonymous: boolean;
};

/** PUT /api/auth/profile */
export type UpdateProfileBody = {
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  phoneNumber?: string;
  displayName?: string | null;
  isAnonymous?: boolean;
};

export type UpdatedProfilePayload = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string;
  displayName: string | null;
  isAnonymous: boolean;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type LoginUser = SignupUser;

export type LoginSuccessData = {
  user: LoginUser;
  accessToken: string;
  refreshToken: string;
};

/** Nested profile on User (GET /api/auth/me) — matches Prisma UserProfile JSON */
export type MeUserProfile = {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  phoneNumber: string;
  displayName: string | null;
  isAnonymous: boolean;
  agreeToTerms: boolean;
  createdAt: string;
  updatedAt: string;
};

/** From GET /api/auth/me (`user_stats` + computed peopleHelped) */
export type MeUserStatsSummary = {
  totalDonated: number;
  totalReceived: number;
  requestsCount: number;
  /** Omitted on older API builds; treat as 0 */
  peopleHelped?: number;
  /** Distinct people helped via donations in the last 7 days */
  peopleHelpedThisWeek?: number;
};

/** GET /api/auth/me — user includes profile when completed */
export type MeUser = SignupUser & {
  profile: MeUserProfile | null;
  stats?: MeUserStatsSummary | null;
};
