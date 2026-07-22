export const portfolioData = {
  profile: {
    name: 'Yogendra N',
    title: 'Computer Science Engineering Student & Full Stack Developer',
    tagline: 'Building scalable web applications with modern technologies while solving real-world problems through clean, efficient, and user-focused software.',
    aboutMe: 'I am a Computer Science Engineering student passionate about engineering scalable, high-performance web applications. I specialize in the MERN stack and write clean, maintainable code. My expertise includes building RESTful APIs, designing relational and non-relational database schemas, implementing responsive user interfaces, and integrating real-time communication systems. I am actively perfecting my knowledge of systems engineering, Data Structures & Algorithms, and modern full-stack practices to solve real-world problems.',
    currentFocus: [
      'MERN Stack Development',
      'Backend Development (Node.js & Express)',
      'Frontend Development (React.js & Tailwind)',
      'MongoDB Database Optimization',
      'RESTful API Design',
      'TypeScript & Next.js Ecosystem',
      'Data Structures & Algorithms (C++)',
      'Scalable Architecture & Design Patterns'
    ],
    gitHubUrl: 'https://github.com/yogendra-cse',
    linkedInUrl: 'https://www.linkedin.com/in/yogendra-navaneethan-99764b291/',
    leetCodeUrl: 'https://leetcode.com',
    email: 'yogendra.yogachitra@gmail.com',
    phone: '6369985284',
    resumeUrl: '/resume.pdf'
  },
  education: [
    {
      degree: "Bachelor of Engineering (Computer Science Engineering)",
      school: "Sri Eshwar College of Engineering",
      duration: "2023 - 2027",
      metrics: "7.89 CGPA"
    },
    {
      degree: "Higher Secondary Education",
      school: "Thiagarajar Model Higher Secondary School",
      duration: "2021 - 2023",
      metrics: "92.1%"
    }
  ],
  skills: [
    // Programming Languages
    { name: 'C (Basics)', category: 'Programming Languages', level: 85, icon: 'Terminal' },
    { name: 'C++', category: 'Programming Languages', level: 90, icon: 'Cpu' },
    { name: 'JavaScript', category: 'Programming Languages', level: 92, icon: 'Code' },
    { name: 'TypeScript', category: 'Programming Languages', level: 80, icon: 'Code' },

    // Frontend
    { name: 'HTML5', category: 'Frontend', level: 95, icon: 'Layers' },
    { name: 'CSS3', category: 'Frontend', level: 92, icon: 'Sliders' },
    { name: 'Tailwind CSS', category: 'Frontend', level: 90, icon: 'Wind' },
    { name: 'React.js', category: 'Frontend', level: 90, icon: 'Atom' },
    { name: 'React Router', category: 'Frontend', level: 88, icon: 'Compass' },
    { name: 'Next.js', category: 'Frontend', level: 75, icon: 'Sparkles' },

    // Backend
    { name: 'Node.js', category: 'Backend', level: 88, icon: 'Server' },
    { name: 'Express.js', category: 'Backend', level: 90, icon: 'Webhook' },

    // Database
    { name: 'MongoDB', category: 'Database', level: 86, icon: 'Database' },
    



   

    // Core Concepts
    { name: 'Data Structures', category: 'Core Concepts', level: 85, icon: 'Network' },
    { name: 'Algorithms', category: 'Core Concepts', level: 86, icon: 'Binary' },
    { name: 'REST APIs', category: 'Core Concepts', level: 92, icon: 'Link' },
    { name: 'Responsive Design', category: 'Core Concepts', level: 94, icon: 'Smartphone' },
    { name: 'API Integration', category: 'Core Concepts', level: 90, icon: 'Shuffle' }
  ],
  experiences: [
    {
      company: 'Better Tomorrow',
      title: 'MERN Stack Developer Intern',
      duration: '2025',
      responsibilities: [
        'Architected and implemented full-stack web applications using React.js, Node.js, Express.js, and MongoDB.',
        'Designed and optimized secure RESTful APIs implementing token-based JWT and Cookie validation.',
        'Orchestrated multi-part file uploads and profile image pipelines utilizing Multer and Cloudinary integration.',
        'Worked with MongoDB to manage collections and design schema mappings.',
        'Strengthened backend integrations and successfully connected front-end interfaces to high-performance RESTful microservices.',
        'Developed fully responsive, fluid, mobile-first layouts using modern web design principles.'
      ],
      techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Cloudinary', 'Tailwind CSS']
    },
    {
      company: 'Better Tomorrow (Modern Stack)',
      title: 'Modern Full-Stack Developer Intern',
      duration: '2025',
      responsibilities: [
        'Engineered microservice REST APIs and integrated data components using TypeScript and Express.',
        'Built fast backend services utilizing MongoDB instances with highly optimized query parameters.',
        'Developed scalable web architectures utilizing modern web principles and design systems.',
        'Leveraged Next.js structure and TypeScript type-specifications to build robust application features.',
        'Enhanced application response times and interface execution speeds through query indexing.'
      ],
      techStack: ['Next.js', 'TypeScript', 'Express.js', 'MongoDB', 'Node.js']
    }
  ],
  projects: [
    {
      title: 'Book Exchange Platform',
      description: 'A premium full-stack marketplace for swapping physical books. Features location-aware book listing discovery, smart matches, automated OTP verification for meeting confirmations, and integration of AI engines for summary generation.',
      features: [
        'Secure User Authentication & Session Security (JWT)',
        'Dynamic One-Time-Password (OTP) Generation and Trade Verification',
        'AI-Generated Book Summaries and Key Takeaway Engine',
        'Real-Time Chat & Direct Messaging using WebSockets (Socket.io)',
        'Multi-Image Upload & Optimization utilizing Cloudinary',
        'Near-by Geo-location Book Listing Search & Dynamic Discovery',
        'Sleek Responsive layout matching modern web specifications'
      ],
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Cloudinary', 'Tailwind CSS'],
      github: 'https://github.com/yogendra-cse/Book-Exchange-Platform',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
      metrics: 'Average 120ms API response time'
    },
    {
      title: 'MERN Blog Platform',
      description: 'An elegant content-management platform for technical blogging. Supports WYSIWYG rich text creation, image rendering, tags, search sorting indices, read-time estimations, and smooth visual page transitions.',
      features: [
        'JWT Admin Cookie Authentication & Secure Write-Access Control',
        'Rich HTML WYSIWYG Editing experience for composing articles',
        'Fast Uploads and Media Management powered by Cloudinary API',
        'Categories & Tags classification for high content searchability',
        'Fully responsive layout designed on premium aesthetics'
      ],
      techStack: ['MongoDB', 'Express', 'React', 'Node.js', 'Cloudinary', 'Tailwind CSS'],
      github: 'https://github.com/yogendra-cse/MERN-Blog-website',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
      metrics: '99% SEO score audit rating'
    },
    {
      title: 'Premium Frontend Portfolio',
      description: 'Redesigned and optimized static portfolio site highlighting creative projects, UI transitions, and modular designs utilizing modern styling guidelines.',
      features: [
        'Clean semantic HTML markup structure',
        'Interactive components with smooth keyframe animations',
        'Cross-browser optimization & offline compatibility support'
      ],
      techStack: ['HTML5', 'CSS3', 'JavaScript'],
      github: 'https://github.com/SECE-2023-2027/portfolio-mern-yogendra-cse',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
      metrics: 'Redefined design with 0 outer dependencies'
    }
  ],
  achievements: [
    {
      title: 'Selfe Hackathon Finalist',
      description: 'Selected among Top Teams for Project Cyberchondria in Selfe Hackathon conducted by Sri Eshwar College of Engineering among 500+ participants.',
      details: 'Developed a full-stack web application to assist users in identifying and managing health-related anxiety through AI-driven symptom analysis and personalized recommendations.'
    },
    {
      title: 'LeetCode Competitive Rating',
      rating: 1554,
      solvedCount: 567,
      description: 'Maintained 1554 global rating, completing over 567 algorithmic problems on LeetCode.',
      details: 'Demonstrates deep capability in binary search, dynamic programming, and computational graphs.'
    },
    {
      title: 'Skillrack Coding Accomplishments',
      solvedCount: 300,
      description: 'Successfully solved and verified 300+ algorithms and programmatic problems on Skillrack platform.',
      details: 'Daily consistency and code compliance proofing'
    }
  ],
  certifications: [
    { title: 'Java Programming', provider: 'Udemy', link: 'https://www.udemy.com/certificate/UC-398e9a63-4f3e-4af2-8bd0-fae33b02373d/' },
    { title: 'C Programming', provider: 'Udemy', link: 'https://www.udemy.com/certificate/UC-7091e4ee-333b-4b97-9f31-6b1f56d47baf/' },
    { title: 'Data Structures & Algorithms using C and C++', provider: 'Udemy', link: 'https://drive.google.com/file/d/1aIZLkiAwniQTnpAkTOQlBpow43ySKkgi/view' }
  ]
};
