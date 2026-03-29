export type AuthActionState =
  | { error?: string; fieldErrors?: Record<string, string[]> }
  | undefined;

export type OAuthProvider = "github" | "google";
