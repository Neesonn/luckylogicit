# Public Project Sharing Feature

This feature allows you to create secure, read-only public links to share specific projects with clients or stakeholders without requiring them to have admin access.

## Setup

### 1. Database Migration

Run the following SQL in your Supabase SQL editor:

```sql
-- Add public_token column to projects table
ALTER TABLE projects 
ADD COLUMN public_token TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_projects_public_token ON projects(public_token);
```

### 2. Files Created

The following files have been created:

- `app/project/public/[token]/page.tsx` - Public project view page
- `app/api/projects/public/[token]/route.ts` - API endpoint for public project access
- `app/api/projects/[code]/public-token/route.ts` - API endpoint for token management
- Updated `app/admin/project/[code]/page.tsx` - Added public link management UI

## How to Use

### For Administrators

1. **Navigate to a project**: Go to `/admin/project/[PROJECT_CODE]`
2. **Generate public link**: Click the "Generate Public Link" button in the header
3. **Share the link**: The generated URL will be copied to your clipboard
4. **Manage access**: Use the same button to revoke access when needed

### For Recipients

1. **Access the link**: Visit the shared URL (e.g., `https://yoursite.com/project/public/abc123...`)
2. **View project**: See read-only project information including:
   - Project overview and details
   - Progress tracking
   - Budget information
   - Task list (read-only)
   - Project updates (read-only)
   - Team and customer information

## Security Features

- **Unpredictable URLs**: Tokens are cryptographically random (64-character hex)
- **Easy Revocation**: Simply click "Revoke Access" to disable the link
- **Field Whitelisting**: Only safe fields are exposed in public view
- **Rate Limiting**: API endpoints are protected against abuse
- **No Authentication Bypass**: Admin routes remain protected

## URL Structure

- **Admin route**: `/admin/project/[code]` (protected)
- **Public route**: `/project/public/[token]` (public)

## API Endpoints

- `POST /api/projects/[code]/public-token` - Generate new public token
- `DELETE /api/projects/[code]/public-token` - Revoke public access
- `GET /api/projects/public/[token]` - Get public project data

## Whitelisted Fields

The public view only shows these fields:
- `code`, `name`, `description`
- `status`, `priority`
- `startDate`, `endDate`
- `budget`, `estimatedHours`
- `category`, `client`
- `customer`, `customerEmail`, `customerPhone`
- `projectOwner`, `createdBy`
- `team`, `tasks`, `updates`

Sensitive fields like `actualCost`, `history`, etc. are excluded.

## Troubleshooting

### Link Not Working
- Check if the token exists in the database
- Verify the token hasn't been revoked
- Ensure the project still exists

### Can't Generate Token
- Check if the project exists
- Verify database permissions
- Check rate limiting

### Public Page Shows Error
- Verify the token is valid
- Check if the project exists
- Ensure the API endpoint is accessible 