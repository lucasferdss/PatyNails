import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://umupjmmcacgvfywclcmv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtdXBqbW1jYWNndmZ5d2NsY212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NjI2NDAsImV4cCI6MjA2NjUzODY0MH0.zRpu6IHjZJMXbKuDbRu6qKHJOx3MKCjLx3OX85lUGK0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);