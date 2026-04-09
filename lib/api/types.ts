/** Standard API error item (validation) */
export type ApiErrorItem = {
  field: string;
  message: string;
};

/** Parsed failure from Plz API */
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

/**
 * Single string for Alerts / banners: top-level `message` plus validation `errors` from the API.
 */
export function formatPlizApiErrorForUser(error: unknown): string {
  if (error instanceof PlizApiError) {
    const lines: string[] = [];
    if (error.message.trim()) lines.push(error.message.trim());
    if (error.errors.length > 0) {
      lines.push(
        error.errors.map((x) => (x.field ? `${x.field}: ${x.message}` : x.message)).join('\n')
      );
    }
    return lines.join('\n\n').trim() || 'Request failed';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong. Please try again.';
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
  /** Present when API returns OAuth metadata (e.g. Google / Apple login) */
  authProvider?: string | null;
  avatar?: string | null;
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

/** POST /api/auth/profile/complete — matches pliz-backend `completeProfile` */
export type CompleteProfileBody = {
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  state: string;
  city: string;
  address?: string;
  agreeToTerms: boolean;
  isAnonymous?: boolean;
};

export type CompletedProfile = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string | null;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber: string;
  state?: string;
  city?: string;
  address?: string | null;
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

/** POST /api/auth/google | /api/auth/apple — same tokens as password login + navigation hints */
export type OAuthLoginSuccessData = LoginSuccessData & {
  isNewUser: boolean;
  nextStep: 'complete_profile' | 'home';
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
  /** Present when API returns location fields */
  state?: string | null;
  city?: string | null;
  address?: string | null;
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

/** Govt ID / NIN verification — returned when backend adds `verification` to GET /me */
export type MeUserVerification = {
  documentVerified: boolean;
};

/** GET /api/auth/me — user includes profile when completed */
export type MeUser = SignupUser & {
  profile: MeUserProfile | null;
  stats?: MeUserStatsSummary | null;
  /** Present when API exposes UserVerification (NIN / passport / ID) */
  verification?: MeUserVerification | null;
};
