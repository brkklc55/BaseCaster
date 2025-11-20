import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujzamsxwmvdbmjtgnsum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqemFtc3h3bXZkYm1qdGduc3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTg3NzIsImV4cCI6MjA3OTE5NDc3Mn0.txnJuuHqlTrIA4GOd2aCFU-LIQcGDarRcpWBMUKk7jA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
