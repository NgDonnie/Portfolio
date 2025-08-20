export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  const parsed = parseInt(value || '', 10);

  if (isNaN(parsed)) {
    console.warn(`⚠️ Environment variable ${key} is missing or invalid. Using default: ${defaultValue}ms`);
    return defaultValue;
  }

  console.log(`ℹ️ ${key} = ${parsed}ms`);
  return parsed;
}
