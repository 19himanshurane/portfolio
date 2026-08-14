import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { blogPosts } from '../data/blogPosts.js';
import Reveal from '../components/Reveal.jsx';
import CostAutopilotArt from '../components/illustrations/CostAutopilotArt.jsx';
import './BlogPost.css';

const artBySlug = {
  'llm-cost-autopilot-build': CostAutopilotArt,
};

export default function BlogPost() {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const Art = artBySlug[post.slug];

  return (
    <article className="blog-post">
      <div className="container blog-post__container">
        <Reveal y={20}>
          <Link to="/blog" className="blog-post__back">{t.blogPage.backToBlog}</Link>
          <div className="blog-post__meta">
            <span className="blog-post__date">
              {new Date(post.date).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="blog-post__dot">·</span>
            <span className="blog-post__read">{post.readTime[lang]}</span>
          </div>
          <h1>{post.title[lang]}</h1>
          <p className="blog-post__excerpt">{post.excerpt[lang]}</p>
          <div className="blog-post__tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </Reveal>

        {Art && (
          <Reveal y={20} delay={0.1} className="blog-post__art">
            <Art />
          </Reveal>
        )}

        <div className="blog-post__body">
          {post.sections[lang].map((section, i) => (
            <Reveal key={section.label} y={20} delay={i * 0.06} as="section" className="blog-post__section">
              <span className="blog-post__star-label">{section.label}</span>
              <h2>{section.heading}</h2>
              {section.body.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </Reveal>
          ))}
        </div>

        <Reveal y={20} className="blog-post__footer">
          <Link to="/blog" className="btn btn-secondary">{t.blogPage.backToBlog}</Link>
        </Reveal>
      </div>
    </article>
  );
}
