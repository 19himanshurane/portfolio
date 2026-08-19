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

function formatDate(dateStr, lang) {
  return new Date(dateStr).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Blog() {
  const { lang, t } = useLanguage();
  const b = t.blogPage;
  const [featured, ...rest] = blogPosts;
  const FeaturedArt = featured && artBySlug[featured.slug];

  return (
    <section className="blog-page">
      <div className="container">
        <span className="eyebrow">{b.eyebrow}</span>
        <Reveal as="h1" y={20} className="blog-page__heading">{b.heading}</Reveal>
        <Reveal as="p" y={20} delay={0.08} className="muted blog-page__sub">{b.sub}</Reveal>

        {blogPosts.length === 0 ? (
          <Reveal y={20} delay={0.16} className="blog-empty">
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
            <Reveal y={20} delay={0.16}>
              <Link to={`/blog/${featured.slug}`} className="blog-featured">
                {FeaturedArt && (
                  <div className="blog-featured__media">
                    <FeaturedArt />
                  </div>
                )}
                <div className="blog-featured__body">
                  <span className="blog-featured__kicker">{b.latestLabel}</span>
                  <h2 className="blog-featured__title">{featured.title[lang]}</h2>
                  <div className="blog-meta">
                    <span>{formatDate(featured.date, lang)}</span>
                    <span className="blog-meta__dot">·</span>
                    <span>{featured.readTime[lang]}</span>
                  </div>
                  <p className="blog-featured__excerpt">{featured.excerpt[lang]}</p>
                  <div className="blog-featured__tags">
                    {featured.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="blog-row__arrow" aria-hidden="true">→</span>
              </Link>
            </Reveal>

            {rest.length > 0 && (
              <div className="blog-more">
                <span className="section-label">{b.moreLabel}</span>
                <div className="blog-rows">
                  {rest.map((post, i) => {
                    const Art = artBySlug[post.slug];
                    return (
                      <Reveal key={post.slug} y={20} delay={0.22 + i * 0.06} as="article">
                        <Link to={`/blog/${post.slug}`} className="blog-row">
                          {Art && (
                            <div className="blog-row__thumb">
                              <Art />
                            </div>
                          )}
                          <div className="blog-row__body">
                            <div className="blog-meta">
                              <span>{formatDate(post.date, lang)}</span>
                              <span className="blog-meta__dot">·</span>
                              <span>{post.readTime[lang]}</span>
                            </div>
                            <h3 className="blog-row__title">{post.title[lang]}</h3>
                            <p className="blog-row__excerpt">{post.excerpt[lang]}</p>
                          </div>
                          <span className="blog-row__arrow" aria-hidden="true">→</span>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
