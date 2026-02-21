export interface SiteSettings {
  id: string;
  name: string;
  title: string;
  headline: string;
  company_badge_text: string;
  company_badge_url: string;
  bio_paragraphs: string[];
  photo_url: string | null;
  about_headline: string;
  about_paragraphs: string[];
  contact_headline: string;
  email: string;
  linkedin_url: string;
  footer_tagline: string;
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

export interface Thought {
  id: string;
  slug: string;
  title: string;
  category: string;
  body: string | null;
  excerpt: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  target_type: 'thought' | 'project';
  target_id: string;
  reaction_type: 'thoughtful' | 'relatable' | 'good' | 'loved' | 'mind';
  count: number;
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

export const REACTION_MAP: Record<string, { emoji: string; label: string }> = {
  thoughtful: { emoji: '🤔', label: 'Very thoughtful' },
  relatable: { emoji: '🙏', label: 'So relatable' },
  good: { emoji: '👍', label: 'So good' },
  loved: { emoji: '❤️', label: 'Loved it' },
  mind: { emoji: '🤯', label: 'Blew my mind' },
};
