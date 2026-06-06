/**
 * JWT Utility
 *
 * Handles generation and verification of access & refresh token pairs.
 * Access tokens are short-lived (carried in Authorization header).
 * Refresh tokens are long-lived (stored in httpOnly cookie + Redis).
 */

import jwt from "jsonwebtoken";

type JwtExpiresIn = NonNullable<jwt.SignOptions["expiresIn"]>;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

// ─── Environment helpers ─────────────────────────────────────────────────────

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined");
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not defined");
  return secret;
}

function getAccessExpiry(): JwtExpiresIn {
  return (process.env.JWT_ACCESS_EXPIRY || "15m") as JwtExpiresIn;
}

function getRefreshExpiry(): JwtExpiresIn {
  return (process.env.JWT_REFRESH_EXPIRY || "7d") as JwtExpiresIn;
}

// ─── Token generation ────────────────────────────────────────────────────────

/**
 * Generate a short-lived access token.
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: getAccessExpiry(),
  });
}

/**
 * Generate a long-lived refresh token.
 */
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: getRefreshExpiry(),
  });
}

/**
 * Convenience: generate both tokens at once.
 */
export function generateTokenPair(payload: TokenPayload): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

// ─── Token verification ─────────────────────────────────────────────────────

/**
 * Verify an access token. Throws on invalid / expired tokens.
 */
export function verifyAccessToken(token: string): DecodedToken {
  return jwt.verify(token, getAccessSecret()) as DecodedToken;
}

/**
 * Verify a refresh token. Throws on invalid / expired tokens.
 */
export function verifyRefreshToken(token: string): DecodedToken {
  return jwt.verify(token, getRefreshSecret()) as DecodedToken;
}
