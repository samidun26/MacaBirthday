# Bundled fonts

Two typefaces ship with this project in `src/assets/fonts/`. Both are licensed under the
SIL Open Font License 1.1, which permits bundling and redistribution — including inside a
deployed website — as long as the fonts aren't sold on their own and the notice below
travels with them.

| Font | Used for | Author | License |
| --- | --- | --- | --- |
| **Press Start 2P** | headings, buttons, labels | CodeMan38 (Cody Boisclair) | SIL OFL 1.1 |
| **VT323** | body copy, terminals | Peter Hull | SIL OFL 1.1 |

Only the `latin` and `latin-ext` subsets are included, each scoped with a `unicode-range`
in `src/styles/fonts.css` so the browser downloads `latin-ext` only if the page actually
needs it.

They're self-hosted rather than loaded from Google Fonts on purpose: no third-party
request on the critical path, no flash of fallback text, and the page still renders
correctly offline or on a bad connection.

Full license text: <https://openfontlicense.org/open-font-license-official-text/>

---

**SIL Open Font License 1.1 — permission notice**

> Copyright © 2011 The Press Start 2P Project Authors.
> Copyright © 2011 The VT323 Project Authors.
>
> This Font Software is licensed under the SIL Open Font License, Version 1.1.
> This license is copied below, and is also available with a FAQ at:
> <https://openfontlicense.org>
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of the Font
> Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and
> unmodified copies of the Font Software, subject to the conditions of the license.
>
> The Font Software may be bundled, embedded, redistributed and/or sold with any software
> provided that any reserved names are not used by derivative works. The Font Software may
> not be sold by itself.
>
> THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
