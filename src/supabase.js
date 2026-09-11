import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmldypvguivwwymnpnyl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_-QKdsvhcZskCvEREagS_LA_ThZ1oGBW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
