import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmldypvguivwwymnpnyl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-QKdsvhcZskCvEREagS_LA_ThZ1oGBW';

const client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth);

client.auth.signInWithPassword = async credentials => {
  const result = await originalSignInWithPassword(credentials);
  if (result.error) {
    console.error('[Maristela Auth Diagnostic]', {
      name: result.error.name,
      message: result.error.message,
      status: result.error.status,
      code: result.error.code,
    });
  }
  return result;
};

export const supabase = client;
