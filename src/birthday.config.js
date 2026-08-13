/* ==========================================================================================
 *
 *   ██╗  ██╗███████╗██████╗     ██╗   ██╗██████╗  ██╗    ██████╗
 *   ██║  ██║██╔════╝██╔══██╗    ██║   ██║╚════██╗███║   ██╔═████╗
 *   ███████║█████╗  ██████╔╝    ██║   ██║ █████╔╝╚██║   ██║██╔██║
 *   ██╔══██║██╔══╝  ██╔══██╗    ╚██╗ ██╔╝██╔═══╝  ██║   ████╔╝██║
 *   ██║  ██║███████╗██║  ██║     ╚████╔╝ ███████╗ ██║██╗╚██████╔╝
 *   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝      ╚═══╝  ╚══════╝ ╚═╝╚═╝ ╚═════╝
 *
 *   >>> THIS IS THE ONLY FILE YOU NEED TO EDIT. <<<
 *
 *   Everything she sees — her name, the puzzles, the food, the memories,
 *   the Instagram account, the final message — is configured right here.
 *   You never have to touch the app code.
 *
 *   Anything marked  ★ CHANGE ME  is a placeholder. Replace it.
 *
 *   Read the notes above each section: some values are wired into puzzle
 *   logic, so the puzzle regenerates itself automatically when you edit them.
 *
 * ========================================================================================== */

export const BIRTHDAY_CONFIG = {
  /* ----------------------------------------------------------------------------------------
   * 1. THE BASICS
   * -------------------------------------------------------------------------------------- */

  girlfriendName: 'Maca', //  ★ CHANGE ME — shown throughout the experience
  age: 21, //  her new age. Drives "v21.0", the 21-click easter egg, everything.
  yourName: 'Dimas', //  ★ CHANGE ME — signs the git commit + the final message

  /* Shown on the boot screen as the machine "detects" her. Keep it short. */
  buildCodename: 'HER', //  the product name: HER v21.0

  /* ----------------------------------------------------------------------------------------
   * 2. THE PAYOFF — the secret Instagram account
   *
   *    This is what the whole experience unlocks.
   *
   *    NOTE ON SECRECY: by default these values live here in plain text. That is fine
   *    for a birthday gift — but if you want it airtight (so that even "View Source"
   *    can't spoil it), run:
   *
   *        npm run lock
   *
   *    That encrypts the account behind the answers to her own puzzles and gives you a
   *    string to paste into `secretPayload` below. Once `secretPayload` is set, the two
   *    plain-text fields below are ignored and can be blanked out entirely.
   * -------------------------------------------------------------------------------------- */

  secretInstagramUsername: '@her.v21.build', //  ★ CHANGE ME — displayed on the reveal card
  secretInstagramUrl: 'https://www.instagram.com/her.v21.build/', //  ★ CHANGE ME — the actual link

  /* Leave as null for plain-text mode. Paste the output of `npm run lock` here to encrypt. */
  secretPayload: null,

  /* ----------------------------------------------------------------------------------------
   * 3. THE FINAL MESSAGE
   *
   *    Shown right before the Instagram button. Blank lines separate paragraphs.
   *    Write it in your own voice — this is the part she'll screenshot.
   * -------------------------------------------------------------------------------------- */

  finalMessage: `21 years.

21 years of becoming the person you are today. The programmer. The designer. The food lover. The person who somehow manages to make my life more chaotic and more fun at the same time.

I couldn't fit everything I love about you into one birthday build. So I made you a little project instead.

Happy 21st birthday ❤️

I hope I get to see every version of you that comes next.`,

  /* Small signature line under the message. Set to null to hide. */
  signature: 'built with too many commits, by Dimas', //  ★ CHANGE ME

  /* ----------------------------------------------------------------------------------------
   * 4. QUICK FACTS
   *
   *    These are surfaced in the boot sequence and the memory database. They make the
   *    whole thing feel like it knows her. Fill them in honestly — they're flavour,
   *    not puzzle answers (except where noted in section 5).
   * -------------------------------------------------------------------------------------- */

  favoriteFood: 'Ayam Geprek', //  ★ CHANGE ME
  favoriteRestaurant: 'that tiny place near campus', //  ★ CHANGE ME
  firstMeeting: 'Campus library, second floor', //  ★ CHANGE ME
  firstDate: 'The coffee shop that plays music too loud', //  ★ CHANGE ME
  favoriteMemory: 'The night we stayed up until 4am talking about nothing', //  ★ CHANGE ME

  /* ----------------------------------------------------------------------------------------
   * 5. THE PUZZLES
   *
   *    Five puzzles + one final authentication. Each should take 30s–2min.
   *    Every puzzle has a hint button, so nothing here can hard-block her.
   * -------------------------------------------------------------------------------------- */

  puzzles: {
    /* ---- PUZZLE 01 — BINARY ------------------------------------------------------------
     * She decodes 8-bit ASCII. The binary shown is generated from this word at runtime,
     * so you can change it to anything (her name works beautifully: "MACA").
     * Keep it short — 3 to 5 letters is the sweet spot. */
    binary: {
      word: 'HER',
    },

    /* ---- PUZZLE 02 — GIT COMMIT --------------------------------------------------------
     * A fake `git show`. The lines the commit ADDED (the green `+` lines) spell out a
     * hidden branch name with their first letters — an acrostic.
     *
     * You just set the word. The app picks themed words for each letter automatically,
     * so if you change `word` to "LOVE" the diff rewrites itself to spell L-O-V-E.
     *
     * Works with any A–Z word. 3–8 letters reads best. */
    git: {
      word: 'maca', //  ★ CHANGE ME — try her name or a nickname
      branchPrefix: 'feature/', //  she can answer with or without this prefix
    },

    /* ---- PUZZLE 03 — DESIGN ------------------------------------------------------------
     * A type specimen sheet. A handful of letters sit a few pixels off the baseline and
     * are a hair heavier than the rest. Those letters spell the answer.
     *
     * There's a "Guides" toggle in the mock toolbar — flipping it exposes the anomaly
     * instantly, which is exactly what a designer would reach for.
     *
     * The grid is generated from this word, so any A–Z word works. */
    design: {
      word: 'BASELINE', //  the letters that break the grid spell this
    },

    /* ---- PUZZLE 04 — FOOD --------------------------------------------------------------
     * A birthday menu. She picks one dish per course — the dish SHE would order.
     *
     * ★ THIS IS THE MOST FUN ONE TO CUSTOMIZE. ★
     *
     * How the puzzle works: the FIRST LETTERS of the correct dishes spell a word
     * (by default: C-A-K-E). So there are two ways to solve it — know her taste, or
     * notice the pattern. Both feel clever.
     *
     * If you customize: keep the first letters of the `correct` dishes spelling
     * something, or set `orderCodeIsWord: false` below and it becomes a pure
     * "do you know her?" puzzle instead. Either way the app stays in sync.
     *
     * `correct` is the index (0, 1 or 2) of the right option in that course. */
    food: {
      restaurantName: 'CAFÉ 21', //  ★ CHANGE ME — try your actual favourite place
      tagline: 'table for two · reservation under her name',
      orderCodeIsWord: true, //  set false if your dishes don't spell a word
      courses: [
        {
          course: 'STARTER',
          correct: 0,
          options: [
            { emoji: '🧄', name: 'Cheesy Garlic Bread', note: 'she steals half of mine every time' },
            { emoji: '🍟', name: 'Truffle Fries', note: 'good, but not the one' },
            { emoji: '🥠', name: 'Spring Rolls', note: 'ordered once, never again' },
          ],
        },
        {
          course: 'MAIN',
          correct: 1,
          options: [
            { emoji: '🍝', name: 'Carbonara', note: 'a safe choice' },
            { emoji: '🍗', name: 'Ayam Geprek', note: 'level 5 spicy, no negotiation' },
            { emoji: '🍜', name: 'Beef Ramen', note: 'for rainy days only' },
          ],
        },
        {
          course: 'DESSERT',
          correct: 2,
          options: [
            { emoji: '🍫', name: 'Molten Lava Cake', note: 'too rich, she says' },
            { emoji: '☕', name: 'Tiramisu', note: 'always tempted' },
            { emoji: '🥧', name: 'Key Lime Pie', note: 'the one she pretends to share' },
          ],
        },
        {
          course: 'DRINK',
          correct: 0,
          options: [
            { emoji: '🧋', name: 'Es Teh Manis', note: 'the correct answer to everything' },
            { emoji: '🍵', name: 'Matcha Latte', note: 'for aesthetic reasons' },
            { emoji: '☕', name: 'Iced Americano', note: 'only during finals week' },
          ],
        },
      ],
      /* Nudges, revealed one at a time by the hint button. */
      hints: [
        'She would never, ever skip dessert.',
        'Take the first letter of each dish you picked. The right order spells something you put candles on.',
      ],
    },

    /* ---- PUZZLE 05 — PERSONAL MEMORY ---------------------------------------------------
     * A SQL console querying OUR_MEMORIES. One row's value is redacted, and she has to
     * type it back in. This should be something ONLY she would know.
     *
     * Make `answer` short and unambiguous — one or two words. Add every spelling you'd
     * accept to `alsoAccept` so she never gets stuck on a typo. Matching already ignores
     * case, spaces, punctuation and accents. */
    memory: {
      /* The rows in the results table. `redacted: true` marks the one she must fill in.
       * Exactly one row should be redacted. Add or remove rows freely. */
      records: [
        { id: 1, key: 'FIRST_MEETING', value: 'Campus library, second floor' }, //  ★ CHANGE ME
        { id: 2, key: 'FIRST_FOOD', value: 'Instant noodles at 2am' }, //  ★ CHANGE ME
        { id: 3, key: 'FIRST_TRIP', value: 'The beach, with the bad playlist' }, //  ★ CHANGE ME
        { id: 4, key: 'FIRST_DATE', value: null, redacted: true }, //  ← the puzzle
        { id: 5, key: 'INSIDE_JOKE', value: '"it is not a bug"' }, //  ★ CHANGE ME
        { id: 6, key: 'FAVORITE_PLACE', value: 'Wherever the food is' }, //  ★ CHANGE ME
      ],
      /* The question shown above the input. */
      question: 'Restore the corrupted row. Where did we go on our first date?',
      answer: 'The Coffee Shop', //  ★ CHANGE ME — the value of the redacted row
      alsoAccept: ['coffee shop', 'the coffee shop that plays music too loud'], //  ★ generous alternates
      hints: [
        'It is the place you complained was too loud. You went anyway.', //  ★ CHANGE ME
        'Two words. You still call it that.', //  ★ CHANGE ME
      ],
    },

    /* ---- FINAL AUTHENTICATION ----------------------------------------------------------
     * "Where is the birthday build deployed?" → Instagram. */
    finalAuth: {
      question: 'Where is the birthday build deployed?',
      answer: 'Instagram',
      alsoAccept: ['ig', 'insta', 'the gram'],
      hints: [
        'Not Vercel. Not Netlify. Somewhere you check far more often.',
        'It has a little camera icon.',
      ],
    },
  },

  /* ----------------------------------------------------------------------------------------
   * 6. THE BOOT SEQUENCE
   *
   *    The terminal lines that run before the title card. Each one types out in order.
   *    Add your own — inside jokes land really well here.
   * -------------------------------------------------------------------------------------- */

  bootLines: [
    'Loading user profile...',
    'Loading memories...',
    'Loading food dependencies...',
    'Loading design modules...',
    'Loading programming skills...',
    'Loading boyfriend dependency...',
  ],

  /* ----------------------------------------------------------------------------------------
   * 7. EASTER EGGS  (all optional, none required to finish)
   * -------------------------------------------------------------------------------------- */

  easterEggs: {
    konamiMessage: 'You really had to try that, didn\'t you?',
    /* Revealed by the hidden element in the status bar (the `//` glyph, bottom-right). */
    todoList: [
      'tell her I love her',
      'buy her food',
      'stop her from stealing my food',
    ],
    /* Clicking the version badge in the header this many times unlocks an achievement.
     * Defaults to her age. */
    achievementName: 'Birthday Girl',
  },

  /* ----------------------------------------------------------------------------------------
   * 8. BEHAVIOUR
   * -------------------------------------------------------------------------------------- */

  options: {
    /* Remember her progress if she closes the tab or her phone locks mid-puzzle. */
    saveProgress: true,
    /* Sound is OFF by default and always optional — she can toggle it in the header. */
    soundEnabled: false,
    /* Show the boot sequence every visit, or only the first. */
    replayBootSequence: true,
  },
};

export default BIRTHDAY_CONFIG;
