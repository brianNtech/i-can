import { User, UserRole, Job, Certification, NewsletterArticle, ForumPost } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'user',
    role: UserRole.CLIENT,
    name: 'Brian',
    profilePicture: 'https://picsum.photos/seed/brian/200',
    currentJob: 'IT Support',
    desiredJob: 'AI Engineer',
    currentSkills: ['Software development', 'Troubleshooting', 'Technical Writing'],
    desiredSkills: ['AI Prompting', 'AI/ML Fundamentals', 'AI Integration'],
    desiredSalary: { min: 50000000, max: 100000000 },
  },
  {
    id: 2,
    username: 'hrd',
    role: UserRole.HRD,
    name: 'Nathanael',
    company: 'PT Maju Jaya',
    profilePicture: 'https://picsum.photos/seed/nathanael/200',
    requiredSkills: ['AI Prompting', 'AI/ML Fundamentals', 'AI Integration'],
    budget: { min: 40000000, max: 100000000 },
  },
  {
    id: 3,
    username: 'hrd_premium',
    role: UserRole.HRD_PREMIUM,
    name: 'Samantha',
    company: 'Tech Innovations Inc.',
    profilePicture: 'https://picsum.photos/seed/samantha/200',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'CI/CD'],
    budget: { min: 60000000, max: 120000000 },
  },
    {
    id: 4,
    username: 'alice',
    role: UserRole.CLIENT,
    name: 'Alice',
    profilePicture: 'https://picsum.photos/seed/alice/200',
    currentJob: 'Data Analyst',
    desiredJob: 'AI Engineer',
    currentSkills: ['SQL', 'Tableau', 'Python'],
    desiredSkills: ['AI Integration', 'TensorFlow', 'Cloud Computing'],
    desiredSalary: { min: 60000000, max: 90000000 },
  },
  {
    id: 5,
    username: 'charlie',
    role: UserRole.CLIENT,
    name: 'Charlie',
    profilePicture: 'https://picsum.photos/seed/charlie/200',
    currentJob: 'Web Developer',
    desiredJob: 'AI Engineer',
    currentSkills: ['JavaScript', 'HTML/CSS', 'React'],
    desiredSkills: ['AI/ML Fundamentals', 'Python', 'API Design'],
    desiredSalary: { min: 55000000, max: 85000000 },
  }
];

export const mockJobs: Job[] = [
  {
    id: 1,
    companyName: 'PT Cloud Computers Indonesia',
    companyLogo: 'https://picsum.photos/seed/cloudcomp/100',
    title: 'IT Support',
    description: ['Mengelola dan maintenance computer perusahaan', 'Upgrade hardware computer', 'Backup server perusahaan'],
    salary: 9000000,
    location: 'Surabaya',
    postedBy: 2,
  },
  {
    id: 2,
    companyName: 'Tech Innovations Inc.',
    companyLogo: 'https://picsum.photos/seed/techinc/100',
    title: 'Frontend Developer',
    description: ['Develop new user-facing features', 'Build reusable code and libraries for future use', 'Ensure the technical feasibility of UI/UX designs'],
    salary: 15000000,
    location: 'Jakarta',
    postedBy: 3,
  },
  {
    id: 3,
    companyName: 'Astra International',
    companyLogo: 'https://picsum.photos/seed/astra/100',
    title: 'Management Trainee',
    description: ['Participate in a fast-track leadership development program', 'Rotate through various departments', 'Lead strategic projects'],
    salary: 12000000,
    location: 'Jakarta',
    postedBy: 2,
  },
    {
    id: 4,
    companyName: 'PERTAMINA',
    companyLogo: 'https://picsum.photos/seed/pertamina/100',
    title: 'Petroleum Engineer',
    description: ['Design and develop methods for extracting oil and gas', 'Ensure compliance with environmental regulations', 'Analyze geological data'],
    salary: 25000000,
    location: 'Balikpapan',
    postedBy: 3,
  },
  {
    id: 5,
    companyName: 'Bank Central Asia (BCA)',
    companyLogo: 'https://picsum.photos/seed/bca/100',
    title: 'Data Scientist',
    description: ['Analyze large amounts of complex raw data', 'Build predictive models and machine-learning algorithms', 'Present information using data visualization techniques'],
    salary: 20000000,
    location: 'Jakarta',
    postedBy: 2,
  },
];

export const mockCertifications: Certification[] = [
    { id: 1, title: 'COMPTIA Security+', description: 'Sertifikasi Tata Kelola keamanan computer dan sistem.', price: 3000000, thumbnail: 'https://picsum.photos/seed/comptia/300/200' },
    { id: 2, title: 'Certified Cloud Practitioner', description: 'Foundational, high-level understanding of AWS Cloud.', price: 1500000, thumbnail: 'https://picsum.photos/seed/aws/300/200' },
    { id: 3, title: 'Professional Scrum Master I', description: 'Demonstrate a fundamental level of Scrum mastery.', price: 2500000, thumbnail: 'https://picsum.photos/seed/scrum/300/200' },
    { id: 4, title: 'Google Project Management', description: 'Gain in-demand skills in project management.', price: 2000000, thumbnail: 'https://picsum.photos/seed/googlepm/300/200' },
];

export const mockArticles: NewsletterArticle[] = [
    { id: 1, title: 'Indonesia Tech Week 2024', summary: 'The biggest tech recruitment event is back in Jakarta. Join thousands of developers and hundreds of companies.', content: 'Full content here...', author: 'Nathanael', date: '2024-07-15' },
    { id: 2, title: 'Upskilling for the AI Revolution', summary: 'A government-sponsored training program for AI and Machine Learning is now open for registration in Bandung.', content: 'Full content here...', author: 'Samantha', date: '2024-07-12' },
];

export const mockForumPosts: ForumPost[] = [
    {
        id: 1,
        title: 'Cara membuat website sederhana?',
        authorId: 1,
        content: 'Halo semua, saya baru mau mulai belajar web development. Ada saran framework apa yang mudah untuk pemula? Terima kasih!',
        comments: [
            { id: 1, authorId: 4, content: 'Bisa coba pakai React atau Vue. Keduanya punya dokumentasi yang bagus banget buat pemula.' },
            { id: 2, authorId: 5, content: 'Kalau mau yang lebih simple lagi, bisa mulai dari HTML, CSS, dan vanilla JavaScript dulu biar fundamentalnya kuat.' },
        ]
    },
    {
        id: 2,
        title: 'Tips membuat portofolio yang menarik HRD',
        authorId: 5,
        content: 'Saya sudah punya beberapa project, tapi bingung cara menampilkannya di portofolio. Apa saja yang biasanya dilihat oleh HRD?',
        comments: [
             { id: 3, authorId: 2, content: 'Sebagai HRD, saya suka portofolio yang to-the-point. Tampilkan 2-3 project terbaikmu, jelaskan masalah yang diselesaikan, teknologi yang dipakai, dan link live demo/source code. Itu sudah cukup!' },
        ]
    }
]
