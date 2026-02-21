import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const VALID_TYPES = ['thoughtful', 'relatable', 'good', 'loved', 'mind'];
const VALID_TARGETS = ['thought', 'project'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_type, target_id, reaction_type } = body;

    if (!VALID_TARGETS.includes(target_type) || !target_id || !VALID_TYPES.includes(reaction_type)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const supabase = createClient(url, key);

    // Try to upsert — increment if exists, insert with count 1 if not
    const { data: existing } = await supabase
      .from('reactions')
      .select('id, count')
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .eq('reaction_type', reaction_type)
      .single();

    if (existing) {
      await supabase
        .from('reactions')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('reactions')
        .insert({ target_type, target_id, reaction_type, count: 1 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const target_type = searchParams.get('target_type');
    const target_id = searchParams.get('target_id');

    if (!target_type || !target_id) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    const supabase = createClient(url, key);
    const { data } = await supabase
      .from('reactions')
      .select('reaction_type, count')
      .eq('target_type', target_type)
      .eq('target_id', target_id);

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
