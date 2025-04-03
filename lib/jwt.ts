import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export function signJwtToken(payload: any, options = {}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // 7 days
    ...options,
  });
}

export function verifyJwtToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
      role: string;
      iat: number;
      exp: number;
    };
  } catch (error) {
    console.error("JWT verification error:", error);
    throw error;
  }
}

export function decodeJwtToken(token: string) {
  return jwt.decode(token) as {
    id: string;
    email: string;
    name: string;
    role: string;
    iat: number;
    exp: number;
  } | null;
}