-- Fix critical security vulnerability: Restrict data access to authenticated users only

-- Update appointments table RLS policies
DROP POLICY IF EXISTS "Allow public access to appointments" ON public.appointments;

CREATE POLICY "Authenticated users can manage appointments" 
ON public.appointments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update services table RLS policies  
DROP POLICY IF EXISTS "Allow public access to services" ON public.services;

CREATE POLICY "Authenticated users can manage services" 
ON public.services 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Fix function search path security issue
DROP FUNCTION IF EXISTS public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;