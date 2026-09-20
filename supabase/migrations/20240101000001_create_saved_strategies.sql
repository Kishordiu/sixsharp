-- Create the saved_strategies table
CREATE TABLE IF NOT EXISTS public.saved_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  description text,
  parameters jsonb NOT NULL,
  performance_metrics jsonb,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.saved_strategies ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own strategies"
  ON public.saved_strategies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own strategies"
  ON public.saved_strategies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own strategies"
  ON public.saved_strategies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own strategies"
  ON public.saved_strategies
  FOR DELETE
  USING (auth.uid() = user_id);
