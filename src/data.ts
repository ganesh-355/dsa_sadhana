import problemsData from "./problems.json";

export interface Problem {
  Problem_ID: string | number;
  Learning_Order: number;
  Phase: string;
  Topic: string;
  Subtopic: string;
  Problem_Name: string;
  Source: string;
  Difficulty: 'Easy' | 'Medium' | 'Hard';
  URL: string;
  Prerequisites?: string;
  Techniques?: string;
  Pattern?: string;
  Company_Tags?: string;
  Estimated_Time_Minutes?: number;
  Importance_Score?: number;
  Revision_Frequency?: string;
  Status?: string;
  Notes?: string;
}

export interface PhaseInfo {
  id: number;
  name: string;
  description: string;
}

export const PHASES: PhaseInfo[] = [
  { id: 1, name: "Phase 1 - Programming Logic Foundations", description: "Master the basics: Arithmetic, Loops, and Conditionals." },
  { id: 2, name: "Phase-2", description: "Diving into Arrays, Strings, and 2D Matrices." },
  { id: 3, name: "Phase-3", description: "Hash Maps, Sets, and Prefix Sum techniques." },
  { id: 4, name: "Phase-4", description: "Advanced Two Pointers and Sliding Window patterns." },
  { id: 5, name: "Phase-5", description: "Stacks, Queues, and Monotonic Stack applications." },
  { id: 6, name: "Phase-6", description: "Linked List surgery and pointer manipulation." },
  { id: 7, name: "Phase-7", description: "Binary Trees, Traversals, and Path properties." },
  { id: 8, name: "Phase-8", description: "BSTs, Tries, and Iterative Tree patterns." },
  { id: 9, name: "Phase-9", description: "Heaps, Priority Queues, and Greedy Scheduling." },
  { id: 10, name: "Phase-10", description: "Graphs: BFS, DFS, Union Find, and Topological Sort." },
  { id: 11, name: "Phase-11", description: "Combinatorial Backtracking and Memoization." },
  { id: 12, name: "Phase-12", description: "1D, 2D, and State-Machine Dynamic Programming." },
  { id: 13, name: "Phase-13", description: "Bitmask, Intervals, and Advanced DP." },
  { id: 14, name: "Phase-14", description: "Shortest Paths (Dijkstra/Floyd-Warshall) and MST." },
  { id: 15, name: "Phase-15", description: "Number Theory, Geometry, and Segment Trees." },
  { id: 16, name: "Phase-16", description: "KMP, Rabin-Karp, and Advanced System Design." }
];


export const MOCK_PROBLEMS: Problem[] = problemsData as Problem[];

