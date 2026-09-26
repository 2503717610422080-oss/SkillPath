import { UserSkill, TargetRoleProfile, LearningItem, ProjectEvidenceItem, ResumeData } from '../types';

export const DEMO_TARGET_ROLE: TargetRoleProfile = {
  id: 'role-swe-sample',
  roleTitle: 'Software Engineer',
  company: 'Sample Technologies',
  jobDescription: `Sample Technologies is looking for a Software Engineer to join our Core Backend Platform team.
You will build high-throughput microservices, design relational schemas, write high-performance queries, and participate in code reviews.

Key Requirements:
- Deep proficiency in Java and modern frameworks
- Strong foundation in Data Structures and Algorithms (DSA)
- Relational database modeling and SQL query tuning (PostgreSQL or MySQL)
- Solid understanding of Object-Oriented Programming (OOP) and Clean Code
- Experience with Git branching, pull requests, and CI/CD
- Strong problem-solving mindset and cross-functional communication`,
  highSkills: [
    { skill: 'Java', category: 'Core Backend', importance: 'HIGH', required_level: 4.5, description: 'Primary language for microservices and data pipelines.' },
    { skill: 'DSA', category: 'Computer Science', importance: 'HIGH', required_level: 4.0, description: 'Optimal time and space complexity in distributed processing.' },
    { skill: 'SQL', category: 'Data Storage', importance: 'HIGH', required_level: 4.0, description: 'Complex JOINs, indexing strategies, and schema migrations.' }
  ],
  mediumSkills: [
    { skill: 'OOP', category: 'Architecture', importance: 'MEDIUM', required_level: 4.0, description: 'Design patterns and modular component architecture.' },
    { skill: 'Git', category: 'Tooling', importance: 'MEDIUM', required_level: 3.5, description: 'Collaborative code review, rebase, and conflict resolution.' },
    { skill: 'Problem Solving', category: 'Engineering', importance: 'MEDIUM', required_level: 4.0, description: 'Debugging production outages and performance tuning.' }
  ],
  lowSkills: [
    { skill: 'Docker', category: 'DevOps', importance: 'LOW', required_level: 2.5, description: 'Local containerization for running integration tests.' },
    { skill: 'REST APIs', category: 'Networking', importance: 'LOW', required_level: 3.0, description: 'Standard HTTP response contracts and pagination.' }
  ],
  behavioralSkills: [
    { skill: 'Communication', importance: 'HIGH', required_level: 4.0, description: 'Clear design docs and productive feedback.' }
  ],
  summary: 'Core engineering role focused on scalable backend microservices, SQL databases, and robust OOP practices.',
  analyzedAt: '2026-09-25T12:00:00Z'
};

export const INITIAL_DEMO_SKILLS: UserSkill[] = [
  {
    skillName: 'Java',
    category: 'Core Backend',
    selfClaimScore: 4.5,
    assessmentScore: 68,
    projectScore: 65,
    interviewScore: 60,
    demonstratedScore: 3.2,
    confidenceScore: 91,
    requiredLevel: 4.5,
    importance: 'HIGH',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 4
  },
  {
    skillName: 'DSA',
    category: 'Computer Science',
    selfClaimScore: 4.0,
    assessmentScore: 58,
    projectScore: 50,
    interviewScore: 55,
    demonstratedScore: 2.8,
    confidenceScore: 84,
    requiredLevel: 4.0,
    importance: 'HIGH',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 3
  },
  {
    skillName: 'SQL',
    category: 'Data Storage',
    selfClaimScore: 3.5,
    assessmentScore: 42,
    projectScore: 45,
    interviewScore: 40,
    demonstratedScore: 2.1,
    confidenceScore: 78,
    requiredLevel: 4.0,
    importance: 'HIGH',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 3
  },
  {
    skillName: 'Communication',
    category: 'Behavioral',
    selfClaimScore: 4.0,
    assessmentScore: 62,
    projectScore: 55,
    interviewScore: 60,
    demonstratedScore: 2.9,
    confidenceScore: 82,
    requiredLevel: 4.0,
    importance: 'HIGH',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 3
  },
  {
    skillName: 'OOP',
    category: 'Architecture',
    selfClaimScore: 4.0,
    assessmentScore: 65,
    projectScore: 60,
    interviewScore: 55,
    demonstratedScore: 3.0,
    confidenceScore: 85,
    requiredLevel: 4.0,
    importance: 'MEDIUM',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 3
  },
  {
    skillName: 'Git',
    category: 'Tooling',
    selfClaimScore: 2.0,
    assessmentScore: 46,
    projectScore: 50,
    interviewScore: 40,
    demonstratedScore: 2.2,
    confidenceScore: 70,
    requiredLevel: 3.5,
    importance: 'MEDIUM',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 2
  },
  {
    skillName: 'Problem Solving',
    category: 'Engineering',
    selfClaimScore: 4.0,
    assessmentScore: 66,
    projectScore: 60,
    interviewScore: 60,
    demonstratedScore: 3.1,
    confidenceScore: 80,
    requiredLevel: 4.0,
    importance: 'MEDIUM',
    lastUpdated: '2026-09-25T10:30:00Z',
    evidenceCount: 3
  }
];

export const INITIAL_LEARNING_ITEMS: LearningItem[] = [
  {
    id: 'learn-sql-1',
    skill: 'SQL',
    topic: 'Complex Window Functions & Nested JOIN Optimization',
    priority: 'HIGH',
    reason: 'Demonstrated score 2.1/5 falls short of required 4.0/5 for Sample Technologies backend role.',
    estimatedTime: '2.5 hours',
    status: 'NOT_STARTED',
    prerequisites: ['Basic SELECT queries', 'Group By & Aggregations'],
    actionableObjectives: [
      'Master DENSE_RANK() and ROW_NUMBER() over partitions',
      'Diagnose slow query plans using EXPLAIN ANALYZE',
      'Optimize multi-table LEFT JOINs to avoid filesorts'
    ],
    learningResources: [
      {
        id: 'res-sql-1',
        title: 'SQL Joins Tutorial for Beginners (Inner, Left, Right, Full)',
        platform: 'YouTube',
        type: 'Video',
        creator: 'freeCodeCamp.org',
        durationOrReadTime: '28 min video',
        url: 'https://www.youtube.com/watch?v=2HVMiPPuPIM',
        relevanceScore: 98
      },
      {
        id: 'res-sql-2',
        title: 'PostgreSQL Window Functions Masterclass (OVER, PARTITION BY, RANK)',
        platform: 'YouTube',
        type: 'Video',
        creator: 'Hussein Nasser',
        durationOrReadTime: '35 min video',
        url: 'https://www.youtube.com/watch?v=D5sZ3F5n5iU',
        relevanceScore: 94
      },
      {
        id: 'res-sql-3',
        title: 'PostgreSQL Official Docs: 3.5 Window Functions',
        platform: 'Documentation',
        type: 'Official Docs',
        creator: 'PostgreSQL Global Dev Group',
        durationOrReadTime: '15 min read',
        url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
        relevanceScore: 92
      },
      {
        id: 'res-sql-4',
        title: 'LeetCode 185: Department Top Three Salaries (Window Function)',
        platform: 'LeetCode',
        type: 'Interactive Practice',
        creator: 'LeetCode Database',
        durationOrReadTime: '20 min practice',
        url: 'https://leetcode.com/problems/department-top-three-salaries/',
        relevanceScore: 96
      },
      {
        id: 'res-sql-5',
        title: 'SQL JOIN (Set 1 - Inner, Left, Right and Full Joins)',
        platform: 'GeeksforGeeks',
        type: 'Guide',
        creator: 'GeeksforGeeks',
        durationOrReadTime: '10 min read',
        url: 'https://www.geeksforgeeks.org/sql-join-set-1-inner-left-right-and-full-joins/',
        relevanceScore: 89
      }
    ]
  },
  {
    id: 'learn-dsa-1',
    skill: 'DSA',
    topic: 'Graph Traversal & Cycle Detection (DFS / BFS)',
    priority: 'HIGH',
    reason: 'Demonstrated score 2.8/5 vs required 4.0/5. High importance in placement screening.',
    estimatedTime: '3 hours',
    status: 'NOT_STARTED',
    prerequisites: ['Adjacency Lists', 'Recursion fundamentals'],
    actionableObjectives: [
      'Implement cycle detection using 3-color state machine',
      'Topological Sort with Kahn Algorithm',
      'Shortest path using BFS on unweighted graphs'
    ],
    learningResources: [
      {
        id: 'res-dsa-1',
        title: 'Graph Algorithms for Technical Interviews - Full Course',
        platform: 'YouTube',
        type: 'Video',
        creator: 'freeCodeCamp.org',
        durationOrReadTime: '2 hr video',
        url: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU',
        relevanceScore: 98
      },
      {
        id: 'res-dsa-2',
        title: 'Course Schedule - LeetCode 207 - Cycle Detection Walkthrough',
        platform: 'YouTube',
        type: 'Video',
        creator: 'NeetCode',
        durationOrReadTime: '14 min video',
        url: 'https://www.youtube.com/watch?v=EgI5nU9etnU',
        relevanceScore: 96
      },
      {
        id: 'res-dsa-3',
        title: 'LeetCode 207: Course Schedule (Topological Sort / Cycle Detection)',
        platform: 'LeetCode',
        type: 'Interactive Practice',
        creator: 'LeetCode Algorithms',
        durationOrReadTime: '25 min challenge',
        url: 'https://leetcode.com/problems/course-schedule/',
        relevanceScore: 97
      },
      {
        id: 'res-dsa-4',
        title: 'Detect Cycle in a Directed Graph using DFS',
        platform: 'GeeksforGeeks',
        type: 'Guide',
        creator: 'GeeksforGeeks',
        durationOrReadTime: '12 min read',
        url: 'https://www.geeksforgeeks.org/detect-cycle-in-a-graph/',
        relevanceScore: 91
      }
    ]
  },
  {
    id: 'learn-java-1',
    skill: 'Java',
    topic: 'Java Memory Model, Volatile & Concurrency Primitives',
    priority: 'MEDIUM',
    reason: 'Self-claimed 4.5/5 but demonstrated 3.2/5 in multi-threaded execution guarantees.',
    estimatedTime: '2 hours',
    status: 'NOT_STARTED',
    prerequisites: ['Basic Thread creation', 'Synchronized keyword'],
    actionableObjectives: [
      'Understand happens-before relationship and volatile variables',
      'Thread safety with AtomicInteger vs ReentrantLock',
      'ExecutorService thread pool sizing'
    ],
    learningResources: [
      {
        id: 'res-java-1',
        title: 'Java Concurrency & Multithreading Masterclass',
        platform: 'YouTube',
        type: 'Video',
        creator: 'freeCodeCamp.org',
        durationOrReadTime: '1.5 hr video',
        url: 'https://www.youtube.com/watch?v=r_MbozD32eo',
        relevanceScore: 95
      },
      {
        id: 'res-java-2',
        title: 'Java Memory Model & Volatile Keyword Explained',
        platform: 'YouTube',
        type: 'Video',
        creator: 'Defog Tech',
        durationOrReadTime: '18 min video',
        url: 'https://www.youtube.com/watch?v=WH5UvQJizGU',
        relevanceScore: 93
      },
      {
        id: 'res-java-3',
        title: 'Oracle Java Official Tutorial: Concurrency & Synchronization',
        platform: 'Documentation',
        type: 'Official Docs',
        creator: 'Oracle Java Documentation',
        durationOrReadTime: '20 min read',
        url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
        relevanceScore: 91
      },
      {
        id: 'res-java-4',
        title: 'LeetCode 1114: Print in Order (Concurrency Problem)',
        platform: 'LeetCode',
        type: 'Interactive Practice',
        creator: 'LeetCode Concurrency',
        durationOrReadTime: '15 min practice',
        url: 'https://leetcode.com/problems/print-in-order/',
        relevanceScore: 92
      }
    ]
  },
  {
    id: 'learn-git-1',
    skill: 'Git',
    topic: 'Interactive Rebase, Cherry-Pick & Conflict Resolution',
    priority: 'LOW',
    reason: 'Demonstrated score 2.2/5 vs required 3.5/5 for enterprise team collaboration.',
    estimatedTime: '1 hour',
    status: 'NOT_STARTED',
    prerequisites: ['git add / commit / push'],
    actionableObjectives: [
      'Clean commit history with git rebase -i',
      'Resolve complex 3-way merge conflicts',
      'Squashing commits for pull request hygiene'
    ],
    learningResources: [
      {
        id: 'res-git-1',
        title: 'Git Rebase Explained in 100 Seconds',
        platform: 'YouTube',
        type: 'Video',
        creator: 'Fireship',
        durationOrReadTime: '2 min video',
        url: 'https://www.youtube.com/watch?v=f1wnYdLEpgI',
        relevanceScore: 96
      },
      {
        id: 'res-git-2',
        title: 'Git SCM Book: 3.6 Git Branching - Rebasing',
        platform: 'Documentation',
        type: 'Official Docs',
        creator: 'Git SCM',
        durationOrReadTime: '15 min read',
        url: 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing',
        relevanceScore: 94
      },
      {
        id: 'res-git-3',
        title: 'Learn Git Branching (Interactive Visual Sandbox)',
        platform: 'Interactive',
        type: 'Interactive Practice',
        creator: 'LearnGitBranching',
        durationOrReadTime: '20 min sandbox',
        url: 'https://learngitbranching.js.org/',
        relevanceScore: 98
      },
      {
        id: 'res-git-4',
        title: 'How to Rebase a Pull Request on GitHub',
        platform: 'freeCodeCamp',
        type: 'Guide',
        creator: 'freeCodeCamp.org',
        durationOrReadTime: '10 min read',
        url: 'https://www.freecodecamp.org/news/how-to-rebase-a-pull-request/',
        relevanceScore: 90
      }
    ]
  }
];

export const INITIAL_PROJECTS: ProjectEvidenceItem[] = [
  {
    id: 'proj-1',
    name: 'Distributed Order Processing System',
    githubUrl: 'https://github.com/sample-tech/order-microservice',
    description: 'Spring Boot REST service for e-commerce orders with PostgreSQL persistence, Kafka event publishing, and Redis cart caching.',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Git'],
    detectedSkills: [
      { skill: 'Java', demonstratedLevel: 3.5, confidence: 75, rationale: 'Clean controller-service-repository layered architecture.' },
      { skill: 'SQL', demonstratedLevel: 2.8, confidence: 65, rationale: 'Basic schema migrations and foreign key constraints.' },
      { skill: 'Git', demonstratedLevel: 3.0, confidence: 70, rationale: 'Regular commit frequency and feature branch flow.' }
    ],
    evidenceNotes: 'Project demonstrates practical enterprise engineering. Contributes 20% to verified evidence weighting.',
    limitations: ['Unit test coverage is below 50%', 'No indexing benchmarks documented'],
    projectScore: 72,
    addedAt: '2026-09-24T14:00:00Z'
  }
];

export const INITIAL_RESUME: ResumeData = {
  fullName: 'Alex Morgan',
  email: 'alex.morgan@sampletech.edu',
  phone: '+1 (555) 382-9102',
  summary: 'Backend-focused software engineering student with proven hands-on experience in Java, Spring Boot, and relational database systems. Built high-concurrency microservices processing 1,000+ orders/min.',
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'State University of Technology',
      year: 'Graduating 2026',
      gpa: '3.8 / 4.0'
    }
  ],
  experience: [
    {
      title: 'Software Engineering Intern',
      company: 'TechFlow Systems',
      period: 'Summer 2025',
      highlights: [
        'Developed REST endpoints in Java Spring Boot reducing API response latency by 18%.',
        'Implemented database queries in PostgreSQL and created automated regression test suites.'
      ]
    }
  ],
  projects: [
    {
      name: 'Distributed Order Processing Service',
      description: 'Asynchronous order workflow orchestrating inventory verification and payment processing.',
      techStack: 'Java, Spring Boot, PostgreSQL, Kafka, Redis',
      link: 'https://github.com/sample-tech/order-microservice'
    },
    {
      name: 'Algorithm Visualizer Platform',
      description: 'Web application visualizing sorting algorithms, graph traversals, and dynamic programming.',
      techStack: 'TypeScript, React, Algorithms',
      link: 'https://github.com/alexmorgan/algo-viz'
    }
  ],
  certifications: [
    'Oracle Certified Associate: Java SE Programmer',
    'PostgreSQL Database Fundamentals'
  ],
  tailorAnalysis: {
    matchScore: 74,
    disclaimer: 'SkillPath Resume Match Score (heuristic alignment, not employer ATS)',
    missingKeywords: ['Distributed Caching', 'Docker Containerization', 'Unit Test Coverage', 'Kafka'],
    tailorSuggestions: [
      'Quantify results in the experience section (e.g. throughput, query execution time).',
      'Display verified skills (Java 3.2/5, DSA 2.8/5) under Technical Competencies.',
      'Highlight concrete problem-solving stories in project descriptions.'
    ],
    strengths: [
      'Targeted focus on backend engineering matching Sample Technologies requirements.',
      'Strong alignment with Java and core computer science fundamentals.'
    ],
    analyzedAt: '2026-09-25T11:00:00Z'
  }
};
