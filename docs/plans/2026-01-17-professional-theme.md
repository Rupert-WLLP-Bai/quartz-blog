# Professional Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Upgrade the blog's aesthetic to a professional "editorial" style and fix the homepage graph by adding "Recent Notes" and a global "Tag Cloud".

**Architecture:**
- **Components:** New `AllTags` component to aggregate tags from all files. Reuse existing `RecentNotes`.
- **Layout:** Modify `quartz.layout.ts` to inject these components specifically into the `index` (homepage) layout.
- **Styling:** Use `custom.scss` to override default Quartz variables and add specific tweaks for typography and spacing.

**Tech Stack:** TypeScript, React (JSX), SCSS, Quartz v4.

---

### Task 1: Create `AllTags` Component

**Files:**
- Create: `quartz/components/AllTags.tsx`
- Modify: `quartz/components/index.ts`

**Step 1: Create the Component Logic**
Create `quartz/components/AllTags.tsx` with logic to iterate over `allFiles` and collect unique tags.

```typescript
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, getAllSegmentPrefixes, resolveRelative } from "../util/path"

const AllTags: QuartzComponent = ({ fileData, allFiles, displayClass }: QuartzComponentProps) => {
  const tags = new Set<string>()
  allFiles.forEach((file) => {
    if (file.frontmatter?.tags) {
      file.frontmatter.tags.forEach((tag) => tags.add(tag))
    }
  })

  const tagArray = Array.from(tags).sort()

  if (tagArray.length > 0) {
    return (
      <div class={classNames(displayClass, "all-tags-container")}>
        <h3>Explore by Tag</h3>
        <ul class="tags">
          {tagArray.map((tag) => {
            const linkDest = resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)
            return (
              <li>
                <a href={linkDest} class="internal tag-link">
                  #{tag}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

AllTags.css = \`
.all-tags-container {
  margin-top: 2rem;
}
.all-tags-container h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--darkgray);
}
\`

export default (() => AllTags) satisfies QuartzComponentConstructor
```

**Step 2: Export the Component**
Add `export { AllTags } from "./AllTags"` (or similar) to `quartz/components/index.ts`.
*Note: Check `quartz/components/index.ts` to see if it uses named exports or default re-exports.*

**Step 3: Verify Compilation (Dry Run)**
Run `npx quartz build --serve=false` to ensure no TS errors.

**Step 4: Commit**
```bash
git add quartz/components/AllTags.tsx quartz/components/index.ts
git commit -m "feat: add AllTags component"
```

---

### Task 2: Update Homepage Layout

**Files:**
- Modify: `quartz.layout.ts`

**Step 1: Analyze Current Layout**
Read `quartz.layout.ts` to identify the `defaultContentPageLayout` and if there's a specific override for `index`. If not, we need to create one.

**Step 2: Define Homepage Layout**
In `quartz.layout.ts`, define a new `homePageLayout` (or modify the logic to use specific components for the index page).
*Actually, Quartz allows specific logic in the layout definition.*
We will modify `defaultContentPageLayout.beforeBody` or `afterBody` (or `left`/`right` columns) to include `RecentNotes` and `AllTags`, wrapped in a conditional for the homepage.

*Better approach for Quartz v4:*
Quartz layout configuration is usually static per page type, but we can use `Component.ConditionalRender` to show these ONLY on the homepage.

**Plan:**
In `defaultContentPageLayout.beforeBody` (or `right` column, per user preference, but user asked for "homepage hub"), we will add:

```typescript
// Inside defaultContentPageLayout.beforeBody or similar
Component.ConditionalRender({
  component: Component.RecentNotes({ title: "Recent Notes", limit: 5 }),
  condition: (page) => page.fileData.slug === "index",
}),
Component.ConditionalRender({
  component: Component.AllTags(),
  condition: (page) => page.fileData.slug === "index",
}),
```
*Wait, `RecentNotes` is usually quite large. Putting it in `beforeBody` is good for a "blog feed" look. Putting `AllTags` there makes sense too.*

**Refined Step 2:**
Edit `quartz.layout.ts`.
Import `AllTags` from `./quartz/components`.
Add the conditional renders to `defaultContentPageLayout.beforeBody` (after `ArticleTitle` and `ContentMeta`).

**Step 3: Verify Layout**
Run `npx quartz build` and check if the index page is generated correctly.

**Step 4: Commit**
```bash
git add quartz.layout.ts
git commit -m "feat: add RecentNotes and AllTags to homepage layout"
```

---

### Task 3: Professional Styling (CSS)

**Files:**
- Modify: `quartz/styles/custom.scss`

**Step 1: Apply Typography and Spacing Tweaks**
Add the following SCSS to `quartz/styles/custom.scss`:

```scss
/* Professional/Editorial Polish */

// 1. Typography Hierarchy
h1, h2, h3, h4, h5, h6 {
  margin-top: 2em; // More space above headers for separation
  margin-bottom: 0.8em;
  font-weight: 600;
  letter-spacing: -0.02em; // Tighter, more modern tracking
}

h1 {
  margin-top: 0; // Reset for title
  font-size: 2.5rem;
}

// 2. Dashboard-style Sidebars (Cleaner)
.left, .right {
  font-size: 0.9rem; // Slightly smaller text for UI elements
  
  // Make the explorer list cleaner
  .explorer {
    ul {
      padding-left: 1rem;
    }
    li {
      margin: 0.2rem 0;
    }
  }
}

// 3. Elegant Links
a.internal {
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
  
  &:hover {
    text-decoration: none;
    border-bottom-color: var(--secondary);
    background-color: transparent !important; // Remove default highlight if desired, or keep it subtle
  }
}

// 4. Tag Cloud Styling (Global)
.tags {
  gap: 0.5rem;
  
  .tag-link {
    background-color: var(--lightgray);
    color: var(--darkgray);
    border-radius: 4px; // Square-ish is more pro/tech than full rounded
    padding: 0.2rem 0.6rem;
    font-size: 0.85rem;
    font-family: var(--codeFont); // Technical look for tags
    text-decoration: none;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: var(--secondary);
      color: var(--light);
    }
  }
}

// 5. Recent Notes Styling
.recent-notes {
  border-top: 1px solid var(--lightgray);
  margin-top: 3rem;
  padding-top: 2rem;
  
  h3 {
    margin-top: 0;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
    color: var(--gray);
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 1rem;
    
    a {
      font-weight: 600;
      display: block;
      font-size: 1.1rem;
    }
    
    .meta {
      font-size: 0.8rem;
      color: var(--gray);
    }
  }
}
```

**Step 2: Verify Styles**
Run build. (Since we can't visually verify in headless mode, we rely on the CSS validity and standard SCSS practices).

**Step 3: Commit**
```bash
git add quartz/styles/custom.scss
git commit -m "style: apply professional theme polish"
```
