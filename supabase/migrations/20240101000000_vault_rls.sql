-- Enable Row Level Security
ALTER TABLE "strategies" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to SELECT their own strategies
CREATE POLICY "Users can view own strategies"
  ON "strategies"
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to INSERT their own strategies
CREATE POLICY "Users can insert own strategies"
  ON "strategies"
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to UPDATE their own strategies
CREATE POLICY "Users can update own strategies"
  ON "strategies"
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to DELETE their own strategies
CREATE POLICY "Users can delete own strategies"
  ON "strategies"
  FOR DELETE
  USING (auth.uid() = user_id);
