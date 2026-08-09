/**
 * {front, back} is exactly what a Gemini prompt would be asked to
 * produce from a note or topic. flashcardService.getDeckCards() swaps
 * this lookup for a real call later without changing anything downstream.
 */
export const mockCardBank = {
  biology: [
    { front: "What is the powerhouse of the cell?", back: "The mitochondria — generates ATP through cellular respiration." },
    { front: "What are cristae?", back: "The folded inner membrane of a mitochondrion, which increases surface area for ATP production." },
    { front: "What controls what enters and exits a cell?", back: "The cell membrane — it's selectively permeable." },
    { front: "Where is a cell's genetic material stored?", back: "In the nucleus." },
    { front: "What does the Golgi apparatus do?", back: "Modifies, sorts, and packages proteins for transport out of the cell." },
    { front: "What is the cell's outermost rigid layer called (in plant cells)?", back: "The cell wall." },
  ],
  math: [
    { front: "What is an eigenvector?", back: "A non-zero vector v such that Av = λv for some scalar λ (the eigenvalue)." },
    { front: "What is the determinant of an identity matrix?", back: "1, for any size identity matrix." },
    { front: "What is a singular matrix?", back: "A matrix with no inverse — its determinant is 0." },
    { front: "What does it mean for two vectors to be orthogonal?", back: "Their dot product equals zero — they meet at a right angle." },
    { front: "What is the rank of a matrix?", back: "The number of linearly independent rows (or columns) it has." },
  ],
  history: [
    { front: "What does M.A.I.N. stand for?", back: "Militarism, Alliances, Imperialism, Nationalism — the main causes of WWI." },
    { front: "Who was assassinated in Sarajevo in 1914?", back: "Archduke Franz Ferdinand of Austria-Hungary." },
    { front: "What were the Central Powers?", back: "Germany, Austria-Hungary, and later the Ottoman Empire and Bulgaria." },
    { front: "What treaty ended WWI?", back: "The Treaty of Versailles, signed in 1919." },
  ],
  cs: [
    { front: "What is the time complexity of binary search?", back: "O(log n) — it halves the search space each step." },
    { front: "What's the average-case lookup time for a hash map?", back: "O(1)." },
    { front: "What is the average complexity of merge sort?", back: "O(n log n)." },
    { front: "What is the time complexity of array index access?", back: "O(1) — constant time, via direct memory offset." },
    { front: "What's quicksort's worst-case complexity?", back: "O(n²), with a poor pivot choice." },
  ],
};
