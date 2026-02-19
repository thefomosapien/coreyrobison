import type { Project } from '@/lib/types';
import ProjectVisual from './ProjectVisual';
import ScrollReveal from './ScrollReveal';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <ScrollReveal>
      <div className="project-card grid grid-cols-1 tablet:grid-cols-2 gap-8 tablet:gap-12 items-center py-12 tablet:py-16 border-b border-ink/[0.07] last:border-b-0 group">
        <div
          className="relative rounded-xl overflow-hidden bg-bg-alt transition-transform duration-500 group-hover:scale-[1.01]"
          style={{ aspectRatio: '4/3' }}
        >
          <ProjectVisual project={project} />
        </div>
        <div className="py-4">
          <div className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-accent mb-3">
            {project.tag}
          </div>
          <h3
            className="font-serif leading-tight tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', letterSpacing: '-0.02em' }}
          >
            {project.name}
          </h3>
          <p className="text-ink-light text-[0.95rem] leading-relaxed mb-6 max-w-[42ch]" style={{ lineHeight: '1.7' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.skills || []).map((skill) => (
              <span
                key={skill}
                className="text-[0.7rem] font-medium tracking-wide px-3 py-1 rounded-full bg-bg-alt text-ink-light"
              >
                {skill}
              </span>
            ))}
          </div>
          {project.external_url && (
            <a
              href={project.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-accent transition-all duration-300 hover:gap-3 group/link"
            >
              Visit {(() => { try { return new URL(project.external_url!).hostname.replace('www.', ''); } catch { return 'site'; } })()}
              <span className="transition-transform duration-300 group-hover/link:translate-x-0.5">→</span>
            </a>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
