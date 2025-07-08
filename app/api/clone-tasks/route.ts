import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { sourceProject, destinationProject, tasks } = await req.json();
    if (!sourceProject || !destinationProject || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing or invalid input.' }, { status: 400 });
    }

    // Fetch the destination project
    const { data: destProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, tasks')
      .eq('code', destinationProject)
      .single();

    if (fetchError || !destProject) {
      return NextResponse.json({ success: false, error: 'Destination project not found.' }, { status: 404 });
    }

    // Prepare new tasks (assign new IDs if needed)
    const existingTasks = Array.isArray(destProject.tasks) ? destProject.tasks : [];
    const nextId = existingTasks.length > 0 ? Math.max(...existingTasks.map((t: any) => Number(t.id) || 0)) + 1 : 1;
    const clonedTasks = tasks.map((task: any, idx: number) => ({
      ...task,
      id: (nextId + idx).toString(),
    }));

    // Update the destination project's tasks array
    const updatedTasks = [...existingTasks, ...clonedTasks];
    const { error: updateError } = await supabase
      .from('projects')
      .update({ tasks: updatedTasks })
      .eq('code', destinationProject);

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Unknown error.' }, { status: 500 });
  }
} 