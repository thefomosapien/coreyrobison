-- Migration: Add photo_alt_url to site_settings for easter egg photo swap

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS photo_alt_url text;
