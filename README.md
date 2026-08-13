# HER v21.0 — A Birthday Build

An interactive birthday surprise: five puzzles and a final authentication that unlock a
secret Instagram account. It's dressed as a piece of developer tooling — boot sequence,
git diff, type specimen, SQL console — because that's the language she actually speaks,
drawn as pixel art in a bakery palette: buttercream and strawberry, with cakes, cupcakes,
flowers and hearts drifting behind the interface.

She solves puzzles → the build "deploys" → the account is revealed → the message lands.

---

## 1. Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

`npm run dev` also serves on your local network, so you can open it on your phone while
you're editing.

---

## 2. Customize it

**Everything lives in one file: [`src/birthday.config.js`](src/birthday.config.js).**

Open it and replace anything marked `★ CHANGE ME`. You never need to touch the app code.
The puzzles regenerate themselves from the config — change the git word from `maca` to
`love` and the fake commit rewrites its own diff to spell L-O-V-E.

The 15-minute version, in priority order:

| What | Where in the config | Why it matters |
| --- | --- | --- |
| Her name, your name, her age | section 1 | used everywhere |
| The Instagram account | section 2 | the payoff |
| The final message | section 3 | the part she'll screenshot |
| The menu (puzzle 04) | `puzzles.food` | the most fun one to personalize |
| The memory question (puzzle 05) | `puzzles.memory` | the most personal one |
| Boot sequence lines | `bootLines` | inside jokes land really well here |

### The puzzles, and what each one needs from you

| # | Puzzle | Answer comes from | Notes |
| --- | --- | --- | --- |
| 01 | Binary → ASCII | `puzzles.binary.word` | Deliberately easy. It teaches the format. |
| 02 | Git commit | `puzzles.git.word` | The added `+` lines spell it as an acrostic. Any A–Z word works. |
| 03 | Type specimen | `puzzles.design.word` | A few glyphs sit 3px off the baseline. A **Guides** toggle in the toolbar exposes them. |
| 04 | The canteen tray | — | **No wrong answers.** She takes whatever she likes, as much as she likes. |
| 05 | Memory database | `puzzles.memory.answer` | The only one that can't be reasoned out. |
| — | Final question | `puzzles.finalAuth.answer` | Not a puzzle. Just the question. |

**Puzzle 04 is deliberately not a test.** Every dish is selectable, multi-select works
across every course, and any combination is accepted — the only rule is `minPicks`. It
exists so that halfway through a set of puzzles she hits a list of her own favourite food
and just gets to enjoy it. Add, remove and reorder dishes freely; nothing can break.

Because there's no correct answer to derive a key from, the encryption uses
`puzzles.food.keyword` instead — a fixed word that's never shown and never typed. Leave
it alone unless you re-run `npm run lock` afterwards.

**Answer matching is forgiving.** Case, spaces, punctuation and accents are all ignored,
and each puzzle takes a list of `alsoAccept` alternates. Add every phrasing you'd accept —
she should never lose to a typo.

**Every puzzle has hints**, revealed one at a time, ending close to a giveaway. Nobody gets
stuck on a birthday present.

---

## 3. Hide the secret properly (optional, recommended)

By default the Instagram handle sits in the config in plain text — which means it's also in
the built JavaScript. She's a programmer. If there's any chance she pokes at the source
before finishing, close that door:

```bash
npm run lock
```

It asks for the username, password and login URL, encrypts them behind the answers to her
own puzzles, writes the result to `secretPayload`, and blanks the plain-text fields. The account
genuinely cannot be decrypted without solving the puzzles — verified: after locking, the
handle appears nowhere in `dist/`.

Non-interactive if you prefer:

```bash
npm run lock -- --username "ourglitch.exe" --password "…" --url "https://www.instagram.com/accounts/login/"
```

The answers **are** the key, so re-run `npm run lock` any time you change a puzzle answer.
If you forget, the reveal screen shows a warning telling you exactly that — and only you
would ever see it, since it means the build isn't finished.

This is obfuscation, not cryptography. It defeats "View Source", which is the only attacker
that matters here.

---

## 4. Deploy it

```bash
npm run build        # output lands in dist/
```

`dist/` uses relative paths, so it works from any URL or subdirectory.

**Netlify (drag and drop)** — go to [app.netlify.com/drop](https://app.netlify.com/drop)
and drag the `dist` folder onto the page. You get a live HTTPS link in about ten seconds.
Rename the site in *Site settings → Change site name* to something less random.

**Vercel** — `npx vercel --prod` from the project root, or import the repo at
[vercel.com/new](https://vercel.com/new). Vercel detects Vite automatically; the defaults
(`npm run build` → `dist`) are correct.

Either way: **open the link on your own phone first and play the whole thing through.**
That's the last real test.

---

## 5. Notes

**Look and feel.** Pixel bakery. Two bitmap typefaces (Press Start 2P for headings and
chrome, VT323 for body copy and terminals), a buttercream-and-strawberry palette, zero
rounded corners, borders drawn as stacked box-shadows so every edge lands on a whole pixel,
buttons that drop into their own shadow when pressed, and stepped rather than eased motion.

The backdrop is hand-drawn pixel art — cakes, cupcakes, flowers, cherries, hearts,
sparkles and cats (sitting and loafed) as inline SVG on an integer grid with `crispEdges`,
so they stay genuinely pixel-art at any size instead of blurring. No image files. Cards are opaque, so sprites
that land behind one are simply hidden and never fight the text.

**Fonts are bundled, not fetched** — no third-party request on the critical path, and the
page renders correctly offline. Both are SIL Open Font License; see
[LICENSES-FONTS.md](LICENSES-FONTS.md). Only the `latin` subset loads unless the text needs
`latin-ext`, so it costs about 30 KB.

**Responsive.** Type is fluid (`clamp`) rather than stepped between breakpoints, so
nothing jumps at a threshold. Safe-area insets for the notch and home indicator, `100dvh`
so the layout doesn't move when Safari's bar collapses, 20px inputs so iOS never zooms on
focus, and 44px touch targets throughout. Dedicated handling for small phones (≤380px), a
short-viewport rule for phones in landscape, and a framed layout from 900px up — a wider
screen gets more room around the box, not a wider box.

Verified clean across ten viewports (320px through 1920px, both orientations) on all eight
screens: no horizontal overflow, nothing painting outside the viewport, no clipped text and
no control under 40px.

**Progress is saved.** If her phone locks or she closes the tab mid-puzzle, the title screen
offers to resume. Turn it off with `options.saveProgress: false`.

**Sound is off by default** and never autoplays — the header toggle is the only thing that
starts it, which is also the user gesture iOS Safari requires. Turning it on starts an
original chiptune love song (square lead, triangle bass, soft arpeggio) that loops for as
long as she's reading, plus the interface blips. Everything is synthesised live in
`src/lib/music.js` — no audio files, nothing to download.

A note on why it's original: the ask was for a current romantic hit, pixelated. A chiptune
cover still reproduces the melody, and the melody is the part that's copyrighted — changing
the instrument doesn't change that. So the tune is written from scratch in the same
register. The chord movement under it (I–V–vi–IV) is a common progression and isn't
protectable; the melody on top is ours.

**Reduced motion** is respected everywhere: the boot sequence resolves instantly, confetti
doesn't run, animations collapse.

**Easter eggs** (none required to finish):

- Konami code — ↑ ↑ ↓ ↓ ← → ← → B A
- Tap the version badge in the header 21 times
- The `//` at the right of the status bar
- Open the browser console

**Testing shortcut.** `?step=<id>` jumps straight to any screen —
`?step=food`, `?step=reveal`, and so on. IDs are `boot`, `title`, `binary`, `git`,
`design`, `food`, `memory`, `auth`, `reveal`. Progress isn't saved in this mode. She has no
reason to find it, but don't send her a link with it attached.

**Accessibility caveat.** Puzzle 03 is visual by nature and can't be solved by a screen
reader. Its hints describe the mechanism, but the answer isn't in the DOM — that's a
deliberate trade against spoiling it for someone who opens DevTools.

---

## 6. Layout

```
src/
  birthday.config.js     ← the only file you need to edit
  App.jsx                flow state machine, easter eggs, persistence
  components/            Shell, PuzzleFrame, HintPanel, Toast, Modal, PartyBackdrop
  screens/               one file per screen, in flow order
  lib/                   puzzle generators, cipher, audio, music, confetti
  styles/                fonts → tokens → base → components → screens
  assets/fonts/          Press Start 2P + VT323 (OFL, see LICENSES-FONTS.md)
scripts/lock.mjs         encrypts the secret behind her answers
```

Re-skinning is a single-file job: the palette, both typefaces, the pixel-border recipe and
the motion tokens all live at the top of `src/styles/tokens.css`. The background sprites and
their scatter positions are one array at the bottom of
`src/components/PartyBackdrop.jsx` — add, remove or move them there.

`PuzzleFrame` is the chassis every puzzle sits in — header, answer field, wrong-answer
feedback, hints, success banner, advance button. Puzzles supply only their own middle
section, which is why all five feel like the same piece of software.

Happy birthday to her. 🎂
