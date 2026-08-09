import { Dna, Sigma, Landmark, Code2 } from "lucide-react";

export const mockDecks = [
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
  // Dev-only, same pattern as Quiz's dropdown-driven error trigger.
  {
    id: "force-error",
    title: "⚠ Force error (testing)",
    description: "Simulates a failed deck load",
    icon: Sigma,
  },
];
