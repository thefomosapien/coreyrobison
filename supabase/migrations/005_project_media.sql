-- Add video/media support to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';
