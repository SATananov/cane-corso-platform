export interface HealthDocument {
  service: string;
  status: 'ok';
  environment: 'development' | 'production' | 'test';
  database: 'configured' | 'missing';
}
