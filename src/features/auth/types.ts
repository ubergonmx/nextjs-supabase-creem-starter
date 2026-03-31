export type AuthActionInputs = Partial<{
  fullName: string;
  email: string;
}>;

export type AuthActionState =
  | {
      error?: string;
      message?: string;
      fieldErrors?: Record<string, string[]>;
      inputs?: AuthActionInputs;
    }
  | undefined;

export type OAuthProvider = 'github' | 'google';
