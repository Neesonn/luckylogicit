export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../utils/rateLimiter';
import supabase from '../../services/supabaseClient';

export async function GET(request: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`get-projects-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const url = request.url || '';
    const searchParams = new URL(url, 'http://localhost').searchParams;
    const customerStripeId = searchParams.get('customer_stripe_id');

    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (customerStripeId) {
      query = query.eq('customer_stripe_id', customerStripeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to fetch projects' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      projects: data || [] 
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch projects' 
    }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`create-project-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const projectData = await request.json();
    
    // Validate required fields
    if (!projectData.name || !projectData.customer) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project name and customer are required' 
      }, { status: 400 });
    }

    // Prepare project data for Supabase
    const projectToInsert = {
      ...projectData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([projectToInsert])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to create project' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      project: data
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create project' 
    }, { status: 400 });
  }
}

 