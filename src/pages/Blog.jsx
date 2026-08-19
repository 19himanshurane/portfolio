import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { socials } from '../data/content.js';
import { blogPosts } from '../data/blogPosts.js';
import Reveal from '../components/Reveal.jsx';
import CostAutopilotArt from '../components/illustrations/CostAutopilotArt.jsx';
import EvalGateArt from '../components/illustrations/EvalGateArt.jsx';
import './Blog.css';

const artBySlug = {
  'llm-cost-autopilot-build': CostAutopilotArt,
  'evalgate-build': EvalGateArt,
};

export default function Blog() {
  const { lang, t } = useLanguage();
  const b = t.blogPage;

  return (
    <section className="blog-page">
      <div className="container">
        <Reveal y={20} className="blog-page__header">
          <span className="eyebrow blog-page__eyebrow">{b.eyebrow}</span>
          <h1>{b.heading}</h1>
          <p className="blog-page__sub">{b.sub}</p>
        </Reveal>

        {blogPosts.length === 0 ? (
          <Reveal y={20} delay={0.1} className="blog-empty">
            <div className="blog-empty__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3>{b.emptyTitle}</h3>
            <p className="muted">{b.emptyBody}</p>
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary">
              {b.emptyCta}
            </a>
          </Reveal>
        ) : (
          <div className="blog-list">
            {blogPosts.map((post, i) => {
              const Art = artBySlug[post.slug];
              return (
              <Reveal key={post.slug} y={24} delay={i * 0.08} as="article" className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-card__link">
                  {Art && (
                    <div className="blog-card__thumb">
                      <Art />
                    </div>
                  )}
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span className="blog-card__date">
                        {new Date(post.date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="blog-card__dot">·</span>
                      <span className="blog-card__read">{post.readTime[lang]}</span>
                    </div>
                    <h2 className="blog-card__title">{post.title[lang]}</h2>
                    <p className="blog-card__excerpt">{post.excerpt[lang]}</p>
                    <div className="blog-card__tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <span className="blog-card__cta arrow-link">
                      {b.readMore} <span className="arrow-icon">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
