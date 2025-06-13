// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybkcvzukreaqxuacdcms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlia2N2enVrcmVhcXh1YWNkY21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzMxMTQsImV4cCI6MjA2NTMwOTExNH0.N6EWZID1yndZfrg-qZ3U4c2t-QpaijvK_YjzRbY4NNs';

export const supabase = createClient(supabaseUrl, supabaseKey);
