declare module 'pg' {
  export interface PoolConfig {
    connectionString?: string;
    ssl?: boolean | { rejectUnauthorized?: boolean };
  }

  export interface QueryResult<TRow = Record<string, unknown>> {
    rows: TRow[];
    rowCount: number | null;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    query<TRow = Record<string, unknown>>(text: string, values?: unknown[]): Promise<QueryResult<TRow>>;
    end(): Promise<void>;
  }
}
