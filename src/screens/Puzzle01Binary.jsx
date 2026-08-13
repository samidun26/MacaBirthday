import { PuzzleFrame } from '../components/PuzzleFrame.jsx';
import { toBinary } from '../lib/text.js';

/**
 * PUZZLE 01 — BINARY
 *
 * Deliberately the easiest of the five. Its job is to teach her the format ("oh, I type
 * an answer and it reacts") and to land the first small win, not to be hard.
 *
 * The binary is generated from `puzzles.binary.word`, so changing the word in the config
 * changes the bytes on screen.
 */
export function Puzzle01Binary({ config, onSolve, onBack, onHintUsed, initiallySolved }) {
  const { word } = config.puzzles.binary;
  const bytes = toBinary(word).split(' ');

  return (
    <PuzzleFrame
      eyebrow="Puzzle 01 — Identity"
      title="Prove you know who this build belongs to."
      systemMessage="Before we begin: decode the three bytes below. They spell out who I built this for."
      answer={word}
      placeholder="decoded text"
      inputLabel="Decoded text"
      submitLabel="Verify"
      wrongMessages={[
        'Hmm... that doesn\'t compile.',
        'ERROR 404: Brain.exe not found.',
        'Wrong. But eight digits at a time, I promise it works.',
      ]}
      hints={[
        'Each group of eight digits is one character. Binary → decimal → ASCII.',
        `${bytes[0]} is ${word.charCodeAt(0)} in decimal, and character ${word.charCodeAt(0)} in the ASCII table is "${word[0]}". Two to go.`,
        `It's ${word.length} letters, and it's the name of this build — check the tab at the top.`,
      ]}
      successTitle="✓ Identity verified"
      successNote="Okay. You know who this is. Let's see if you can debug her."
      nextLabel="Next commit →"
      onNext={onSolve}
      onBack={onBack}
      onHintUsed={onHintUsed}
      initiallySolved={initiallySolved}
      autoFocus
    >
      <div className="binary" aria-label={`Binary to decode: ${bytes.join(', ')}`}>
        {bytes.map((byte, index) => (
          // Bytes can legitimately repeat, so index is the only stable key here.
          // eslint-disable-next-line react/no-array-index-key
          <span className="binary__byte" key={`${byte}-${index}`}>
            {byte}
          </span>
        ))}
      </div>

      <div className="legend">
        <span>8 bits = 1 character</span>
        <span>encoding: ASCII</span>
        <span>bytes: {bytes.length}</span>
      </div>
    </PuzzleFrame>
  );
}
