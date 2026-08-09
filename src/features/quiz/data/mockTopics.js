import { Dna, Sigma, Landmark, Code2 } from "lucide-react";

export const mockTopics = [
  {
    id: "biology",
    title: "Cell Biology",
    description: "Mitochondria, membranes, and cell structure",
    icon: Dna,
  },
  {
    id: "math",
    title: "Linear Algebra",
    description: "Eigenvectors, matrices, and transformations",
    icon: Sigma,
  },
  {
    id: "history",
    title: "World History — WWI",
    description: "Causes, alliances, and key events",
    icon: Landmark,
  },
  {
    id: "cs",
    title: "Data Structures",
    description: "Big O notation and algorithm complexity",
    icon: Code2,
  },
  // Dev-only: unlike auth/notes/tutor (free-text fields where typing
  // "force-error" works), quiz config is dropdown-driven — so the error
  // trigger needs to be a selectable option instead.
  {
    id: "force-error",
    title: "⚠ Force error (testing)",
    description: "Simulates a failed quiz generation",
    icon: Sigma,
  },
];

export const questionCountOptions = [5, 10, 15];
export const difficultyOptions = ["Easy", "Medium", "Hard"];
