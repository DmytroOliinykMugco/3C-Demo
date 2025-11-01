# 3C Demo Project - Development Notes

## Project Overview
This is a demo application designed to create a "wow effect" for the customer. It consists of a frontend and backend that showcases functionality with mocked data.

## Goals & Approach
- **Purpose**: Create an impressive demo to showcase features and UI/UX
- **Data Strategy**: All data will be MOCKED - no database, using in-memory objects only
- **Development Process**: Step-by-step implementation based on screenshots and requirements
- **Timeline**: Demo/prototype focused - optimized for visual impact

## Technology Stack

### Frontend
- **Framework**: React 19.1.1 + Vite 7.1.7
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Data Table**: TanStack Table (formerly React Table)
- **Data Fetching**: TanStack Query (formerly React Query)
- **Styling**: TailwindCSS (via shadcn)

### Backend
- **Framework**: Express.js 5.1.0
- **CORS**: Enabled for frontend communication
- **Data**: In-memory JavaScript objects (no database)
- **Port**: 3000

## Project Structure
```
3C-Demo/
├── frontend/          # React + Vite application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Express API server
│   ├── index.js       # Main server file with mocked data
│   └── package.json
└── PROJECT_NOTES.md   # This file
```

## Current State

### Backend (✓ Complete)
- Express server setup
- CORS configured
- Mocked data endpoints:
  - `/api/profile` (GET, PUT) - User profile data
  - `/api/profile/photo` (POST) - Upload profile photo
  - `/api/family` (GET, POST) - Family members data
  - `/api/family/next-of-kin` (POST) - Assign Next of Kin
  - `/api/family/:id/star` (PATCH) - Toggle star status
  - `/api/family/:id` (DELETE) - Delete family member / Remove Next of Kin
  - `/api/contracts` (GET) - Contracts list

### Frontend (✓ Complete - Phase 1)
- Vite + React project created
- TailwindCSS v3.4.0 configured
- React Router v7.9.5 installed and configured
- TanStack Table v8.21.3 installed
- TanStack Query v5.90.5 installed
- shadcn/ui utilities installed (clsx, tailwind-merge, class-variance-authority, lucide-react)
- Path aliases configured (@/ -> src/)
- Sidebar navigation component created
- Main layout with sidebar implemented
- All route pages created:
  - Profile
  - Family
  - Security
  - Information
  - Balance
  - Wallet
  - Cemetery
  - Funeral

## Completed Features

### Information Page (✓ Complete - Readonly)
- **Emergency Contacts Section**:
  - Customer support card with avatar and 24/7 badge
  - Email and phone contact buttons (show "Coming soon" toast)
- **Welcome Section**:
  - Introduction text with bullet points
  - Privacy and security message
- **What to Expect Section**:
  - Description of arrangement meeting
  - Bullet points covering key steps
  - Mission statement
- **Documents Section**:
  - Instructions for document signing process (3 steps)
  - Tab navigation: "Signed documents" / "Example"
  - Document cards showing:
    - File icon, name, and size
    - Preview and Download buttons (show "Coming soon" toast)
  - Grid layout (2 columns on medium+ screens)
- **All buttons are mocked** - show "Coming soon" toast notification

### Family Page (✓ Complete)
- **Backend Architecture**:
  - Single `familyMembers` collection with flags: `isStarred`, `isNextOfKin`
  - GET endpoint `/api/family` - filters and organizes members based on flags
  - PATCH endpoint `/api/family/:id/star` - toggles `isStarred` flag
  - POST endpoint `/api/family` - adds new member to collection
  - POST endpoint `/api/family/next-of-kin` - sets `isNextOfKin: true` (clears others)
  - DELETE endpoint `/api/family/:id`:
    - If Next of Kin: sets `isNextOfKin: false` (keeps member in list)
    - Otherwise: removes member from collection completely
  - GET endpoint `/api/contracts` to fetch contract list
  - Mocked contracts data (5 contracts with numbers)
- **Three sections**:
  - Next of Kin (single member card, full width)
  - Starred members (grid of 2 cards)
  - All members (grid of 2 cards)
- **FamilyMemberCard component**:
  - Avatar with initials
  - Name and relationship
  - Star/unstar functionality (fully working)
  - Contact information (phone and email with icons)
  - Accesses badges (Viewer + ID, My Wishes)
  - Action buttons: "Edit accesses" and "Delete" (red)
- **Star Feature** (✓ Complete):
  - Click star icon to toggle star status
  - Starred members automatically move to "Starred members" section
  - Unstarred members move to "All members" section
  - Real-time UI updates with React Query cache invalidation
  - Success toast notification on star toggle
- **Add User Manually Feature** (✓ Complete):
  - Modal dialog with collapsible sections
  - General information section:
    - Status dropdown (Mister, Miss, Mrs)
    - First Name (required)
    - Last Name (required)
    - Family status dropdown (Father, Mother, Son, Daughter, etc.)
  - Contact information section:
    - E-mail (required, validated)
    - Phone number (optional)
  - Add to contract section:
    - Contract selection dropdown (loads from API)
  - React Hook Form validation
  - Auto-generates initials from first/last name
  - New member added to "All members" section
  - Success toast notification
  - Cache invalidation for real-time UI update
- **Delete User Feature** (✓ Complete):
  - Confirmation modal before deletion
  - Shows member details in modal (avatar, name, relationship, contact, accesses)
  - Delete button on all member cards
  - Can delete Next of Kin (sets to null, shows empty state)
  - Removes member from family list
  - Success toast notification
  - Cache invalidation for real-time UI update
  - Loading state during deletion
- **Edit Accesses Feature** (✓ Complete):
  - Modal dialog for managing contract access
  - Shows member details (avatar, name, relationship, contact info)
  - Displays current contract accesses as removable chips
  - Dropdown to add new contracts from available list
  - Click X to remove a contract from member
  - Select dropdown shows only unassigned contracts
  - Real-time updates with backend API
  - Success toast notification
  - "Edit accesses" button on all member cards
- **Next of Kin Management** (✓ Complete):
  - Empty state when no Next of Kin assigned:
    - Shows bordered card with blue border
    - "Select next of Kin" message
    - "Add a member" button
  - Add Next of Kin modal (right-side slide-in):
    - Two collapsible sections
    - "Add external user": Email input with "Invite user" button
    - "Add existing member": List of all family members with "Assign" buttons
    - Shows member avatars, names, relationships, and star status
    - Cancel and Next buttons
  - Assign existing member as Next of Kin:
    - Sets `isNextOfKin: true` flag on member
    - Member disappears from starred/all members lists
    - Appears in Next of Kin section
    - Real-time UI update
    - Success toast notification
  - Remove Next of Kin (delete):
    - Sets `isNextOfKin: false` flag
    - Member returns to appropriate list (starred or all members) based on `isStarred` flag
    - Shows empty state in Next of Kin section
    - Member NOT deleted from system
- **Header actions**:
  - "Share contract access" button (outline) - shows coming soon toast
  - "Add user manually" button (primary) - opens modal
- **Toast notifications**: Non-implemented features show "will be developed soon" message
- **Responsive design**: Cards in 2-column grid on medium+ screens

### Profile Page (✓ Complete)
- **Readonly mode**: Initial implementation with data fetching
- **Editable mode**: Full CRUD functionality
  - All fields are editable
  - React Hook Form for form state management
  - Change detection using formState.isDirty
  - Form validation ready (can be extended with validation rules)
  - Save button (Confirm) - uses handleSubmit and sends PUT request to backend
  - Cancel button - uses reset() to restore original data
  - Buttons appear only when form has changes
  - React Query for data fetching and mutations
  - Optimistic updates with cache invalidation
  - Clean form registration using register() spread operator
- **Toast Notifications**:
  - Custom toast component with context provider
  - "Link successfully copied" toast when copying UserID
  - "Photo uploaded successfully" toast after successful upload
  - Auto-dismiss after 3 seconds
  - Smooth slide-in animation
- **Confirmation Dialog**:
  - Modal dialog appears when clicking "Confirm" button
  - Two-step confirmation before saving changes
  - "Confirm and notify counselor" final action button
  - Can cancel out of confirmation
  - Backdrop click to close
- **Photo Upload**:
  - Hidden file input with accept="image/*"
  - Upload button triggers file picker
  - Client-side validation (5MB max size, image types only)
  - Base64 encoding for image upload
  - Image preview in avatar (shows uploaded photo or initials)
  - Loading state during upload
  - Success toast notification
  - Cache invalidation after upload

## To-Do / Pending
- [ ] Build detailed UI for other pages (Family, Security, Balance, Wallet, Cemetery, Funeral)
- [ ] Build data tables with TanStack Table
- [ ] Add more shadcn/ui components as needed

## Development Workflow
1. User provides screenshots of desired functionality
2. Implement UI components step-by-step
3. Use mocked backend data to populate UI
4. Focus on visual impact and demo-ready features

## Important Notes
- **No Database**: All data lives in memory (backend/index.js)
- **Mock Data Theme**: Star Wars characters (Luke Skywalker, Obi-Wan Kenobi, Leia Organa, Han Solo, Chewbacca, R2-D2)
- **No Authentication**: Demo mode - no auth required
- **Screenshot-Driven**: Development will be guided by visual references
- **Performance**: Not optimized for production - demo/showcase only

## API Endpoints Reference

### Profile
- `GET /api/profile` - Get user profile data
- `PUT /api/profile` - Update user profile data
- `POST /api/profile/photo` - Upload user profile photo (base64 encoded)

### Family
- `GET /api/family` - Get family members data (nextOfKin, starredMembers, allMembers)
- `POST /api/family` - Add new family member
- `POST /api/family/next-of-kin` - Assign Next of Kin (accepts memberId or email)
- `PATCH /api/family/:id/star` - Toggle star status for a family member
- `PATCH /api/family/:id/accesses` - Update member's contract accesses
- `DELETE /api/family/:id` - Delete a family member (or remove Next of Kin if deleting Next of Kin)

### Contracts
- `GET /api/contracts` - Get list of available contracts

## Next Steps
Waiting for screenshots to guide next implementation phase.

---
**Last Updated**: 2025-10-31
