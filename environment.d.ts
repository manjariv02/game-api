export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      MONGODB_URL: string;
      JWT_SECRET: string;
    }
  }

  declare namespace Express {
    export interface Request {
      user?: {
        playerId?: string;
        userId?: string;
      };
    }
  }
}
