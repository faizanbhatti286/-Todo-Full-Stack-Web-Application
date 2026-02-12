---
name: frontend-skill
description: Build responsive frontend pages and reusable components with clean layouts and styling.
---

# Frontend Skill

## Instructions

1. **Page Structure**
   - Define clear page layouts
   - Use semantic HTML elements
   - Separate pages by feature or route

2. **Component Design**
   - Break UI into reusable components
   - Keep components focused and small
   - Pass data via props or state

3. **Layout System**
   - Use Flexbox and Grid
   - Build responsive layouts
   - Handle spacing and alignment consistently

4. **Styling**
   - Apply consistent color and typography
   - Use utility classes or CSS modules
   - Support light and dark themes

5. **Interactivity**
   - Handle user events
   - Manage local UI state
   - Display loading and error states

## Core Concepts

### Pages vs Components
- Pages define routes and structure
- Components are reusable UI blocks
- Avoid duplicating layout logic

### Responsive Design
- Mobile-first layouts
- Use breakpoints thoughtfully
- Adapt typography and spacing

### Styling Approaches
- CSS Modules
- Utility-first CSS (Tailwind)
- Styled components

## Best Practices
- Use semantic HTML for accessibility
- Keep components stateless when possible
- Reuse layout primitives
- Avoid inline styles
- Optimize for performance
- Test UI on multiple screen sizes

## Example Component
```tsx
function Card({ title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
