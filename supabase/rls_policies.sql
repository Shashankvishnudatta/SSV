-- Enable Row Level Security
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own generations
CREATE POLICY "Users can select own generations"
ON public.generations
FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own generations
CREATE POLICY "Users can insert own generations"
ON public.generations
FOR INSERT
WITH CHECK (auth.uid() = user_id);