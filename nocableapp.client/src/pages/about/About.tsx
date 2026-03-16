import { Linkedin, Github } from 'react-bootstrap-icons';
import styles from './About.module.css';

interface TechItem {
  category: string;
  name: string;
}

interface RoadmapItem {
  label: string;
  badgeVariant: string;
  title: string;
  description: string;
}

const techStack: TechItem[] = [
  { category: 'Frontend Framework', name: 'React 19' },
  { category: 'Language', name: 'TypeScript 5' },
  { category: 'Build Tool', name: 'Vite 7' },
  { category: 'UI Library', name: 'Bootstrap 5 + React Bootstrap' },
  { category: 'Routing', name: 'React Router 7' },
  { category: 'Map Engine', name: 'OpenLayers 10' },
  { category: 'Backend Framework', name: '.NET 8 / ASP.NET Core' },
  { category: 'ORM', name: 'Entity Framework Core 8' },
  { category: 'Database', name: 'SQLite' },
  { category: 'Auth', name: 'ASP.NET Identity (cookie-based)' },
  { category: 'Geocoding', name: 'Nominatim + Photon APIs' },
  { category: 'Hosting', name: 'AWS EC2' },
  { category: 'CI/CD', name: 'AWS CodePipeline' },
];

const roadmap: RoadmapItem[] = [
  {
    label: 'Planned',
    badgeVariant: 'bg-secondary',
    title: 'Entry Editing',
    description: 'Edit the title, body, or date of an existing journal entry after it has been created.',
  },
  {
    label: 'Planned',
    badgeVariant: 'bg-secondary',
    title: 'Entry Visibility Controls',
    description: 'Mark entries as public, friends-only, or private to control who can see your pins.',
  },
  {
    label: 'Planned',
    badgeVariant: 'bg-secondary',
    title: 'User Profile Page',
    description: 'A dedicated profile page showing a user\'s stats, recent entries, and friend count.',
  },
  {
    label: 'Planned',
    badgeVariant: 'bg-secondary',
    title: 'Friend Request Notifications',
    description: 'Surface a notification badge in the UI when you have pending friend requests.',
  },
  {
    label: 'Planned',
    badgeVariant: 'bg-secondary',
    title: 'Feed Pagination',
    description: 'Paginate the friends\' activity feed to avoid loading all entries at once.',
  },
];

export default function About() {
  return (
    <div className={styles.page}>
      <h1 className="mb-1">About No-Cable</h1>
      <p className="text-secondary mb-2">
        A full-stack portfolio project by <strong>Jorge Ramirez</strong> — GIS Full Stack Developer.
      </p>
      <div className={`${styles.links} mb-4`}>
        <a href="https://www.linkedin.com/in/jramirez927" target="_blank" rel="noreferrer">
          <Linkedin size={18} className="me-1" />
          LinkedIn
        </a>
        <a href="https://github.com/Jramirez927/NoCableApp" target="_blank" rel="noreferrer">
          <Github size={18} className="me-1" />
          GitHub Repo
        </a>
      </div>

      <h2 className={styles.sectionTitle}>Tech Stack</h2>
      <div className={styles.techGrid}>
        {techStack.map((item) => (
          <div key={item.name} className={styles.techCard}>
            <h6>{item.category}</h6>
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Roadmap</h2>
      <ul className={styles.roadmapList}>
        {roadmap.map((item) => (
          <li key={item.title} className={styles.roadmapItem}>
            <span className={`badge ${item.badgeVariant}`}>{item.label}</span>
            <p>
              <strong>{item.title}</strong>
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
