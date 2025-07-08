import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../services/supabaseClient';

export async function PUT(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const updates = await request.json();
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('code', params.code)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 