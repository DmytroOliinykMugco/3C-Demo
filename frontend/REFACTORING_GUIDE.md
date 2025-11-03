# Frontend Refactoring Guide

## Overview

This document outlines the reusable components created to reduce code duplication and improve maintainability across the application.

## Created Reusable Components

### 1. **StatusBadge** (`/src/components/StatusBadge.jsx`)

Displays status badges with consistent styling and color mapping.

**Props:**
- `status` (string): The status text to display
- `variant` ("default" | "sm"): Size variant
- `className` (string): Additional CSS classes

**Example Usage:**
```jsx
// Before
<span className="px-3 py-1 text-sm rounded font-medium bg-blue-100 text-blue-800">
  In Trust
</span>

// After
<StatusBadge status="In Trust" />
<StatusBadge status="Signed" variant="sm" />
```

**Supported Statuses:**
- In Trust, Not Purchased, Used, Paid
- Available, Assigned
- Signed, On review
- AN, PN, CN

---

### 2. **ViewModeToggle** (`/src/components/ViewModeToggle.jsx`)

Toggle between card and table view modes.

**Props:**
- `viewMode` ("cards" | "table"): Current view mode
- `onViewModeChange` (function): Callback when mode changes
- `label` (string): Label text (default: "View")

**Example Usage:**
```jsx
// Before
<div className="flex items-center gap-2">
  <span className="text-sm text-gray-600">View</span>
  <button
    onClick={() => setPropertyViewMode("cards")}
    className={`p-2 rounded ${propertyViewMode === "cards" ? "bg-gray-200" : "hover:bg-gray-100"}`}
  >
    <LayoutGrid className="w-5 h-5" />
  </button>
  <button
    onClick={() => setPropertyViewMode("table")}
    className={`p-2 rounded ${propertyViewMode === "table" ? "bg-gray-200" : "hover:bg-gray-100"}`}
  >
    <LayoutList className="w-5 h-5" />
  </button>
</div>

// After
<ViewModeToggle
  viewMode={propertyViewMode}
  onViewModeChange={setPropertyViewMode}
/>
```

---

### 3. **Pagination** (`/src/components/Pagination.jsx`)

Pagination controls with rows per page selector.

**Props:**
- `currentPage` (number): Current page number
- `totalPages` (number): Total number of pages
- `rowsPerPage` (number): Current rows per page
- `selectedRowsCount` (number): Number of selected rows
- `totalDataCount` (number): Total number of items
- `onFirstPage` (function): Navigate to first page
- `onPrevPage` (function): Navigate to previous page
- `onNextPage` (function): Navigate to next page
- `onLastPage` (function): Navigate to last page
- `onRowsPerPageChange` (function): Change rows per page
- `rowsPerPageOptions` (array): Options for rows per page (default: [5, 10, 20, 50, 100])

**Example Usage:**
```jsx
// Before (50+ lines of pagination JSX)
<div className="flex items-center justify-between mt-4 text-sm text-gray-600">
  <p>{selectedRows.size} of {data.length} row(s) selected.</p>
  <div className="flex items-center gap-4">
    {/* ... 40+ lines of pagination controls ... */}
  </div>
</div>

// After (1 component)
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  rowsPerPage={rowsPerPage}
  selectedRowsCount={selectedRows.size}
  totalDataCount={cemeteryData?.properties.length || 0}
  onFirstPage={handleFirstPage}
  onPrevPage={handlePrevPage}
  onNextPage={handleNextPage}
  onLastPage={handleLastPage}
  onRowsPerPageChange={handleRowsPerPageChange}
/>
```

---

### 4. **SectionHeader** (`/src/components/SectionHeader.jsx`)

Section headers with title, description, and optional right-aligned actions.

**Props:**
- `title` (string): Section title
- `description` (string): Optional description
- `rightContent` (ReactNode): Optional content for right side (buttons, toggles, etc.)
- `level` ("page" | "section"): Heading level (h1 vs h2)
- `className` (string): Additional CSS classes

**Example Usage:**
```jsx
// Before
<div className="flex items-center justify-between mb-4">
  <div>
    <h2 className="text-2xl font-semibold text-gray-900">Property</h2>
    <p className="text-gray-600">Manage the plots, memorials, and records of rest.</p>
  </div>
  <div className="flex items-center gap-2">
    {/* View toggle */}
  </div>
</div>

// After
<SectionHeader
  title="Property"
  description="Manage the plots, memorials, and records of rest."
  rightContent={<ViewModeToggle viewMode={propertyViewMode} onViewModeChange={setPropertyViewMode} />}
/>
```

---

### 5. **DocumentCard** (`/src/components/DocumentCard.jsx`)

Card for displaying documents with preview and download actions.

**Props:**
- `name` (string): Document name
- `size` (string): File size
- `badges` (array): Optional status badges
- `propertyId` (string): Optional property ID
- `onPreview` (function): Preview handler
- `onDownload` (function): Download handler
- `showTitle` (boolean): Show card title
- `title` (string): Card title text
- `className` (string): Additional CSS classes

**Example Usage:**
```jsx
// Before (30+ lines per document card)
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          {/* SVG icon */}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{doc.name}</p>
          <p className="text-sm text-gray-500">{doc.size}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Preview and Download buttons */}
      </div>
    </div>
  </CardContent>
</Card>

// After
<DocumentCard
  name="[TEMPLATE] Designation of In..."
  size="2.4mb"
  badges={[
    { text: "Signed", className: "bg-green-100 text-green-800" },
    { text: "On review", className: "bg-yellow-100 text-yellow-800" }
  ]}
  onPreview={() => handleComingSoon("Preview")}
  onDownload={() => handleComingSoon("Download")}
  showTitle={true}
  title="Signed document"
/>
```

---

### 6. **BeneficiaryAvatar** (`/src/components/BeneficiaryAvatar.jsx`)

Avatar component for displaying beneficiary information.

**Props:**
- `initials` (string): User initials
- `name` (string): User name
- `badge` (string): Badge text (e.g., "PN", "AN")
- `variant` ("table" | "card"): Display variant
- `className` (string): Additional CSS classes

**Example Usage:**
```jsx
// Before
<div className="flex items-center gap-2">
  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
    <span className="text-xs font-semibold text-gray-700">{beneficiary.initials}</span>
  </div>
  <span className="text-sm text-gray-900">{beneficiary.name}</span>
  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 text-xs rounded">{beneficiary.badge}</span>
</div>

// After
<BeneficiaryAvatar
  initials="MP"
  name="Marie Parker"
  badge="PN"
  variant="table"
/>
```

---

### 7. **FilterSearchBar** (`/src/components/FilterSearchBar.jsx`)

Combined filter, view, and search controls.

**Props:**
- `onFilterClick` (function): Filter button handler
- `onViewClick` (function): View button handler
- `onSearchChange` (function): Search input handler
- `searchValue` (string): Search input value
- `showFilters` (boolean): Show filters button
- `showView` (boolean): Show view button
- `showSearch` (boolean): Show search input
- `filterLabel` (string): Filter button label
- `viewLabel` (string): View button label
- `searchPlaceholder` (string): Search placeholder
- `className` (string): Additional CSS classes

**Example Usage:**
```jsx
// Before (20+ lines)
<div className="flex gap-3 mb-6">
  <Button variant="outline" size="sm" onClick={() => handleComingSoon("Filters")}>
    <Filter className="w-4 h-4 mr-2" />
    Filters
  </Button>
  <Button variant="outline" size="sm" onClick={() => handleComingSoon("View options")}>
    <LayoutList className="w-4 h-4 mr-2" />
    View
  </Button>
  <div className="relative flex-1 max-w-xs">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <Input type="text" placeholder="Search" className="pl-10" />
  </div>
</div>

// After
<FilterSearchBar
  onFilterClick={() => handleComingSoon("Filters")}
  onViewClick={() => handleComingSoon("View options")}
  onSearchChange={(value) => console.log(value)}
/>
```

---

## Refactoring Benefits

### Code Reduction
- **Cemetery.jsx**: ~2900 lines → Can reduce by ~600-800 lines (20-30%)
- **Funeral.jsx**: ~1550 lines → Can reduce by ~400-500 lines (25-30%)
- **Wallet.jsx**: ~307 lines → Can reduce by ~50-100 lines (15-30%)

### Maintainability
- Single source of truth for UI patterns
- Easier to update styling globally
- Consistent behavior across pages
- Better testing capabilities

### Example: Before and After Comparison

**Before (Designation of Interment Rights Section - ~180 lines)**
```jsx
<div className="mb-8">
  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
    Designation of Interment Rights
  </h2>
  <p className="text-gray-600 mb-4">
    You have the ability to transfer ownership of burial rights that belong to you.
  </p>
  {/* Table code... */}
  <Tabs value={designationTab} onValueChange={setDesignationTab}>
    <TabsList className="w-full grid grid-cols-2 mb-4">
      <TabsTrigger value="signed">Signed documents</TabsTrigger>
      <TabsTrigger value="example">Example</TabsTrigger>
    </TabsList>
    {designationTab === "signed" && (
      <div className="w-1/2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Signed document
            </h3>
            <div className="flex items-center justify-between">
              {/* 40+ lines of document display JSX */}
            </div>
          </CardContent>
        </Card>
      </div>
    )}
    {/* More JSX... */}
  </Tabs>
</div>
```

**After (Designation of Interment Rights Section - ~50 lines)**
```jsx
<div className="mb-8">
  <SectionHeader
    title="Designation of Interment Rights"
    description="You have the ability to transfer ownership of burial rights that belong to you."
  />
  {/* Table code... */}
  <Tabs value={designationTab} onValueChange={setDesignationTab}>
    <TabsList className="w-full grid grid-cols-2 mb-4">
      <TabsTrigger value="signed">Signed documents</TabsTrigger>
      <TabsTrigger value="example">Example</TabsTrigger>
    </TabsList>
    {designationTab === "signed" && (
      <div className="w-1/2">
        <DocumentCard
          name="[TEMPLATE] Designation of In..."
          size="2.4mb"
          badges={[
            { text: "Signed", className: "bg-green-100 text-green-800" },
            { text: "On review", className: "bg-yellow-100 text-yellow-800" }
          ]}
          onPreview={() => handleComingSoon("Preview template")}
          onDownload={() => handleComingSoon("Download template")}
          showTitle={true}
          title="Signed document"
        />
      </div>
    )}
    {/* More components... */}
  </Tabs>
</div>
```

---

## Next Steps for Full Refactoring

To complete the refactoring across all pages:

1. **Cemetery.jsx** - Replace all instances of:
   - ViewModeToggle in Property, Services, Merchandise sections
   - StatusBadge in all status displays
   - Pagination in all table sections
   - SectionHeader for all section titles
   - DocumentCard for Certificates and Designation documents
   - BeneficiaryAvatar in tables and cards
   - FilterSearchBar in all filterable sections

2. **Funeral.jsx** - Replace all instances of:
   - ViewModeToggle in Services and Merchandise tabs
   - StatusBadge for service and merchandise statuses
   - Pagination in all table sections
   - SectionHeader for section titles
   - BeneficiaryAvatar in all beneficiary displays
   - FilterSearchBar in all sections

3. **Wallet.jsx** - Replace:
   - DocumentCard for legal documents section
   - SectionHeader for page and section headers

4. **Create Additional Components** (Future):
   - `ItemCard` - For property/service/merchandise cards
   - `PaymentMethodCard` - For wallet payment methods
   - `DataTable` - Generic table component with built-in checkbox selection

---

## Import Example

```jsx
import StatusBadge from "@/components/StatusBadge";
import ViewModeToggle from "@/components/ViewModeToggle";
import Pagination from "@/components/Pagination";
import SectionHeader from "@/components/SectionHeader";
import DocumentCard from "@/components/DocumentCard";
import BeneficiaryAvatar from "@/components/BeneficiaryAvatar";
import FilterSearchBar from "@/components/FilterSearchBar";
```

---

**Total Components Created:** 7
**Estimated Code Reduction:** 1000-1400 lines across 3 pages
**Maintainability Improvement:** Significant - centralized styling and behavior
