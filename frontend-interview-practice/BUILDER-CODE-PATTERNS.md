# Builder Component Code Patterns

A learning reference documenting the Tailwind CSS usage and React/TypeScript patterns from the Builder components.

---

## Table of Contents

- [Tailwind CSS Patterns](#tailwind-css-patterns)
  - [Layout & Flexbox](#layout--flexbox)
  - [Grid](#grid)
  - [Sizing](#sizing)
  - [Spacing](#spacing)
  - [Typography](#typography)
  - [Colors & Opacity](#colors--opacity)
  - [Borders & Rounded Corners](#borders--rounded-corners)
  - [Shadows](#shadows)
  - [Position & Z-Index](#position--z-index)
  - [Transitions & Animations](#transitions--animations)
  - [Interactive States](#interactive-states)
  - [Group Modifiers](#group-modifiers)
  - [Arbitrary Variants](#arbitrary-variants)
  - [Form Styling](#form-styling)
  - [Gradients](#gradients)
  - [Custom Values](#custom-values)
- [React Patterns](#react-patterns)
  - [Component Organization](#component-organization)
  - [Custom Hooks Usage](#custom-hooks-usage)
  - [Stale Closure Prevention](#stale-closure-prevention)
  - [Event Handling](#event-handling)
  - [Accessibility Patterns](#accessibility-patterns)
  - [Conditional Rendering](#conditional-rendering)
  - [Callback Patterns](#callback-patterns)
- [TypeScript Patterns](#typescript-patterns)
  - [Type Imports](#type-imports)
  - [Interface Design](#interface-design)
  - [Union Types](#union-types)
  - [Type Utilities](#type-utilities)
  - [Type Narrowing](#type-narrowing)

---

## Tailwind CSS Patterns

### Layout & Flexbox

```tsx
// Basic flex container
<div className="flex items-center justify-between">

// Flex column with gap
<div className="flex flex-col gap-3">

// Flex with auto margins for centering
<div className="flex-1 flex items-center justify-center">

// Prevent shrinking
<aside className="w-80 shrink-0">

// Full height flex layout
<div className="h-screen flex flex-col overflow-hidden">
```

**Key Classes:**
| Class | Purpose |
|-------|---------|
| `flex-1` | Grow to fill available space |
| `shrink-0` | Prevent element from shrinking |
| `gap-{n}` | Consistent spacing between children |
| `items-center` | Vertical centering |
| `justify-between` | Space between items |

---

### Grid

```tsx
// 3-column grid with gap
<div className="grid grid-cols-3 gap-2">
  {items.map((item) => (
    <div key={item.id} className="aspect-square" />
  ))}
</div>
```

**Note:** `aspect-square` maintains 1:1 ratio for grid items.

---

### Sizing

```tsx
// Fixed dimensions
<div className="w-8 h-8">   {/* 32px */}
<div className="w-10 h-10"> {/* 40px */}
<div className="w-16 h-16"> {/* 64px */}

// Panel widths
<aside className="w-80">    {/* 320px - Components panel */}
<aside className="w-75">    {/* Custom 300px - Properties panel */}

// Max width constraint
<div className="w-full max-w-md mx-auto">

// Full viewport height
<div className="h-screen">

// Percentage-based with padding trick (aspect ratio)
<div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
  <div className="absolute inset-0">{/* 3:4 ratio content */}</div>
</div>
```

---

### Spacing

```tsx
// Consistent padding scale
<div className="p-5">           {/* 20px all sides */}
<div className="px-3 py-1.5">   {/* Horizontal 12px, Vertical 6px */}

// Negative margin for tight layouts
<button className="p-1 -m-1">   {/* Larger click area without visual size */}

// Auto margin for pushing content
<div className="mt-auto">       {/* Push to bottom */}

// Section spacing
<div className="mb-6">          {/* Margin bottom for sections */}
<div className="border-t pt-4"> {/* Border with padding */}
```

---

### Typography

```tsx
// Text sizes with weight
<h1 className="text-lg font-bold">
<h2 className="text-base font-semibold">
<p className="text-sm font-medium">
<span className="text-xs font-bold uppercase tracking-wider">

// Small text with arbitrary value
<p className="text-[10px] text-gray-400">

// Monospace numbers for alignment
<span className="text-xs text-gray-400 tabular-nums">50px</span>

// Preserve whitespace
<p className="whitespace-pre-line">{multilineText}</p>
<p className="whitespace-nowrap">No wrapping</p>

// Decorative text
<h2 className="font-serif text-white drop-shadow-lg">
```

**Key Classes:**
| Class | Purpose |
|-------|---------|
| `tabular-nums` | Fixed-width numbers (great for sliders, counters) |
| `tracking-wider` | Increased letter spacing for uppercase text |
| `whitespace-pre-line` | Preserve line breaks from text content |
| `drop-shadow-lg` | Text shadow for readability on images |

---

### Colors & Opacity

```tsx
// Gray scale for text hierarchy
<h1 className="text-gray-900">   {/* Headings */}
<p className="text-gray-700">    {/* Body */}
<span className="text-gray-500"> {/* Secondary */}
<span className="text-gray-400"> {/* Tertiary/Disabled */}

// Background with opacity
<div className="bg-black/20">    {/* 20% opacity black overlay */}
<div className="bg-brand/5">     {/* 5% opacity brand for selection */}
<div className="bg-brand/10">    {/* 10% opacity brand for icons */}

// Text with opacity
<p className="text-white/80">    {/* Semi-transparent white */}

// Semantic colors for actions
<button className="text-red-600 border-red-200 hover:bg-red-50">
  Delete
</button>
```

**Color Hierarchy Pattern:**
```
Primary actions:    bg-brand, text-white
Secondary actions:  bg-white, border-gray-200, text-gray-700
Destructive:        text-red-600, border-red-200
```

---

### Borders & Rounded Corners

```tsx
// Border thickness
<div className="border">      {/* 1px */}
<div className="border-2">    {/* 2px - for selection states */}

// Directional borders
<div className="border-b border-gray-100">    {/* Bottom divider */}
<div className="border-l border-gray-200">    {/* Sidebar border */}

// Dashed borders for drop zones
<div className="border-2 border-dashed border-gray-200">

// Rounded corner scale
<button className="rounded-sm">   {/* Subtle rounding */}
<div className="rounded-lg">      {/* Standard cards/buttons */}
<div className="rounded-xl">      {/* Larger cards */}
<div className="rounded-full">    {/* Circles, pills */}
```

---

### Shadows

```tsx
// Shadow scale
<div className="shadow-sm">       {/* Subtle elevation */}
<div className="shadow-md">       {/* Cards */}
<div className="shadow-lg">       {/* Modals, dropdowns */}
<div className="shadow-xl">       {/* Drag overlays */}

// Custom colored shadow
<button className="shadow-[0_1px_2px_rgba(238,43,75,0.3)]">
  {/* Brand-colored glow effect */}
</button>
```

---

### Position & Z-Index

```tsx
// Sticky header
<header className="sticky top-0 z-20">

// Absolute positioning within relative parent
<div className="relative">
  <div className="absolute inset-0">  {/* Full overlay */}
  <div className="absolute top-1 right-1"> {/* Corner position */}
</div>

// Z-index layering
// z-10: Floating elements
// z-20: Headers, navigation
// z-50: Dragging elements, modals
```

---

### Transitions & Animations

```tsx
// Standard color transition
<button className="transition-colors duration-200 hover:bg-gray-100">

// Multiple properties
<div className="transition-[border-color,box-shadow,transform,opacity]">

// Transform transitions
<div className={`
  transition-[background-color,transform,margin] duration-200
  ${isActive ? "scale-100 my-2" : "scale-0 my-0"}
`}>

// Opacity fade
<div className="opacity-0 group-hover:opacity-100 transition-opacity">
```

**Custom Transition Syntax:** `transition-[prop1,prop2,prop3]` for specific properties.

---

### Interactive States

```tsx
// Hover states
<button className="
  hover:bg-gray-100
  hover:border-gray-300
  hover:translate-x-1
">

// Focus states (accessibility)
<button className="
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-brand/50
">

// Cursor states
<div className="
  cursor-grab
  active:cursor-grabbing
">

// Disabled-like states
<div className="opacity-50 pointer-events-none">
```

**Best Practice:** Use `focus-visible` instead of `focus` to only show focus rings for keyboard navigation.

---

### Group Modifiers

```tsx
// Parent with group class
<div className="group">
  {/* Children responding to parent hover */}
  <div className="
    text-gray-600
    group-hover:text-brand
    group-hover:bg-brand/5
  ">

  {/* Show element on parent hover */}
  <button className="opacity-0 group-hover:opacity-100">
    Remove
  </button>
</div>
```

**Use Cases:**
- Card hover effects affecting children
- Reveal buttons on hover
- Icon color changes

---

### Arbitrary Variants

```tsx
// Target child elements
<button className="[&_i]:text-base">
  <i className="fas fa-rocket"></i> {/* Icon will be text-base */}
</button>

// Arbitrary value in class
<p className="text-[10px]">Very small text</p>

// Important modifier (Tailwind v4)
<div className="border-brand!">  {/* !important applied */}
```

---

### Form Styling

```tsx
// Consistent input styling
const inputBaseStyles = `
  w-full rounded-lg border-gray-200 text-sm
  focus:border-brand focus:ring-2 focus:ring-brand/20
  focus-visible:outline-none transition-colors
`;

// Range slider styling
<input
  type="range"
  className="
    w-full h-1.5 bg-gray-200 rounded-lg
    appearance-none cursor-pointer accent-brand
  "
/>
```

**Key Classes:**
| Class | Purpose |
|-------|---------|
| `appearance-none` | Remove native browser styling |
| `accent-brand` | Custom accent color for form controls |

---

### Gradients

```tsx
// Linear gradient (Tailwind v4 syntax)
<div className="bg-linear-to-br from-rose-100 to-pink-100">

// Gradient overlay for text readability
<div className="bg-linear-to-br from-gray-100 to-gray-200">
```

---

### Custom Values

```tsx
// Custom widths defined in tailwind.config
<aside className="w-75">        {/* 300px */}
<input className="min-w-200-px"> {/* 200px min-width */}
<div className="min-h-600-px">  {/* 600px min-height */}

// Custom breakpoint
<button className="hidden desktop:flex">
```

---

## React Patterns

### Component Organization

```tsx
// =============================================================================
// Types
// =============================================================================
interface ComponentProps { /* ... */ }

// =============================================================================
// Constants
// =============================================================================
const DEFAULT_VALUES = { /* ... */ };

// =============================================================================
// Sub-components
// =============================================================================
const SubComponent = () => { /* ... */ };

// =============================================================================
// Main Component
// =============================================================================
const MainComponent = () => { /* ... */ };

export default MainComponent;
```

**Benefits:** Clear separation of concerns, easy navigation, consistent structure.

---

### Custom Hooks Usage

```tsx
// Combine related state
const [background, setBackground] = useState({
  imageUrl: "",
  overlayOpacity: 40,
  positionX: 50,
  positionY: 50,
});

// Sync local state with props
useEffect(() => {
  if (selectedComponent?.type === "Cover") {
    const coverProps = selectedComponent.props as CoverProps;
    setBackground({
      imageUrl: coverProps.mainPhoto || "",
      overlayOpacity: 40,
      positionX: coverProps.backgroundPosition?.x ?? 50,
      positionY: coverProps.backgroundPosition?.y ?? 50,
    });
  }
}, [selectedComponent]);
```

---

### Stale Closure Prevention

```tsx
// Problem: Event handlers capture stale values
// Solution: Store callbacks in refs

const onPositionChangeRef = useRef(onPositionChange);
const onSnapChangeRef = useRef(onSnapChange);

// Keep refs updated
useEffect(() => {
  onPositionChangeRef.current = onPositionChange;
  onSnapChangeRef.current = onSnapChange;
});

// Use in event handlers (inside useEffect)
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // Use ref instead of closure value
    onPositionChangeRef.current(id, { x: newX, y: newY });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, [isDragging]); // No need to include callbacks in deps
```

**When to Use:** Event listeners added in `useEffect` that need access to latest callback props.

---

### Event Handling

```tsx
// Prevent event bubbling
const handleMouseDown = useCallback((e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(true);
}, []);

// Keyboard navigation
const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
  const step = e.shiftKey ? 5 : 1; // Shift for larger steps

  switch (e.key) {
    case "ArrowLeft":
      newX = Math.max(5, position.x - step);
      break;
    case "ArrowRight":
      newX = Math.min(95, position.x + step);
      break;
    // ...
    default:
      return; // Exit early if not handled
  }

  e.preventDefault();
  onPositionChange(id, { x: newX, y: newY });
}, [position, id, onPositionChange]);
```

---

### Accessibility Patterns

```tsx
// Draggable element with full keyboard support
<div
  role="slider"
  tabIndex={0}
  aria-label={`Position ${id} text overlay`}
  aria-valuetext={`${position.x}% horizontal, ${position.y}% vertical`}
  onMouseDown={handleMouseDown}
  onKeyDown={handleKeyDown}
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
>

// Button with aria-label for icon-only buttons
<button
  type="button"
  aria-label="Undo"
  className="w-9 h-9 flex items-center justify-center"
>
  <i className="fas fa-undo" aria-hidden="true"></i>
</button>

// Clickable div that acts as button
<div
  role="button"
  tabIndex={0}
  onClick={() => onSelect?.(item.type)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(item.type);
    }
  }}
>
```

**Checklist:**
- [ ] `role` attribute for semantic meaning
- [ ] `tabIndex={0}` for keyboard focusability
- [ ] `aria-label` for descriptive text
- [ ] `aria-hidden="true"` on decorative elements
- [ ] Keyboard event handlers (`Enter`, `Space`, arrow keys)
- [ ] Visible focus indicators

---

### Conditional Rendering

```tsx
// Ternary for two states
<div className={isSelected ? "border-brand" : "border-transparent"}>

// Multiple conditions with template literals
<div className={`
  group flex items-center gap-3 p-3 rounded-xl
  ${isSelected ? "bg-brand/5 border-2 border-brand" : "bg-white border hover:border-brand/40"}
  ${isDragging ? "opacity-30" : ""}
`}>

// Conditional field visibility
{field.showWhen ? (
  field.showWhen.values.includes(getFieldValue(field.showWhen.field)) && (
    <PropertyField field={field} />
  )
) : (
  <PropertyField field={field} />
)}

// Early return pattern
if (!selectedComponent) {
  return <EmptyState />;
}
```

---

### Callback Patterns

```tsx
// Optional callback with optional chaining
onSelect?.(item.type);

// useCallback with proper dependencies
const handlePropertyChange = useCallback(
  (key: string, value: string) => {
    if (!selectedComponent) return;
    onUpdate(selectedComponent.id, { [key]: value });
  },
  [selectedComponent, onUpdate]
);

// Inline update with functional setState
setInvitationData((prev) => ({
  ...prev,
  components: prev.components.map((c) =>
    c.id === id ? { ...c, props: { ...c.props, ...props } } : c
  ),
}));
```

---

## TypeScript Patterns

### Type Imports

```tsx
// Import types separately for clarity
import type {
  BuilderComponent,
  ComponentType,
  CoverProps,
} from "../../types/builderTypes";

// Regular imports for values
import { COMPONENT_MAP, type FieldConfig } from "./config/componentConfig";
```

**Benefits:** Clear distinction between runtime and compile-time imports, better tree-shaking.

---

### Interface Design

```tsx
// Props interface with optional callbacks
interface ComponentsPanelProps {
  selectedComponent?: string | null;
  onComponentSelect?: (type: ComponentType) => void;
}

// Configuration interfaces with optional feature flags
interface ComponentDefinition {
  type: ComponentType;
  icon: React.ReactNode;
  label: string;
  description: string;
  category: ComponentCategory;
  fields: FieldConfig[];
  showTypography?: boolean;   // Feature flags
  showBackground?: boolean;
}

// Nested interfaces for complex data
interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "date" | "textarea" | "gallery" | "select";
  placeholder?: string;
  options?: SelectOption[];
  showWhen?: { field: string; values: string[] }; // Conditional config
}
```

---

### Union Types

```tsx
// String literal union for component types
export type ComponentType =
  | "Cover"
  | "Invitation"
  | "Calendar"
  | "ImgGallery"
  | "Location"
  | "Quiz"
  | "Account"
  | "Comment";

// Category union
export type ComponentCategory = "layout" | "wedding";

// Field type union
type: "text" | "date" | "textarea" | "gallery" | "select";
```

---

### Type Utilities

```tsx
// Record for type-indexed maps
const COMPONENT_MAP: Record<ComponentType, ComponentDefinition> =
  COMPONENT_DEFINITIONS.reduce((acc, def) => {
    acc[def.type] = def;
    return acc;
  }, {} as Record<ComponentType, ComponentDefinition>);

// Partial for updates
onUpdate: (id: string, props: Partial<BuilderComponent["props"]>) => void;

// keyof for type-safe object access
const handleFontSizeChange = (field: keyof CoverTypography, fontSize: number) => {
  onTypographyChange({
    ...typography,
    [field]: { ...typography[field], fontSize },
  });
};
```

---

### Type Narrowing

```tsx
// Type assertion for component props
switch (component.type) {
  case "Cover":
    return <CoverPreview props={component.props as CoverProps} />;
  case "Invitation":
    return <InvitationPreview props={component.props as InvitationProps} />;
  // ...
}

// satisfies operator for type checking while preserving literal types
data: {
  type: item.type,
  item: {
    type: item.type,
    icon: item.icon,
    title: item.label,
    description: item.description,
  } satisfies ComponentItem,
}

// Type casting with unknown intermediate
const props = selectedComponent.props as Record<string, unknown>;
const parentValue = props[parentKey] as Record<string, unknown> | undefined;
```

---

## Quick Reference

### Most Used Tailwind Combinations

```tsx
// Card/Panel styling
"bg-white border border-gray-200 rounded-lg shadow-sm"

// Interactive button
"px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"

// Section divider
"border-t border-gray-100 pt-4"

// Form input
"w-full rounded-lg border-gray-200 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20"

// Icon container
"w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50"

// Overlay for click-to-reveal
"absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
```

### Component Architecture Pattern

```
MainView.tsx
├── Header.tsx (sticky header with actions)
├── LeftPanel.tsx (sidebar with list)
├── CenterPanel.tsx (main content area)
└── RightPanel.tsx (properties/details)
```

Each panel is a self-contained component with its own sub-components defined in the same file or a dedicated directory.
