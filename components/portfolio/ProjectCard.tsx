import type { Project } from '@/lib/types';
import ProjectVisual from './ProjectVisual';
import PixelBadge from './PixelBadge';
import Reactions from './Reactions';
import ScrollReveal from './ScrollReveal';

interface ProjectCardProps {
  project: Project;
  reactions: Record<string, number>;
}

export default function ProjectCard({ project, reactions }: ProjectCardProps) {
  return (
    <ScrollReveal>
      <article
        role="article"
        aria-label={project.name}
        className="grid grid-cols-1 tablet:grid-cols-2 items-center"
        style={{ gap: 28 }}
      >
        <div style={{ aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden' }}>
          <ProjectVisual project={project} />
        </div>
        <div>
          <PixelBadge variant="accent">{project.tag}</PixelBadge>
          <h3
            className="font-serif font-normal"
            style={{
              fontSize: 21,
              color: '#2A2824',
              lineHeight: 1.25,
              marginTop: 10,
              marginBottom: 10,
              letterSpacing: '-0.01em',
            }}
          >
            {project.name}
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#6B6660', marginBottom: 14, maxWidth: '44ch' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1.5" style={{ marginBottom: 4 }}>
            {(project.skills || []).map((s) => (
              <PixelBadge key={s} variant="muted">{s}</PixelBadge>
            ))}
          </div>
          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel inline-flex items-center gap-1"
              style={{ fontSize: 10, color: '#5A8A9A', marginTop: 10 }}
            >
              Visit site ↗
            </a>
          )}
          <Reactions targetType="project" targetId={project.id} initialReactions={reactions} />
        </div>
      </article>
    </ScrollReveal>
  );
}
