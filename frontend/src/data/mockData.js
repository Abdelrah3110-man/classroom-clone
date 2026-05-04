export const mockClassrooms = [
  {
    id: 1,
    name: 'Advanced Web Engineering',
    section: 'CS-401',
    subject: 'Computer Science',
    room: 'Lab 3',
    code: 'WEB777',
    user: { name: 'Dr. Sarah Wilson' },
    banner_color: '#4285f4',
    posts: [
      { id: 101, content: 'Welcome to the advanced web engineering course! Please check the syllabus.', user: { name: 'Dr. Sarah Wilson' }, created_at: new Date().toISOString() },
      { id: 102, content: 'Reminder: The first project proposal is due next Friday.', user: { name: 'Dr. Sarah Wilson' }, created_at: new Date(Date.now() - 86400000).toISOString() }
    ],
    assignments: [
      { id: 201, title: 'React Hooks Deep Dive', due_date: new Date(Date.now() + 604800000).toISOString(), created_at: new Date().toISOString() }
    ],
    materials: [
      { id: 301, title: 'Architecture Patterns PDF', created_at: new Date().toISOString() }
    ]
  },
  {
    id: 2,
    name: 'UI/UX Principles',
    section: 'Design-B',
    subject: 'Arts & Design',
    room: 'Studio 5',
    code: 'DSN102',
    user: { name: 'Prof. James Miller' },
    banner_color: '#34a853',
    posts: [],
    assignments: [],
    materials: []
  },
  {
    id: 3,
    name: 'Data Structures',
    section: 'Year 2',
    subject: 'Algorithms',
    room: 'Hall A',
    code: 'ALG202',
    user: { name: 'Prof. Alan Turing' },
    banner_color: '#fbbc05',
    posts: [],
    assignments: [],
    materials: []
  }
];

export const currentUser = {
  id: 1,
  name: 'Senior Developer',
  email: 'admin@example.com',
  avatar: 'A'
};
