#!/usr/bin/env node
/**
 * XORVIN — Ensure required tables exist in Supabase.
 * Reports missing tables; apply supabase/migrations/008_connect_skipped_pages.sql if needed.
 *
 * Usage: npm run ensure:schema
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const REQUIRED_TABLES = [
  'profiles', 'events', 'event_registrations', 'blogs', 'certificates',
  'announcements', 'contact_messages', 'gallery', 'gallery_items',
  'website_settings', 'faqs', 'technology_categories', 'core_values',
  'partners', 'testimonials', 'speakers',
];

function loadEnv() {
  const envPath = resolve(ROOT, '.env');
  const vars = {};
  if (!existsSync(envPath)) {
    console.error('❌ .env not found');
    process.exit(1);
  }
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  }
  return vars;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function tableReachable(table) {
  const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return error ? { ok: false, error: error.message } : { ok: true };
}

async function main() {
  console.log('\n📋 XORVIN Schema Check');
  console.log('═'.repeat(50));

  const missing = [];
  const present = [];

  for (const table of REQUIRED_TABLES) {
    const result = await tableReachable(table);
    if (result.ok) {
      present.push(table);
      console.log(`✅ ${table}`);
    } else {
      missing.push({ table, error: result.error });
      console.log(`❌ ${table} — ${result.error}`);
    }
  }

  console.log('─'.repeat(50));
  console.log(`${present.length} present | ${missing.length} missing\n`);

  if (missing.some(m => ['partners', 'testimonials', 'speakers'].includes(m.table))) {
    console.log('💡 Apply missing tables: supabase/migrations/008_connect_skipped_pages.sql');
    console.log('   (Supabase Dashboard → SQL Editor → paste & run)\n');
  }

  if (missing.length > 0) process.exit(1);
}

main().catch(e => { console.error(e); process.exit(1); });
