# Design Brief

**Purpose & Tone:** Unlimited AI photo generation with personal ownership—confident, creative, minimal chrome. Users arrive authenticated and immediately focus on creating.

**Visual Direction:** Modern tech minimalism with cyan accents. Deep slate primary, warm neutrals, vibrant cyan for CTAs. Tight radii (4px), clean grid gaps, subtle shadows for elevation.

**Differentiation:** Gallery persists generation history seamlessly. Generating state shows progress elegantly. Lightbox modal for immersive full-view. Clean, distraction-free interface.

## Palette

| Color          | Light L        | Dark L         | Usage                                      |
|:---------------|:---------------|:---------------|:-------------------------------------------|
| Primary        | 0.4 0.1 250    | 0.75 0.15 180  | Nav, branding, secondary interactions      |
| Accent         | 0.65 0.2 180   | 0.75 0.2 180   | Generate button, highlights, active states |
| Destructive    | 0.5 0.22 28    | 0.6 0.2 30     | Delete actions only                        |
| Background     | 0.96 0 0       | 0.12 0 0       | Page background                            |
| Card           | 1.0 0 0        | 0.16 0 0       | Gallery items, panels                      |
| Foreground     | 0.25 0 0       | 0.92 0 0       | Body text                                  |
| Muted          | 0.92 0 0       | 0.2 0 0        | Secondary UI, borders                      |

## Typography

| Tier    | Font                    | Use                             |
|:--------|:------------------------|:--------------------------------|
| Display | Bricolage Grotesque     | Page title, section heads        |
| Body    | DM Sans                 | Copy, form labels, descriptions |
| Mono    | Geist Mono              | Technical text, file names      |

## Structural Zones

| Zone           | Style                                              |
|:---------------|:---------------------------------------------------|
| Header         | `bg-card border-b`, slate text, centered logo      |
| Main Panel     | `bg-background`, generation form & preview area   |
| Gallery Grid   | `bg-background`, responsive columns, card hover   |
| Auth Modal     | `bg-card shadow-hover`, centered, clean            |
| Lightbox       | `fixed bg-black/90`, full-screen image + close    |

## Spatial Composition

Grid 4 columns (lg), 2 columns (md), 1 column (sm). Consistent 16px gutters. Card padding: 16px. Generation input: full-width form, centered.

## Elevation & Depth

Base layer: `bg-background`. Elevated cards: `shadow-elevation`. Interactive hover: `shadow-hover`. No overlapping shadows—clean layering only.

## Component Patterns

- **Buttons**: Accent for primary (Generate), muted for secondary (Delete). 32px height, 4px border-radius.
- **Cards**: Gallery items are image + metadata on hover. Lightbox shows full image + prompt text.
- **Form**: Text input (full-width), placeholder text muted, focus ring cyan accent.
- **Loading**: Fade-in animation on new images, scale-in on gallery load.

## Motion

Smooth transitions (300ms ease-out) for all interactive elements. Fade-in on image load. Scale-in on gallery card appearance. No bouncy or excessive motion.

## Constraints

Unlimited image generation (no quota). Light mode default, dark mode supported. Mobile-responsive. Clean, distraction-free interface—no decorative patterns or ambient graphics.

## Signature Detail

Gallery images load with subtle scale-in animation. Hover state on image cards raises shadow slightly. Lightbox modal uses semi-transparent dark overlay for immersion.
