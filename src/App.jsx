import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { BIRTHDAY_CONFIG } from './birthday.config.js';
import { Shell } from './components/Shell.jsx';
import { PartyBackdrop, PaperOverlay } from './components/PartyBackdrop.jsx';
import { Modal } from './components/Modal.jsx';
import { ToastLayer } from './components/Toast.jsx';
import { BootScreen } from './screens/BootScreen.jsx';
import { TitleScreen } from './screens/TitleScreen.jsx';
import { Puzzle01Binary } from './screens/Puzzle01Binary.jsx';
import { Puzzle02Git } from './screens/Puzzle02Git.jsx';
import { Puzzle03Design } from './screens/Puzzle03Design.jsx';
import { Puzzle04Food } from './screens/Puzzle04Food.jsx';
import { Puzzle05Memory } from './screens/Puzzle05Memory.jsx';
import { FinalAuth } from './screens/FinalAuth.jsx';
import { RevealScreen } from './screens/RevealScreen.jsx';
import { useKonami } from './hooks/useKonami.js';
import { isSoundEnabled, setSoundEnabled, sound } from './lib/audio.js';
import { startMusic, stopMusic } from './lib/music.js';
import { clearState, loadState, saveState } from './lib/storage.js';

/**
 * The flow. Each entry is one screen; `step` drives the progress rail (0 = pre-flow).
 * The `file` is what shows in the title bar — a small touch that makes the whole thing
 * feel like an editor rather than a website.
 */
const FLOW = [
  { id: 'boot', file: 'boot.sh', step: 0 },
  { id: 'title', file: 'her.v21.0', step: 0 },
  { id: 'binary', file: '01-identity.bin', step: 1 },
  { id: 'git', file: '02-commit.diff', step: 2 },
  { id: 'design', file: '03-specimen.fig', step: 3 },
  { id: 'food', file: '04-menu.json', step: 4 },
  { id: 'memory', file: '05-memories.sql', step: 5 },
  { id: 'auth', file: 'auth.lock', step: 6 },
  { id: 'reveal', file: 'deploy.log', step: 6 },
];

const TOTAL_STEPS = 6;
const PUZZLE_IDS = ['binary', 'git', 'design', 'food', 'memory', 'auth'];

const indexOfScreen = (id) => Math.max(0, FLOW.findIndex((screen) => screen.id === id));

export default function App() {
  const config = BIRTHDAY_CONFIG;

  /* `?step=git` and friends: a back door for testing a single screen without replaying
   * the whole build. Documented in the README; she'd have no reason to find it. */
  const devScreen = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const requested = new URLSearchParams(window.location.search).get('step');
    return FLOW.some((screen) => screen.id === requested) ? requested : null;
  }, []);

  const saved = useMemo(() => (config.options.saveProgress ? loadState() : null), [config]);

  const [screenId, setScreenId] = useState(() => {
    if (devScreen) return devScreen;
    return config.options.replayBootSequence ? 'boot' : 'title';
  });
  const [solved, setSolved] = useState(() => (devScreen ? {} : saved?.solved ?? {}));
  const [hintsUsed, setHintsUsed] = useState(() => saved?.hintsUsed ?? 0);
  const [soundOn, setSoundOn] = useState(() => Boolean(config.options.soundEnabled));
  const [versionClicks, setVersionClicks] = useState(0);
  const [showTodo, setShowTodo] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toastId = useRef(0);
  const clicksRef = useRef(0);
  const achievementRef = useRef(false);

  const resumeTarget = useMemo(() => {
    if (devScreen || !saved?.screenId) return null;
    const index = indexOfScreen(saved.screenId);
    return index > indexOfScreen('title') ? saved.screenId : null;
  }, [devScreen, saved]);

  /* ------------------------------------------------------------------ toasts */

  const pushToast = useCallback((toast) => {
    toastId.current += 1;
    setToasts((current) => [...current, { id: toastId.current, ...toast }]);
  }, []);

  const expireToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  /* ------------------------------------------------------------- persistence */

  useEffect(() => {
    if (!config.options.saveProgress || devScreen) return;
    /* Boot and title are pre-flow. Writing from them would overwrite a real saved
     * position with 'boot' on every mount and quietly kill the resume offer. */
    if (indexOfScreen(screenId) <= indexOfScreen('title')) return;
    saveState({ screenId, solved, hintsUsed });
  }, [config.options.saveProgress, devScreen, screenId, solved, hintsUsed]);

  /* --------------------------------------------------------------- easter eggs */

  useEffect(() => {
    console.log(
      '%cHey developer 👀',
      'color:#e8558d;font-size:18px;font-weight:700;letter-spacing:0.04em',
    );
    console.log('%cHappy birthday ❤️', 'color:#7c4fe0;font-size:14px');
    console.log(
      '%cYes, this whole thing is hand-built. No, the answers are not in here. Mostly.',
      'color:#8d6575;font-size:11px;font-style:italic',
    );
  }, []);

  useKonami(
    useCallback(() => {
      sound.success();
      pushToast({
        icon: '🎮',
        title: 'Konami code',
        text: config.easterEggs.konamiMessage,
        duration: 5200,
      });
    }, [config.easterEggs.konamiMessage, pushToast]),
  );

  const onVersionClick = useCallback(() => {
    sound.tick();
    clicksRef.current += 1;
    setVersionClicks(clicksRef.current);

    if (clicksRef.current === config.age && !achievementRef.current) {
      achievementRef.current = true;
      sound.success();
      pushToast({
        icon: '🏆',
        title: 'Achievement unlocked',
        text: `${config.age}/${config.age} — ${config.easterEggs.achievementName}`,
        duration: 6000,
      });
    }
  }, [config.age, config.easterEggs.achievementName, pushToast]);

  /* -------------------------------------------------------------- navigation */

  const goTo = useCallback((id) => {
    setScreenId(id);
    /* New screen, fresh start — otherwise she lands mid-page on a long puzzle. */
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const advanceFrom = useCallback(
    (id) => {
      const next = FLOW[indexOfScreen(id) + 1];
      if (next) goTo(next.id);
    },
    [goTo],
  );

  const solveAndAdvance = useCallback(
    (id) => {
      setSolved((current) => ({ ...current, [id]: true }));
      advanceFrom(id);
    },
    [advanceFrom],
  );

  const backFrom = useCallback(
    (id) => {
      const previous = FLOW[indexOfScreen(id) - 1];
      /* Never offer a route back into the boot sequence or past the title. */
      if (previous && PUZZLE_IDS.includes(previous.id)) goTo(previous.id);
    },
    [goTo],
  );

  const restart = useCallback(() => {
    clearState();
    setSolved({});
    setHintsUsed(0);
    setVersionClicks(0);
    clicksRef.current = 0;
    achievementRef.current = false;
    goTo('boot');
  }, [goTo]);

  const noteHint = useCallback(() => setHintsUsed((count) => count + 1), []);

  const toggleSound = useCallback(() => {
    const next = !isSoundEnabled();
    setSoundEnabled(next);
    setSoundOn(next);
    /* The toggle IS the user gesture, which is the only moment iOS Safari will let an
     * AudioContext start — so the music has to begin here, not from an effect. */
    if (next) startMusic();
    else stopMusic();
  }, []);

  /* Never leave a loop running behind a closed screen. */
  useEffect(() => stopMusic, []);

  /* ------------------------------------------------------------------ render */

  const current = FLOW[indexOfScreen(screenId)];
  const gitPuzzle = config.puzzles.git;
  const branchLabel = solved.git
    ? `${gitPuzzle.branchPrefix}${gitPuzzle.word}`
    : `${gitPuzzle.branchPrefix}${'•'.repeat(gitPuzzle.word.length)}`;

  const puzzleProps = (id) => ({
    config,
    onSolve: () => solveAndAdvance(id),
    onBack: PUZZLE_IDS.includes(FLOW[indexOfScreen(id) - 1]?.id) ? () => backFrom(id) : undefined,
    onHintUsed: noteHint,
    initiallySolved: Boolean(solved[id]),
  });

  const renderScreen = () => {
    switch (screenId) {
      case 'boot':
        return <BootScreen config={config} onComplete={() => goTo('title')} />;

      case 'title':
        return (
          <TitleScreen
            config={config}
            onStart={() => goTo('binary')}
            onResume={resumeTarget ? () => goTo(resumeTarget) : undefined}
            resumeStep={resumeTarget ? FLOW[indexOfScreen(resumeTarget)].step : 0}
          />
        );

      case 'binary':
        return <Puzzle01Binary key="binary" {...puzzleProps('binary')} />;

      case 'git':
        return <Puzzle02Git key="git" {...puzzleProps('git')} />;

      case 'design':
        return <Puzzle03Design key="design" {...puzzleProps('design')} />;

      case 'food':
        return <Puzzle04Food key="food" {...puzzleProps('food')} />;

      case 'memory':
        return <Puzzle05Memory key="memory" {...puzzleProps('memory')} />;

      case 'auth':
        return (
          <FinalAuth
            key="auth"
            config={config}
            onHintUsed={noteHint}
            onComplete={() => solveAndAdvance('auth')}
          />
        );

      case 'reveal':
        return <RevealScreen config={config} onRestart={restart} />;

      default:
        return null;
    }
  };

  return (
    <>
      <PartyBackdrop />

      <Shell
        fileName={current.file}
        version={`${config.age}.0.0`}
        totalSteps={TOTAL_STEPS}
        currentStep={current.step}
        solvedCount={PUZZLE_IDS.filter((id) => solved[id]).length}
        hintsUsed={hintsUsed}
        branchLabel={branchLabel}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        versionGlow={versionClicks >= config.age - 5 && versionClicks < config.age}
        onVersionClick={onVersionClick}
        onEggClick={() => setShowTodo(true)}
      >
        {renderScreen()}
      </Shell>

      <ToastLayer toasts={toasts} onExpire={expireToast} />

      <PaperOverlay />

      {showTodo ? (
        <Modal title="// notes.txt" onClose={() => setShowTodo(false)}>
          <div className="modal__code mono">
            {config.easterEggs.todoList.map((item) => (
              <div key={item}>
                <span className="kw">{'// TODO:'}</span>
                {'\n'}
                <span className="todo">{`// ${item}`}</span>
                {'\n'}
              </div>
            ))}
          </div>
        </Modal>
      ) : null}
    </>
  );
}
