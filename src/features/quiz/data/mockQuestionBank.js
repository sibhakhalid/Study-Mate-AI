/**
 * Shape here is deliberate: {question, options[4], correctIndex, explanation}
 * is exactly what a Gemini prompt would be asked to return. When the real
 * API is connected, quizService.generateQuiz() swaps this lookup for a
 * real call — nothing downstream needs to change.
 */
export const mockQuestionBank = {
  biology: [
    {
      question: "What is the primary function of mitochondria?",
      options: ["Protein synthesis", "Generating ATP through respiration", "Storing genetic material", "Waste breakdown"],
      correctIndex: 1,
      explanation: "Mitochondria are the cell's powerhouse, producing ATP via cellular respiration.",
    },
    {
      question: "Which structure regulates what enters and exits the cell?",
      options: ["Nucleus", "Golgi apparatus", "Cell membrane", "Ribosome"],
      correctIndex: 2,
      explanation: "The cell membrane is selectively permeable, controlling movement of substances.",
    },
    {
      question: "The folded inner membrane of a mitochondrion is called the:",
      options: ["Cristae", "Cytoplasm", "Nucleolus", "Vacuole"],
      correctIndex: 0,
      explanation: "Cristae increase surface area for ATP production.",
    },
    {
      question: "Where does a cell's genetic material primarily reside?",
      options: ["Mitochondria", "Nucleus", "Cell wall", "Cytoskeleton"],
      correctIndex: 1,
      explanation: "The nucleus houses the cell's DNA.",
    },
    {
      question: "Which organelle packages and ships proteins?",
      options: ["Golgi apparatus", "Lysosome", "Chloroplast", "Nucleolus"],
      correctIndex: 0,
      explanation: "The Golgi apparatus modifies and packages proteins for transport.",
    },
  ],
  math: [
    {
      question: "An eigenvector v of matrix A satisfies which equation?",
      options: ["Av = v + λ", "Av = λv", "A + v = λ", "Av = A²v"],
      correctIndex: 1,
      explanation: "Av = λv, where λ is the eigenvalue corresponding to eigenvector v.",
    },
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "-1"],
      correctIndex: 1,
      explanation: "The identity matrix always has a determinant of 1.",
    },
    {
      question: "A matrix with no inverse is called:",
      options: ["Diagonal", "Singular", "Symmetric", "Orthogonal"],
      correctIndex: 1,
      explanation: "Singular matrices have a determinant of 0 and no inverse.",
    },
    {
      question: "What does it mean for two vectors to be orthogonal?",
      options: ["They are parallel", "Their dot product is 0", "They have equal magnitude", "They are eigenvectors"],
      correctIndex: 1,
      explanation: "Orthogonal vectors meet at a right angle, giving a dot product of zero.",
    },
    {
      question: "The rank of a matrix refers to:",
      options: ["Its number of rows", "Its number of columns", "The number of linearly independent rows", "Its determinant"],
      correctIndex: 2,
      explanation: "Rank is the count of linearly independent rows (or columns).",
    },
  ],
  history: [
    {
      question: "Which acronym summarizes the main causes of WWI?",
      options: ["M.A.I.N", "P.O.W.E.R", "T.R.E.A.T.Y", "N.A.T.O"],
      correctIndex: 0,
      explanation: "M.A.I.N: Militarism, Alliances, Imperialism, Nationalism.",
    },
    {
      question: "Who was assassinated, triggering the war's outbreak?",
      options: ["Kaiser Wilhelm II", "Archduke Franz Ferdinand", "Tsar Nicholas II", "King George V"],
      correctIndex: 1,
      explanation: "His assassination in Sarajevo, 1914, was the immediate trigger.",
    },
    {
      question: "Which alliance included Germany and Austria-Hungary?",
      options: ["Triple Entente", "Central Powers", "Allied Powers", "League of Nations"],
      correctIndex: 1,
      explanation: "The Central Powers included Germany, Austria-Hungary, and later the Ottoman Empire.",
    },
    {
      question: "What treaty formally ended WWI?",
      options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Vienna", "Treaty of Berlin"],
      correctIndex: 0,
      explanation: "Signed in 1919, it imposed heavy terms on Germany.",
    },
  ],
  cs: [
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctIndex: 2,
      explanation: "Binary search halves the search space each step: O(log n).",
    },
    {
      question: "Average-case lookup time for a hash map is:",
      options: ["O(n)", "O(1)", "O(log n)", "O(n log n)"],
      correctIndex: 1,
      explanation: "Hash maps offer O(1) average-case lookup via direct indexing.",
    },
    {
      question: "Which sorting algorithm has O(n log n) average complexity?",
      options: ["Bubble sort", "Merge sort", "Selection sort", "Insertion sort"],
      correctIndex: 1,
      explanation: "Merge sort's divide-and-conquer approach runs in O(n log n).",
    },
    {
      question: "Accessing an array element by index is:",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctIndex: 2,
      explanation: "Arrays offer constant-time O(1) access via direct memory offset.",
    },
    {
      question: "Worst-case complexity of quicksort is:",
      options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
      correctIndex: 2,
      explanation: "With a poor pivot choice, quicksort degrades to O(n²).",
    },
  ],
};
