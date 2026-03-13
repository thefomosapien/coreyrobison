-- Add image_urls array to projects for multi-image carousel support
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';
