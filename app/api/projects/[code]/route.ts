export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../../utils/rateLimiter';
import supabase from '../../../services/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`get-project-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('code', params.code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          error: 'Project not found' 
        }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to fetch project' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      project: data
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch project' 
    }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`update-project-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const projectData = await request.json();

    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('code', params.code)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to update project' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      project: data
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to update project' 
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`delete-project-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('code', params.code);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to delete project' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Project deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to delete project' 
    }, { status: 400 });
  }
} 