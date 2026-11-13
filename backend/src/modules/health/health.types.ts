export type HealthStatus = "healthy" | "unhealthy";

export interface DependencyHealth {
  status: HealthStatus;
  responseTimeMs: number;
  message?: string;
}

export interface HealthResponse {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: DependencyHealth;
  };
}