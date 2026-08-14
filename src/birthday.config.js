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

  secretInstagramUsername: 'ourglitch.exe', //  ★ the account she logs into
  secretInstagramPassword: 'angelsunderthebed', //  ★ shown on the reveal card with the username
  /* The reveal button sends her to Instagram's login page so she can sign in as the
   * account, rather than to a profile she can only look at. */
  secretInstagramUrl: 'https://www.instagram.com/accounts/login/',

  /* Leave as null for plain-text mode. Paste the output of `npm run lock` here to encrypt. */
  secretPayload: null,

  /* ----------------------------------------------------------------------------------------
   * 3. THE FINAL MESSAGE
   *
   *    Shown right before the Instagram button. Blank lines separate paragraphs.
   *    Write it in your own voice — this is the part she'll screenshot.
   * -------------------------------------------------------------------------------------- */

  finalMessage: `hai bayik aku.

ciee, udah 21. look at you — becoming the person you are today, and honestly, she's my favourite person.

thank you for coming into my life, even if we met this late. we didn't miss anything. we just opened our story at the page where it starts getting good, and I fully intend to make the rest of it louder, sillier and happier than anything either of us has had so far.

maybe I can't give you the world yet. but I hope you're happy with this little thing I built for you, and I hope you enjoy your days with me — and the presents I've been hiding XD

I love you so much.

I hope I get to see every version of you that comes next <3`,

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
      word: 'NYAPNYU', //  ★ the letters that break the grid spell this

      /* Shown above the specimen sheet. Its job is to tell her WHAT KIND of word
       * she's hunting for, without giving away a single letter. */
      prompt:
        'This specimen sheet shipped with a visual bug, and the word hiding in it is ' +
        'one of ours — the thing we always say to each other instead of the three ' +
        'serious words. Find it.',

      /* Revealed one at a time by the hint button: the first two are about *how* to
       * look, the last one points at the tool that makes it obvious. */
      hints: [
        'Designers notice what everyone else ignores. Look at how the letters sit, not at what they spell.',
        'Every letter rests on the same line. Almost every letter.',
        'There is a Guides toggle in the toolbar. Use it — that is exactly what it is for.',
      ],
    },

    /* ---- PUZZLE 04 — FOOD --------------------------------------------------------------
     * The canteen tray. She picks whatever she wants, as many as she wants, and there is
     * no wrong answer — every combination is accepted.
     *
     * It's the one screen that isn't a test. It exists so she smiles at a list of her own
     * favourites halfway through, then carries on.
     *
     * Add, remove or reorder anything below freely. `minPicks` is the only rule. */
    food: {
      restaurantName: 'KANTIN v21',
      tagline: 'ambil apa aja · semuanya bener',
      minPicks: 1, //  she just has to put something on the tray
      /* A fixed word that feeds the encryption key. It is never shown and never typed —
       * it only needs to stay the same between `npm run lock` and the reveal. */
      keyword: 'NYAM',
      courses: [
        {
          course: 'PEMBUKA',
          options: [
            { emoji: '🥔', name: 'Perkedel Kentang', note: 'the only correct way to start' },
            { emoji: '🍗', name: 'Nuggets', note: 'dinosaur shaped if we are lucky' },
            { emoji: '🍳', name: 'Eyoy', note: 'telur, but said properly' },
          ],
        },
        {
          course: 'UTAMA',
          options: [
            { emoji: '🍖', name: 'SSB Hj Hesti', note: 'worth every minute of the drive' },
            { emoji: '🍜', name: 'Bakmi', note: 'any weather, any hour' },
            { emoji: '🍛', name: 'Nasi Padang', note: 'point at everything, regret nothing' },
            { emoji: '🍲', name: 'Korean Food', note: 'tteokbokki, bravery level rising' },
            { emoji: '🍣', name: 'Sushi Salmon', note: 'new obsession, already serious' },
          ],
        },
        {
          course: 'MANIS',
          options: [
            { emoji: '🍰', name: 'Cheesecake', note: 'non-negotiable' },
            { emoji: '🍮', name: 'Puding Coklat', note: 'for the in-between days' },
            { emoji: '🍦', name: 'Es Krim', note: 'shared, allegedly' },
          ],
        },
        {
          course: 'MINUM',
          options: [
            { emoji: '🧋', name: 'Teazzi Milk Tea', note: 'the usual order' },
            { emoji: '🧋', name: 'Chagee Milk Tea', note: 'when we are feeling fancy' },
            { emoji: '🥤', name: 'Es Teh Manis', note: 'the correct answer to everything' },
          ],
        },
      ],
      /* There is nothing to solve, so the hints are just encouragement. */
      hints: [
        'There is no wrong answer on this one. Take whatever you want.',
        'Seriously. Take all of it. That was the point.',
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
       * Exactly one row should be redacted. */
      records: [
        { id: 1, key: 'FIRST_MEET', value: 'My place' },
        { id: 2, key: 'FIRST_FOOD', value: 'Monster Curry' },
        { id: 3, key: 'FIRST_DATE', value: 'Fore, Thamrin' },
        { id: 4, key: 'OUR_DATE', value: null, redacted: true }, //  ← the puzzle
        { id: 5, key: 'FAVORITE_ACTIVITY', value: 'Ngelon' },
        { id: 6, key: 'FAVORITE_PLACE', value: 'Wherever the good food is' },
      ],
      question: 'One row came back corrupted. What date did we become us?',
      answer: '25 July',
      /* Matching already ignores case, spaces and punctuation — these cover the other
       * ways she might write a date, so a slash or "Juli" never costs her the puzzle. */
      alsoAccept: [
        '25 Juli',
        'July 25',
        'Juli 25',
        '25/7',
        '25/07',
        '25-7',
        '25-07',
        '25 07',
        '25th July',
        'July 25th',
        '25 July 2025',
      ],
      hints: [
        'The day the whole thing officially started. Month and day is enough.',
        'It is July. Now the number.',
      ],
    },

    /* ---- FINAL AUTHENTICATION ----------------------------------------------------------
     * "Where is the birthday build deployed?" → Instagram. */
    finalAuth: {
      question:
        'Are you happy? And are you ready to keep being happy with me — for the rest of your life?',
      answer: 'yes',
      alsoAccept: [
        'yes i am',
        'yes i do',
        'yes always',
        'iya',
        'ya',
        'iya dong',
        'iya aku mau',
        'mau',
        'of course',
        'always',
        'absolutely',
        'i am',
        'yess',
        'yup',
      ],
      hints: [
        'There is only one answer I am hoping for, and it is three letters long.',
        'Say yes. Please say yes.',
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
