# ScoreMyPrompt Share Card - Visual Reference

## Generated Card Layout

The OG image generator creates a 1200x630px card with the following layout:

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  P ScoreMyPrompt                                                           │
│                                                                         │
│  ┌──────────┐              │                                           │
│  │    78    │  GRADE        │ Top 23% in Marketing                      │
│  │  /100    │                                                          │
│  │ [BLUE]   │  A             ──────────────────────────                │
│  └──────────┘  LEVEL         You rank among the top performers...     │
│                │                                                        │
│  PROMPT SCORE  Skilled Prompter                                        │
│                                                                         │
│  P ████████░░    R ███████░░░    O ████████░░                         │
│  M █████████░    P ██████░░░░    T ████████░░                         │
│                                                                         │
│  What's your score? → scoremyprompt.com    ScoreMyPrompt by PromptTribe        │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘

Background: Dark Gradient (#0a0f1a → #0f172a)
```

## Color Palette

### Grade Colors
- **S - Green (#10b981)**: Exceptional (85+)
- **A - Blue (#3b82f6)**: Skilled (75-84)
- **B - Amber (#f59e0b)**: Competent (60-74)
- **C - Orange (#f97316)**: Developing (45-59)
- **D - Red (#ef4444)**: Needs Work (<45)

### Background
- Primary Gradient Start: `#0a0f1a`
- Primary Gradient End: `#0f172a`
- Accent (20% opacity): Grade color

### Text Colors
- Primary Text: `#ffffff` (white)
- Secondary Text: `#94a3b8` (slate-400)
- Tertiary Text: `#64748b` (slate-500)
- Muted Text: `#cbd5e1` (slate-200)

### UI Elements
- Bar Background: `#334155` (slate-700)
- Border: `rgba(148, 163, 184, 0.2)`

## Social Media Preview Examples

### X/Twitter Preview
```
[Your Name]

Check out my PROMPT Score on ScoreMyPrompt - I got an 78!

[CARD IMAGE HERE]
I got a 78 PROMPT Score on ScoreMyPrompt!
I'm a Skilled Prompter, ranking in the top 23% of Marketing...

Link Preview: scoremyprompt.com/share/abc123
```

### LinkedIn Preview
```
[Your Name] [Details]

I got a 78 PROMPT Score on ScoreMyPrompt! I'm a Skilled Prompter,
ranking in the top 23% of Marketing professionals.

[CARD IMAGE HERE]

Share this to inspire your network!
```

### Generic Social Media
```
[CARD IMAGE (1200x630)]

Title: I got a 78 PROMPT Score on ScoreMyPrompt!
Description: I'm a Skilled Prompter, ranking in the top 23% of Marketing
professionals. See how you compare on ScoreMyPrompt.
URL: scoremyprompt.com/share/abc123
```

## Dimension Bars Visualization

Each dimension is shown as a horizontal bar with label:

```
PROMPT Dimensions (6 total)

P [████████░░░░]  80/100  Precision
R [███████░░░░░]  75/100  Relevance
O [████████░░░░]  80/100  Organization
M [█████████░░░]  78/100  Methodology
S [███████░░░░░░] 70/100  Personalization
T [████████░░░░]  75/100  Timeframe

Bar Colors:
  85+:  Green  (#10b981)
  75-84: Blue   (#3b82f6)
  60-74: Amber  (#f59e0b)
  <60:   Red    (#ef4444)
```

## Responsive Considerations

**Note:** OG images are static 1200x630px (non-responsive by nature).
However, social platforms display at different sizes:

- **Desktop Twitter**: ~600x315px
- **Mobile Twitter**: Full width, aspect ratio preserved
- **LinkedIn**: ~450x235px
- **Facebook**: Varies by placement

The design is optimized for viewing at 1200x630px but will scale nicely
on all platforms due to the clean, high-contrast design.

## Design Elements

### Header Section
- Logo: 40x40px gradient box with "P"
- Logo Colors: Grade color → Blue gradient
- Text: "ScoreMyPrompt" in 22px bold, system font
- Spacing: 40px margin bottom

### Score Section (Left)
- Score Box: 140x140px border with 4px grade-colored border
- Score Font: 56px bold (900 weight)
- Score Color: Grade color
- "/100" indicator: 10px text
- Label: "PROMPT SCORE" in 13px small caps

### Grade Section (Right)
- Grade Font: 48px bold (900 weight)
- Grade Label: "GRADE"
- Level Font: 18px semi-bold
- Level Label: "LEVEL"
- Vertical spacing between sections

### Dimension Bars
- 6 bars arranged in 2 rows of 3
- Each bar: 120x8px (bar only)
- Label: 12px bold
- Spacing: 40px between columns, 16px between rows

### Benchmark Section
- Border top: 1px solid rgba(148, 163, 184, 0.2)
- Title: 16px semi-bold
- Subtext: 12px, 1.5 line height
- Spacing: 12px gap between elements

### Footer CTA
- Layout: Flex between
- Left: Share message + URL
- Right: Attribution text
- Font sizes: 13px (message), 11px (attribution)
- Font weight: 500 (message), 400 (attribution)

## Implementation in React/JSX

The card is generated using React components within @vercel/og:

```jsx
<div style={{
  display: 'flex',
  width: '1200px',
  height: '630px',
  background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 100%)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}}>
  {/* Header */}
  {/* Score Section */}
  {/* Grade Section */}
  {/* Dimensions Section */}
  {/* Benchmark Section */}
  {/* Footer CTA */}
</div>
```

## Browser/Platform Support

### Twitter/X
- Card Type: `summary_large_image`
- Image Size: 1200x630px recommended
- Display: Full-width image with text below
- Support: Excellent

### LinkedIn
- Open Graph: Full support
- Image Size: 1200x627px recommended
- Display: Image + metadata
- Support: Excellent

### Facebook
- Open Graph: Full support
- Image Size: 1200x630px recommended
- Display: Image + title + description
- Support: Excellent

### Other Platforms
- WhatsApp: Uses OG image and link preview
- Telegram: Uses OG image
- Slack: Uses OG image and title
- Discord: Uses OG image and metadata
- Email: May use OG image in preview

## Accessibility Considerations

- High contrast: All text meets WCAG AA standards
- Color blindness: Not reliant on color alone for information
  - Grade also shown as letter (S/A/B/C/D)
  - Dimension bars show filled/empty state
  - Percentile shown as text
- Font sizes: All readable at intended display sizes
- Text alternatives: Could add alt text via content-security headers

## Performance Notes

- Single SVG element for dimension bars (lightweight)
- No external font loading (uses system fonts)
- No JavaScript execution (static image generation)
- Cache-friendly: Can be cached by CDN
- Generation time: <500ms per image on Vercel Edge

## Customization Options

While the current implementation is optimized for ScoreMyPrompt, you could
extend it with:

- Custom branding text
- Custom color schemes per client/organization
- Dynamic background patterns
- Additional metrics/dimensions
- User avatars or profile images
- Animated bars (if served as video or GIF)
