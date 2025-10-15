# Rich Text Editor Components

A modular, reusable rich text editor built with Tiptap for React/Next.js applications.

## Features

- ✅ **Text Formatting**: Bold, Italic, Underline
- ✅ **Lists**: Bullet lists and Numbered lists
- ✅ **Links**: Add and remove links
- ✅ **HTML Output**: Direct HTML generation
- ✅ **Modular Design**: Small, reusable components
- ✅ **TypeScript**: Full type safety
- ✅ **Responsive**: Mobile-friendly design

## Components

### 1. `RichTextEditorField` (Main Component)
The main component you'll use in forms with label, error handling, and validation.

```tsx
import { RichTextEditorField } from '@/components/rich-text-editor';

<RichTextEditorField
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="Start typing..."
  label="Description"
  required
  error={errors.description}
/>
```

### 2. `RichTextEditorWrapper`
Wrapper component that handles editor initialization and configuration.

```tsx
import { RichTextEditorWrapper } from '@/components/rich-text-editor';

<RichTextEditorWrapper
  content={content}
  onChange={(html) => setContent(html)}
  placeholder="Enter content..."
  showToolbar={true}
  editable={true}
/>
```

### 3. `RichTextEditor`
Core editor component with toolbar and content area.

```tsx
import { RichTextEditor } from '@/components/rich-text-editor';

<RichTextEditor
  editor={editor}
  placeholder="Start typing..."
  showToolbar={true}
/>
```

### 4. `TextFormattingToolbar`
Toolbar with formatting buttons.

```tsx
import { TextFormattingToolbar } from '@/components/rich-text-editor';

<TextFormattingToolbar editor={editor} />
```

### 5. `ToolbarButton`
Individual toolbar button component.

```tsx
import { ToolbarButton } from '@/components/rich-text-editor';

<ToolbarButton
  onClick={() => editor.chain().focus().toggleBold().run()}
  isActive={editor.isActive('bold')}
  title="Bold"
>
  <Bold className="h-4 w-4" />
</ToolbarButton>
```

## Usage Examples

### Basic Usage
```tsx
import { RichTextEditorField } from '@/components/rich-text-editor';

function MyForm() {
  const [content, setContent] = useState('');

  return (
    <RichTextEditorField
      value={content}
      onChange={setContent}
      label="Content"
      placeholder="Start typing your content..."
    />
  );
}
```

### With Form Validation
```tsx
import { RichTextEditorField } from '@/components/rich-text-editor';

function MyForm() {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <RichTextEditorField
      value={content}
      onChange={setContent}
      label="Description"
      placeholder="Enter description..."
      required
      error={errors.description}
    />
  );
}
```

### Read-only Mode
```tsx
import { RichTextEditorField } from '@/components/rich-text-editor';

<RichTextEditorField
  value={content}
  onChange={setContent}
  editable={false}
  showToolbar={false}
  label="Preview"
/>
```

### Custom Styling
```tsx
import { RichTextEditorField } from '@/components/rich-text-editor';

<RichTextEditorField
  value={content}
  onChange={setContent}
  className="my-custom-editor"
  placeholder="Custom styled editor..."
/>
```

## Props

### RichTextEditorField Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | HTML content |
| `onChange` | `(html: string) => void` | - | Callback when content changes |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar |
| `editable` | `boolean` | `true` | Enable/disable editing |
| `label` | `string` | - | Field label |
| `error` | `string` | - | Error message |
| `required` | `boolean` | `false` | Required field indicator |

### RichTextEditorWrapper Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | Initial HTML content |
| `onChange` | `(html: string) => void` | - | Content change callback |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `className` | `string` | - | Additional CSS classes |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar |
| `editable` | `boolean` | `true` | Enable/disable editing |

## Demo

Visit `/rich-text-editor-demo` to see the editor in action with all features demonstrated.

## Dependencies

- `@tiptap/react` - Core Tiptap React integration
- `@tiptap/starter-kit` - Basic editor functionality
- `@tiptap/extension-link` - Link support
- `@tiptap/extension-underline` - Underline formatting
- `@tiptap/extension-bullet-list` - Bullet lists
- `@tiptap/extension-ordered-list` - Numbered lists
- `@tiptap/extension-list-item` - List items

## File Structure

```
src/components/rich-text-editor/
├── index.ts                      # Main exports
├── toolbar-button.tsx           # Individual toolbar button
├── text-formatting-toolbar.tsx  # Formatting toolbar
├── editor-content-area.tsx      # Editor content area
├── rich-text-editor.tsx         # Core editor component
├── rich-text-editor-wrapper.tsx # Editor wrapper with hooks
└── rich-text-editor-field.tsx   # Form field component
```

## Customization

### Adding New Formatting Options
1. Install the required Tiptap extension
2. Add it to the editor configuration in `rich-text-editor-wrapper.tsx`
3. Add a button to `text-formatting-toolbar.tsx`

### Custom Styling
Override the default styles by passing custom `className` props or modifying the component styles directly.

### Extending Functionality
The modular design allows you to easily extend functionality by:
- Adding new toolbar components
- Creating custom editor configurations
- Building specialized editor variants
