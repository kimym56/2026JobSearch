# Challenge 13: Markdown Editor

**Time Limit:** 75 minutes
**Difficulty:** Advanced
**Tech:** React + Vite

## Requirements

Build a markdown editor with live preview.

### Must Have
1. Text area for writing markdown
2. Live preview pane showing rendered HTML
3. Split view (editor | preview side by side)
4. Support basic markdown: headings, bold, italic, links, lists, code blocks
5. Syntax highlighting in editor (optional, can be basic)
6. Toolbar with formatting buttons
7. Save to localStorage
8. Load from localStorage on mount
9. Character/word count

### Bonus (if time permits)
- Switch between edit/preview/split modes
- Dark mode
- Export to HTML/markdown file
- Import markdown file
- Table support
- Image upload and preview
- Emoji picker
- Search and replace
- Vim/Emacs keybindings (just kidding!)

## Markdown Library

You can use a library for parsing:
```bash
npm install marked
# or
npm install react-markdown
```

Or implement basic markdown parsing yourself (simpler but limited).

## Evaluation Criteria

- ✅ Real-time preview works
- ✅ Basic markdown features supported
- ✅ Toolbar buttons work
- ✅ State persists across refreshes
- ✅ UI is clean and usable
- ✅ No lag when typing

## Key Concepts

- Controlled inputs (textarea)
- Markdown parsing
- HTML sanitization (XSS prevention)
- State synchronization
- LocalStorage persistence
- Performance (debouncing updates)

## Suggested Structure

```javascript
import { useState, useEffect } from 'react'
import { marked } from 'marked'

function App() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')

  useEffect(() => {
    // Parse markdown to HTML
    setHtml(marked(markdown))
  }, [markdown])

  return (
    <div className="editor">
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
```

## Toolbar Features

```javascript
const toolbarActions = {
  bold: () => insertAtCursor('**', '**'),
  italic: () => insertAtCursor('*', '*'),
  heading: () => insertAtCursor('# ', ''),
  link: () => insertAtCursor('[', '](url)'),
  code: () => insertAtCursor('`', '`'),
  codeBlock: () => insertAtCursor('```\n', '\n```'),
  list: () => insertAtCursor('- ', ''),
}
```

## Sample Markdown

```markdown
# Welcome to Markdown Editor

## Features

This editor supports:
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- `Inline code`

### Code Blocks

\`\`\`javascript
const greeting = 'Hello World'
console.log(greeting)
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

> This is a quote

---

Made with ❤️
```

## Test Cases

1. Type markdown → preview updates in real time
2. Click bold button → inserts ** markers
3. Type # heading → renders as H1 in preview
4. Add code block → renders with styling
5. Refresh page → content persists
6. Clear all text → preview is empty
7. Type very long text → no lag
8. Switch to preview only → editor hidden
