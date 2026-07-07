/**
 * Batch 31 DB client.
 *
 * This helper is intentionally lazy:
 * - It does not connect at import time.
 * - It only executes queries when called.
 * - It requires PARTNER_INTAKE_STORAGE_MODE=postgres.
 *
 * Install dependency when wiring for real:
 *   npm install pg
 */

export type QueryValue = string | number | boolean | null | Date | Record<string, unknown> | unknown[];

export type DbQueryResult<T = Record<string, unknown>> = {
  rows: T[];
  rowCount: number;
};

let cachedPool: any | null = null;

export function isPostgresEnabled(): boolean {
  return process.env.PARTNER_INTAKE_STORAGE_MODE === "postgres";
}

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required when PARTNER_INTAKE_STORAGE_MODE=postgres.");
  }
  return databaseUrl;
}

export function requirePostgresEnabled(): void {
  if (!isPostgresEnabled()) {
    throw new Error(
      "Postgres storage is disabled. Set PARTNER_INTAKE_STORAGE_MODE=postgres before using the database layer."
    );
  }
}

async function getPool(): Promise<any> {
  requirePostgresEnabled();

  if (cachedPool) return cachedPool;

  const databaseUrl = getDatabaseUrl();

  // Dynamic import keeps this file safe in repos before `pg` is installed.
  const pg = await import("pg");
  const Pool = pg.Pool;

  cachedPool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
    max: Number(process.env.PARTNER_INTAKE_DB_POOL_MAX || 5),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000
  });

  return cachedPool;
}

export async function dbQuery<T = Record<string, unknown>>(
  text: string,
  values: QueryValue[] = []
): Promise<DbQueryResult<T>> {
  const pool = await getPool();
  const result = await pool.query(text, values);
  return {
    rows: result.rows as T[],
    rowCount: result.rowCount ?? 0
  };
}

export async function closeDbPool(): Promise<void> {
  if (cachedPool) {
    await cachedPool.end();
    cachedPool = null;
  }
}
