export {};

declare global {
  interface CustomJwtSessionClaims {
    isAdmin?: boolean;
  }
}
