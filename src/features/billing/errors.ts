// Error codes emitted by portal.ts and checkout.ts via redirect(?error=)
export const BILLING_ERRORS: Record<string, string> = {
  no_customer: 'No billing account found. Please contact support.',
  already_subscribed: 'You already have an active subscription.',
  portal_unavailable: 'Billing portal is temporarily unavailable. Please try again.',
};

export const PRICING_ERRORS: Record<string, string> = {
  product_not_configured: 'This plan is not yet available. Please try again later.',
  missing_email: 'Your account is missing an email address. Please update your profile.',
  checkout_forbidden:
    'Checkout is not authorized. Verify CREEM_API_KEY permissions and ensure your key matches the configured Creem API environment.',
  checkout_unavailable: 'Checkout is temporarily unavailable. Please try again.',
};
