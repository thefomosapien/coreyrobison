export interface SiteSettings {
  id: string;
  name: string;
  title: string;
  headline: string;
  bio: string;
  meta_currently: string;
  meta_location: string;
  meta_side_projects: string;
  about_headline: string;
  about_paragraphs: string[];
  contact_headline: string;
  contact_description: string;
  email: string;
  linkedin_url: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  tag: string;
  name: string;
  description: string;
  skills: string[];
  external_url: string | null;
  visual_type: 'rebrand' | 'card' | 'marketplace' | 'brand-system' | 'historia' | 'duhbate' | 'custom';
  visual_bg_color: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface JourneyItem {
  id: string;
  year_label: string;
  role: string;
  company: string;
  note: string;
  sort_order: number;
  is_visible: boolean;
}

export interface AboutDetail {
  id: string;
  label: string;
  value: string;
  sort_order: number;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
  is_email: boolean;
  sort_order: number;
}
