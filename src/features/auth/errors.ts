// Error codes emitted by auth.ts and callback/route.ts via redirect(?error=)
export const LOGIN_ERRORS: Record<string, string> = {
  oauth_failed: 'Sign-in failed. Please try again.',
  auth_callback_failed: 'Authentication failed. Please try again.',
};
