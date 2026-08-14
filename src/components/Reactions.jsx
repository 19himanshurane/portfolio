import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.jsx';
import './Reactions.css';

const EMOJIS = [
  { key: 'like', emoji: '👍' },
  { key: 'love', emoji: '❤️' },
  { key: 'insightful', emoji: '💡' },
  { key: 'rocket', emoji: '🚀' },
];

export default function Reactions({ slug }) {
  const { t } = useLanguage();
  const storageKey = `reactions-${slug}`;
  const [counts, setCounts] = useState({});
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    setCounts(saved.counts || {});
    setSelected(saved.selected || {});
  }, [storageKey]);

  const toggle = (key) => {
    const isSelected = !!selected[key];
    const newCounts = { ...counts };
    const nextValue = (newCounts[key] || 0) + (isSelected ? -1 : 1);
    if (nextValue <= 0) delete newCounts[key];
    else newCounts[key] = nextValue;
    const newSelected = { ...selected, [key]: !isSelected };

    setCounts(newCounts);
    setSelected(newSelected);
    localStorage.setItem(storageKey, JSON.stringify({ counts: newCounts, selected: newSelected }));
  };

  return (
    <div className="reactions">
      <span className="reactions__label">{t.blogPage.reactPrompt}</span>
      <div className="reactions__row">
        {EMOJIS.map(({ key, emoji }) => (
          <motion.button
            key={key}
            type="button"
            className={`reactions__btn ${selected[key] ? 'is-active' : ''}`}
            onClick={() => toggle(key)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="reactions__emoji">{emoji}</span>
            {counts[key] > 0 && <span className="reactions__count">{counts[key]}</span>}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
