import { Pool } from "pg";

let pool: Pool | undefined;

declare global {
  var _eiPgPool: Pool | undefined;
}

function shouldUseSsl(connectionString: string) {
  try {
    const url = new URL(connectionString);
    const host = url.hostname;
    const sslMode = url.searchParams.get("sslmode")?.toLowerCase();

    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "::1";
    if (isLocal || sslMode === "disable") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function normalizeConnectionString(connectionString: string) {
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return connectionString;
  }
}

export function getPostgresPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error("Please define POSTGRES_URL in your environment variables.");
  }

  const normalizedConnectionString = normalizeConnectionString(connectionString);

  const poolConfig = shouldUseSsl(connectionString)
    ? {
        connectionString: normalizedConnectionString,
        ssl: { rejectUnauthorized: false },
      }
    : {
        connectionString: normalizedConnectionString,
      };

  if (process.env.NODE_ENV === "development") {
    if (!global._eiPgPool) {
      global._eiPgPool = new Pool(poolConfig);
    }

    pool = global._eiPgPool;
    return pool;
  }

  pool = new Pool(poolConfig);
  return pool;
}
