
-- Create models table
CREATE TABLE public.models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  risk TEXT CHECK (risk IN ('High', 'Limited', 'Minimal')) NOT NULL,
  last_run TIMESTAMP WITH TIME ZONE,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Allow all users to read models
CREATE POLICY "Allow read access to models" ON public.models
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update models
CREATE POLICY "Allow authenticated users to insert models" ON public.models
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update models" ON public.models
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert some sample data
INSERT INTO public.models (name, version, risk, last_run) VALUES
  ('GPT-4', 'v1.0', 'High', NOW() - INTERVAL '2 days'),
  ('BERT-Base', 'v2.1', 'Limited', NOW() - INTERVAL '1 week'),
  ('Simple Classifier', 'v1.2', 'Minimal', NOW() - INTERVAL '3 days'),
  ('Vision Transformer', 'v1.0', 'High', NULL),
  ('Text Embeddings', 'v3.0', 'Limited', NOW() - INTERVAL '5 days');
