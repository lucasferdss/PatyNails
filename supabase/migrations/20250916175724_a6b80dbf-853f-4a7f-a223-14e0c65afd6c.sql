-- Fix RLS policies to properly require authentication

-- Drop existing policies and recreate with proper authentication checks
DROP POLICY IF EXISTS "Authenticated users can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON public.services;

-- Create proper RLS policies that require authentication
CREATE POLICY "Require authentication for appointments" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Require authentication for services" 
ON public.services 
FOR ALL 
TO authenticated 
USING (auth.uid() IS NOT NULL) 
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;