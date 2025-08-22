# Database Setup for Project Sign-Off

## Adding Sign-Off Columns to Projects Table

To enable project sign-off functionality, you need to add the following columns to your `projects` table in Supabase:

### Required Columns

1. **`sign_off_data`** (JSONB)
   - Stores complete sign-off information including signature, checklist, and metadata
   - Type: JSONB for flexible data storage

2. **`sign_off_completed_at`** (TIMESTAMP WITH TIME ZONE)
   - Records when the project sign-off was completed
   - Type: TIMESTAMP WITH TIME ZONE

3. **`sign_off_completed_by`** (TEXT)
   - Records who completed the project sign-off
   - Type: TEXT

### How to Add These Columns

#### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **projects** table
3. Click **Add Column** for each new column
4. Use the specifications above

#### Option 2: SQL Editor
Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Add sign-off data column
ALTER TABLE projects 
ADD COLUMN sign_off_data JSONB;

-- Add sign-off completed timestamp
ALTER TABLE projects 
ADD COLUMN sign_off_completed_at TIMESTAMP WITH TIME ZONE;

-- Add sign-off completed by user
ALTER TABLE projects 
ADD COLUMN sign_off_completed_by TEXT;
```

#### Option 3: Migration File
Use the `add-sign-off-columns.sql` file in your project root and run it in your Supabase SQL Editor.

### After Adding Columns

Once the columns are added:
1. The sign-off API endpoint will work correctly
2. Project sign-off status will display properly
3. Completed sign-offs can be viewed and managed

### Notes

- The `IF NOT EXISTS` clause is used in the migration to prevent errors if columns already exist
- JSONB type allows for flexible storage of sign-off data
- Timestamps include timezone information for accuracy
- These changes are backward compatible and won't affect existing projects 