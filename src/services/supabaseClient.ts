import { createClient } from '@supabase/supabase-js';

// Environment variable credentials (optional, system works seamlessly offline/mocked)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://mock-instance.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isSupabaseConfigured = Boolean(
  (import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to fetch or fallback to local stored state
 */
export async function fetchWithFallback<T>(
  tableName: string,
  mockData: T[],
  storageKey: string
): Promise<T[]> {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(tableName).select('*');
      if (!error && data && data.length > 0) {
        return data as T[];
      }
    }
  } catch (err) {
    console.warn(`Supabase query for ${tableName} falling back to local memory:`, err);
  }

  // Local storage fallback
  const cached = localStorage.getItem(`sia_${storageKey}`);
  if (cached) {
    try {
      return JSON.parse(cached) as T[];
    } catch {
      // ignore
    }
  }

  return mockData;
}

/**
 * Helper to persist changes
 */
export async function saveWithFallback<T>(
  tableName: string,
  record: T,
  storageKey: string,
  existingList: T[]
): Promise<T[]> {
  const updatedList = [record, ...existingList];
  localStorage.setItem(`sia_${storageKey}`, JSON.stringify(updatedList));

  if (isSupabaseConfigured) {
    try {
      await supabase.from(tableName).insert([record as any]);
    } catch (e) {
      console.warn('Failed to push to Supabase, saved locally:', e);
    }
  }

  return updatedList;
}
