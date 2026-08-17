import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './RoutingDemo.css';

const examples = [
  {
    tab: 'Simple',
    prompt: 'Extract the invoice date from this text.',
    tier: 1,
    tierLabel: 'Tier 1 · Simple',
    model: 'Llama 3 8B · Groq',
    cost: '$0.00009',
    latency: '210ms',
  },
  {
    tab: 'Moderate',
    prompt: 'Summarize this support ticket in two sentences.',
    tier: 2,
    tierLabel: 'Tier 2 · Moderate',
    model: 'Mixtral 8x7B',
    cost: '$0.0004',
    latency: '480ms',
  },
  {
    tab: 'Complex',
    prompt: 'Walk through this multi-step tax reasoning problem.',
    tier: 3,
    tierLabel: 'Tier 3 · Complex',
    model: 'GPT-4o',
    cost: '$0.021',
    latency: '1.9s',
  },
  {
    tab: 'Escalation',
    prompt: 'Is this contract clause enforceable in Bavaria?',
    tier: 1,
    tierLabel: 'Tier 1 · Simple',
    model: 'Llama 3 8B · Groq',
    escalated: true,
    escalatedModel: 'GPT-4o',
  },
];

function getSteps(example) {
  const steps = [
    { phase: 'prompt', duration: 500 },
    { phase: 'classifying', duration: 700 },
    { phase: 'classified', duration: 550 },
    { phase: 'routing', duration: 700 },
    { phase: 'verifying', duration: 750 },
  ];
  if (example.escalated) {
    steps.push({ phase: 'mismatch', duration: 900 }, { phase: 'escalated', duration: 2600 });
  } else {
    steps.push({ phase: 'verified', duration: 2600 });
  }
  return steps;
}

function TraceLine({ label, done, children }) {
  return (
    <motion.p
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="routing-demo__line"
    >
      <span className={`routing-demo__marker ${done ? 'is-done' : 'is-pending'}`} />
      <span className="routing-demo__label">{label}</span>
      {children}
    </motion.p>
  );
}

export default function RoutingDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const timeoutRef = useRef(null);

  const example = examples[exampleIndex];
  const steps = getSteps(example);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (stepIndex < steps.length - 1) {
        setStepIndex((i) => i + 1);
      } else {
        setExampleIndex((i) => (i + 1) % examples.length);
        setStepIndex(0);
      }
    }, steps[stepIndex].duration);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exampleIndex, stepIndex]);

  const phaseAtLeast = (target) => {
    const idx = steps.findIndex((s) => s.phase === target);
    return idx !== -1 && idx <= stepIndex;
  };

  const selectExample = (i) => {
    clearTimeout(timeoutRef.current);
    setExampleIndex(i);
    setStepIndex(0);
  };

  return (
    <div className="routing-demo">
      <div className="routing-demo__chrome">
        <span className="routing-demo__dot routing-demo__dot--r" />
        <span className="routing-demo__dot routing-demo__dot--y" />
        <span className="routing-demo__dot routing-demo__dot--g" />
        <span className="routing-demo__title">router.trace</span>
      </div>
      <div className="routing-demo__body">
        <AnimatePresence mode="wait">
          <motion.div
            key={exampleIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="routing-demo__line routing-demo__line--prompt">
              <span className="routing-demo__prompt-mark">&gt;</span> {example.prompt}
            </p>

            {phaseAtLeast('classifying') && (
              <TraceLine label="classifying" done={phaseAtLeast('classified')}>
                {phaseAtLeast('classified') && (
                  <span className={`routing-demo__badge routing-demo__badge--tier${example.tier}`}>
                    {example.tierLabel}
                  </span>
                )}
              </TraceLine>
            )}

            {phaseAtLeast('routing') && (
              <TraceLine label="routed to" done>
                <span className="routing-demo__model">{example.model}</span>
              </TraceLine>
            )}

            {phaseAtLeast('verifying') && (
              <TraceLine label="verifying" done={phaseAtLeast('verified') || phaseAtLeast('mismatch')}>
                {phaseAtLeast('mismatch') && (
                  <span className="routing-demo__badge routing-demo__badge--warn">disagreement detected</span>
                )}
                {phaseAtLeast('verified') && (
                  <span className="routing-demo__result">✓ {example.cost} · {example.latency}</span>
                )}
              </TraceLine>
            )}

            {phaseAtLeast('escalated') && (
              <TraceLine label="escalated to" done>
                <span className="routing-demo__model routing-demo__model--escalated">{example.escalatedModel}</span>
                <span className="routing-demo__note">flagged for next retrain</span>
              </TraceLine>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="routing-demo__tabs" role="tablist" aria-label="Choose a routing example">
        {examples.map((ex, i) => (
          <button
            key={ex.tab}
            type="button"
            role="tab"
            aria-selected={i === exampleIndex}
            className={`routing-demo__tab ${i === exampleIndex ? 'is-active' : ''}`}
            onClick={() => selectExample(i)}
          >
            {ex.tab}
          </button>
        ))}
      </div>
    </div>
  );
}
