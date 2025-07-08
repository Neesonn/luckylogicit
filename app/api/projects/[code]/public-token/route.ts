export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../../../utils/rateLimiter';
import supabase from '../../../../services/supabaseClient';
import { randomBytes } from 'crypto';

// Generate a secure random token
function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`generate-public-token-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    // Verify project exists
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('code')
      .eq('code', params.code)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }

    // Generate unique token
    let token: string = '';
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      token = generateToken();
      
      // Check if token already exists
      const { data: existingToken } = await supabase
        .from('projects')
        .select('public_token')
        .eq('public_token', token)
        .single();
      
      if (!existingToken) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate unique token' 
      }, { status: 500 });
    }

    // Update project with public token
    const { data, error } = await supabase
      .from('projects')
      .update({ public_token: token })
      .eq('code', params.code)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to generate public token' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      publicToken: token,
      project: data
    });
  } catch (error: any) {
    console.error('Error generating public token:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to generate public token' 
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`revoke-public-token-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    // Remove public token from project
    const { data, error } = await supabase
      .from('projects')
      .update({ public_token: null })
      .eq('code', params.code)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to revoke public token' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Public access revoked successfully',
      project: data
    });
  } catch (error: any) {
    console.error('Error revoking public token:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to revoke public token' 
    }, { status: 400 });
  }
} 