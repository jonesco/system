# Jonesco system: principles

The vernacular shared by every Jonesco site. These say *how it should feel*; `system.css` holds the values and `patterns.css` the proven pieces. A site may bend any of this when it has a reason. Write the reason down in that site's stylesheet.

## Look
- **Black, white, newsprint.** The base on every site. Newsprint is "paper": use it behind artwork and printed things, and to block in or contain a section. Never as the whole page background.
- **One accent per site.** Magenta (`--accent`) is the default. It marks hover and the one thing that's active; it is not decoration.
- **Yellow is the highlight.** Black tags with yellow type, hover on black, text selection.
- **Thick rules for structure, thin rules for lists.** 4px under section titles and tile titles; 2px between list rows.
- **Square corners on anything with a border.** No rounded boxes. (Photos of rounded real objects can stay rounded.)
- **No shadows or gradients on UI.** The only shadow is a soft one under a photographed product, like a book cover.

## Type
- **One hero per page in caps.** The page's main title (and big display moments like a section heading or a video slam) is Trade Gothic Bold Condensed No. 20, all caps, tight (`-.01em`), big. Condensed type reads small, so size it up.
- **Titles you read, sentence case.** Titles that sit in groups or inside content (tile titles, headings within a page, list item titles) are Trade Gothic Bold No. 2 in sentence case. Too many caps shouts.
- **Labels:** Trade Gothic Bold No. 2, all caps, small and slightly open (`.03em`): nav, buttons, tags, list labels, footer links. Labels are short, so caps work.
- **Body:** Libre Franklin. Plain, readable, sentence case.
- **Curly quotes and apostrophes** in copy (’ “ ”). Straight ones only in code.
- **American spelling.**

## Layout
- One centered column, `--wrap` 1200px, 24px gutters (16px on phones).
- Sections are separated by thick rules or by switching between white and black blocks, not by both at once.
- The page closes on black: a black band (contact, next project) runs straight into the black footer.
- Headings get the same space above and below everywhere: 56px from the rule, 32px to the content.
- Everything lines up on the column's edges, including full-width bands.

## Behavior
- **Header:** black bar, white wordmark. A home page may start big and shrink on scroll; inner pages use the compact bar.
- **Hover:** color changes take `.15s`. Links on black turn yellow; titles on white turn the accent.
- **One highlight at a time.**
- Respect reduced motion.

## Voice
- Short, specific, a little dry. Let the work and the art be the personality.
- No marketing filler. Say what the thing is.

## Art
- Hand-drawn work is the hero. Line art goes on newsprint, multiplied, so the paper reads as paper.
- Logos and wordmarks are reversed to pure white on black.
