export interface Project {
  description: string;
  href: string;
  linkLabel: string;
  name: string;
  notes: string[];
  /** Spans the full width of the projects grid. */
  wide?: boolean;
}
