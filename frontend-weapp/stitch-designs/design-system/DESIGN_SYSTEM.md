# Design System Strategy: The Timeless Monolith

## 1. Overview & Creative North Star: "The Digital Curator"
This design system is not a mere interface; it is a digital gallery. Our Creative North Star, **"The Digital Curator,"** dictates that every pixel must serve the product. We move away from the "busy" nature of traditional e-commerce by embracing **Intentional Asymmetry** and **Editorial Breathing Room**. 

The design breaks the standard "grid-box" template by using overlapping elements—where high-resolution watch photography bleeds into typography—creating a sense of three-dimensional depth. We prioritize a high-contrast, "Print-on-Silk" aesthetic where Chinese characters provide the structural weight and English subtitles provide the rhythmic elegance.

---

## 2. Colors: The Tonal Palette
The palette is rooted in the interplay between deep shadows and metallic light.

*   **Primary (#000000 / `primary`):** Used for core branding and high-impact Chinese headlines.
*   **Deep Charcoal (#1A1A1A / `primary_container`):** The foundation for immersive sections.
*   **Champagne Gold (#D4AF37 / `tertiary`):** Reserved strictly for "Moments of Value"—CTA underlines, active states, or limited-edition labels.
*   **Metallic Silver (#C0C0C0 / `secondary_fixed_dim`):** Used for technical specifications and secondary English subtitles.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for defining sections. Structure must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` (#f9f9f9) to `surface_container_low` (#f3f3f3) to denote a new content block.
2.  **Negative Space:** Using the `20` (7rem) or `24` (8.5rem) spacing tokens to create a natural visual break.

### Signature Textures
Apply a subtle linear gradient to main CTAs using `primary` to `primary_container` at a 45-degree angle. This mimics the "brushed metal" finish of a watch casing, providing a tactile soul that flat hex codes lack.

---

## 3. Typography: The Bilingual Heritage
Our typography is a dialogue between the weight of heritage (Chinese Serif) and the precision of modern engineering (English Sans-Serif).

*   **Display & Headlines (Noto Serif SC):** Use `display-lg` for hero Chinese titles. The high contrast of the serif strokes evokes the craftsmanship of watchmaking.
*   **Body (Manrope):** Use `body-md` for English subtitles and technical descriptions. Manrope's geometric nature provides a "Swiss-made" clinical precision.
*   **The Hierarchy of Meaning:** Primary information is always in Chinese (`on_surface`). Immediately below or adjacent, the English translation should appear in a smaller scale (`label-md`) using the `secondary` color token to act as a rhythmic accent.

---

## 4. Elevation & Depth: Tonal Layering
We reject the use of heavy drop shadows. Depth is an atmosphere, not a decoration.

*   **The Layering Principle:** To highlight a product card, place a `surface_container_lowest` (#ffffff) card atop a `surface_container` (#eeeeee) background. This creates a "Paper-on-Stone" effect.
*   **Ambient Shadows:** If a floating element (like a luxury filter menu) is required, use a shadow with a 60px blur at 4% opacity, tinted with `surface_tint`.
*   **The "Ghost Border":** For interactive inputs, use the `outline_variant` at 20% opacity. It should be felt, not seen.
*   **Glassmorphism:** For navigation bars, use `surface` at 80% opacity with a `20px` backdrop blur. This allows the high-quality watch photography to "bleed" through as the user scrolls, maintaining a sense of continuity.

---

## 5. Components: Refined Primitives

### Buttons (The "Precision Trigger")
*   **Primary:** Rectangular (`0px` radius), `primary` background, `on_primary` text. No borders.
*   **Tertiary (Editorial):** A simple `tertiary` (Gold) underline (1px) beneath a `label-md` text. Used for "Discover More."
*   **State:** On hover, the background transitions to a subtle metallic gradient.

### Input Fields
*   **Style:** A single 1px line at the bottom (`outline_variant` at 40% opacity). 
*   **Interaction:** Upon focus, the line transforms into `tertiary` (Gold) and expands from the center. Labels are in `label-sm` English above `body-lg` Chinese input.

### Cards & Lists
*   **The Rule of Silence:** Forbid divider lines. Use `spacing-12` (4rem) to separate list items. 
*   **Photography:** Cards must use a 1:1 or 4:5 aspect ratio. Product imagery should be shot on "Deep Charcoal" backgrounds to blend seamlessly with `primary_container` sections.

### Tooltips
*   Use `inverse_surface` with `inverse_on_surface` text. Shape must be strictly square (`0px` radius).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme vertical white space. If a section feels "comfortable," add 2rem more space.
*   **Do** treat Chinese characters as graphic elements. Adjust tracking (letter-spacing) slightly to allow them to breathe.
*   **Do** use "Champagne Gold" sparingly. It is a surgical tool for focus, not a primary decorative color.

### Don't:
*   **Don't** use rounded corners. Everything in this system is defined by sharp, precision-cut 90-degree angles (0px radius).
*   **Don't** use generic iconography. If an icon is needed, it must be ultra-thin (0.5px to 1px stroke) to match the `outline` token.
*   **Don't** use "pure" grey. Always use the provided neutral tokens which have a slight tonal shift to prevent the UI from looking "dead" or "default."

### Accessibility Note:
While we lean into high-contrast blacks and whites, ensure all `secondary` text on `surface` backgrounds meets WCAG AA standards by verifying the contrast of the Silver (#C0C0C0) against the background. Use the `outline` token if higher legibility is required.

---

## Color Palette Reference

### Primary Colors
- Primary: #000000
- Primary Container: #1A1A1A
- On Primary: #ffffff
- On Primary Container: #858383

### Secondary Colors
- Secondary: #5d5e5f
- Secondary Container: #e0dfdf
- On Secondary: #ffffff
- On Secondary Container: #626363
- Secondary Fixed: #e3e2e2
- Secondary Fixed Dim: #c6c6c6

### Tertiary Colors (Gold Accent)
- Tertiary: #735c00
- Tertiary Container: #cca730
- On Tertiary: #ffffff
- On Tertiary Container: #4f3e00
- Tertiary Fixed: #ffe088
- Tertiary Fixed Dim: #e9c349

### Surface Colors
- Surface: #f9f9f9
- Surface Bright: #f9f9f9
- Surface Container: #eeeeee
- Surface Container High: #e8e8e8
- Surface Container Highest: #e2e2e2
- Surface Container Low: #f3f3f3
- Surface Container Lowest: #ffffff
- Surface Dim: #dadada
- Surface Tint: #5f5e5e
- Surface Variant: #e2e2e2

### Semantic Colors
- Background: #f9f9f9
- On Background: #1a1c1c
- On Surface: #1a1c1c
- On Surface Variant: #444748
- Outline: #747878
- Outline Variant: #c4c7c7
- Inverse Surface: #2f3131
- Inverse On Surface: #f1f1f1
- Inverse Primary: #c8c6c5
- Error: #ba1a1a
- On Error: #ffffff
- Error Container: #ffdad6
- On Error Container: #93000a
