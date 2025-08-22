import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const signOffData = await request.json();

    // Update the project with sign-off data
    const { data, error } = await supabase
      .from('projects')
      .update({
        sign_off_data: signOffData
      })
      .eq('code', code)
      .select();

    if (error) {
      console.error('Error updating project with sign-off data:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save sign-off data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sign-off data saved successfully',
      data: data
    });

  } catch (error) {
    console.error('Error in sign-off API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 