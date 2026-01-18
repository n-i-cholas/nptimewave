-- Create storage bucket for memory images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for memory images bucket
CREATE POLICY "Anyone can view memory images"
ON storage.objects FOR SELECT
USING (bucket_id = 'memory-images');

CREATE POLICY "Authenticated users can upload memory images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memory-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own memory images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'memory-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own memory images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memory-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);