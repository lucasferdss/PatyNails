-- Step 1: Add user_id columns to track ownership
ALTER TABLE public.appointments 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid();

ALTER TABLE public.services 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid();

-- Step 2: Create indexes for better query performance
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_services_user_id ON public.services(user_id);

-- Step 3: Drop the overly permissive existing policies
DROP POLICY IF EXISTS "Require authentication for appointments" ON public.appointments;
DROP POLICY IF EXISTS "Require authentication for services" ON public.services;

-- Step 4: Create proper ownership-based RLS policies for appointments
CREATE POLICY "Users can view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own appointments"
ON public.appointments
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Step 5: Create proper ownership-based RLS policies for services
CREATE POLICY "Users can view their own services"
ON public.services
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own services"
ON public.services
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own services"
ON public.services
FOR DELETE
TO authenticated
USING (user_id = auth.uid());