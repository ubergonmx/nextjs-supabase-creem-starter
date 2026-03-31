import { describe, it, expect, beforeEach } from 'vitest';
import { planNameFromId, PLANS } from '../types';

describe('planNameFromId', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER = 'prod_starter';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO = 'prod_pro';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS = 'prod_business';
  });

  it('returns Free for null planId', () => {
    expect(planNameFromId(null)).toBe('Free');
  });

  it('returns Starter for starter product ID', () => {
    expect(planNameFromId('prod_starter')).toBe('Starter');
  });

  it('returns Pro for pro product ID', () => {
    expect(planNameFromId('prod_pro')).toBe('Pro');
  });

  it('returns Business for business product ID', () => {
    expect(planNameFromId('prod_business')).toBe('Business');
  });

  it('returns Free for unknown product ID', () => {
    expect(planNameFromId('prod_unknown')).toBe('Free');
  });
});

describe('PLANS config', () => {
  it('has correct plan names', () => {
    expect(PLANS.free.name).toBe('Free');
    expect(PLANS.starter.name).toBe('Starter');
    expect(PLANS.pro.name).toBe('Pro');
    expect(PLANS.business.name).toBe('Business');
  });

  it('has prices in ascending order', () => {
    expect(PLANS.free.price).toBe(0);
    expect(PLANS.starter.price).toBeLessThan(PLANS.pro.price);
    expect(PLANS.pro.price).toBeLessThan(PLANS.business.price);
  });

  it('has credits in ascending order (business is unlimited = -1)', () => {
    expect(PLANS.free.credits).toBeLessThan(PLANS.starter.credits);
    expect(PLANS.starter.credits).toBeLessThan(PLANS.pro.credits);
    expect(PLANS.business.credits).toBe(-1);
  });

  it('free plan has no productId', () => {
    expect(PLANS.free).not.toHaveProperty('productId');
  });

  it('paid plans have productId env references', () => {
    expect(PLANS.starter).toHaveProperty('productId');
    expect(PLANS.pro).toHaveProperty('productId');
    expect(PLANS.business).toHaveProperty('productId');
  });
});
