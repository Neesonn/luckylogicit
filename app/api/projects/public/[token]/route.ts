export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../../../utils/rateLimiter';
import supabase from '../../../../services/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`get-public-project-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    // Find project by public token
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('public_token', params.token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          error: 'Project not found or access revoked' 
        }, { status: 404 });
      }
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message || 'Failed to fetch project' 
      }, { status: 500 });
    }

    // Only return whitelisted fields for public access
    const addStatus = (arr: any[], key = 'status') => Array.isArray(arr) ? arr.map(obj => ({ ...obj, status: obj?.[key] ?? 'unknown' })) : [];
    const publicProject = {
      code: data.code,
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      estimatedHours: data.estimatedHours,
      category: data.category,
      client: data.client,
      customer: data.customer,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      projectOwner: data.projectOwner,
      createdBy: data.createdBy,
      team: data.team,
      tasks: data.tasks,
      updates: data.updates,
      linkedQuotes: addStatus(data.linkedQuotes),
      linkedInvoices: addStatus(data.linkedInvoices),
      // Exclude sensitive fields like actualCost, history, etc.
    };

    return NextResponse.json({ 
      success: true, 
      project: publicProject
    });
  } catch (error: any) {
    console.error('Error fetching public project:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to fetch project' 
    }, { status: 400 });
  }
} 