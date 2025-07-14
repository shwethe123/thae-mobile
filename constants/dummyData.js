// constants/dummyData.js

const API = "http://192.168.16.32:8080";

export const shops = [
  { id: '1', name: 'ဆိုင်(၁) (ဆန်ဆိုင်း)' },
  { id: '2', name: 'ဆိုင်(၂) (ဝမ်လုံး)' },
  { id: '3', name: 'ဆိုင်(၃) (ဟောင်လိတ်)' },
];

// export const user = [
//   { id: '1', name: 'ဆိုင်(၁) (ဆန်ဆိုင်း)' },
//   { id: '2', name: 'ဆိုင်(၂) (ဝမ်လုံး)' },
//   { id: '3', name: 'ဆိုင်(၃) (ဟောင်လိတ်)' },
// ];

export const getDummyJobs = async () => {
  try {
    const response = await fetch(`${API}/dummy`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch dummy jobs:', error);
    return []; 
  }
};

// constants/dummyData.js

// ... your existing shops and dummyJobs exports ...

export const dummyPosts = [
  {
    id: 'p1',
    authorId: 'user_123', // This is our current user
    author: {
      name: 'John Doe', // We'll get this from Clerk dynamically
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    timestamp: '2h ago',
    content: 'Just found a much more efficient way to install the new AC units. We can cut down installation time by almost 20% by prepping the brackets beforehand. Happy to show anyone who is interested!',
    image: 'https://images.unsplash.com/photo-1542202275-5353634571a3?q=80&w=2070',
    likes: 15,
    commentsCount: 4,
  },
  {
    id: 'p2',
    authorId: 'user_456', // This is another user
    author: {
      name: 'Jane Smith',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    timestamp: '8h ago',
    content: 'Suggestion: Could we get better quality plumbing wrenches? The ones we currently have are starting to slip, which is a safety concern. Investing in a good set would benefit all of us.',
    image: null,
    likes: 22,
    commentsCount: 9,
  },
  {
    id: 'p4', // Add another post from our user
    authorId: 'user_123',
    author: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=12',
    },
    timestamp: '3d ago',
    content: 'Quick question: has anyone worked with the new "Quantum-Flow" pipes? Looking for some tips before I start the installation at the new complex tomorrow.',
    image: null,
    likes: 8,
    commentsCount: 2,
  },
  {
    id: 'p3',
    authorId: 'user_789', // Admin user
    author: {
      name: 'Admin',
      avatar: 'https://i.pravatar.cc/150?img=50',
    },
    timestamp: '1d ago',
    content: 'Reminder: The quarterly safety meeting is scheduled for this Friday at 4 PM. Please make sure all your pending jobs are completed or handed over properly. Attendance is mandatory.',
    image: null,
    likes: 45,
    commentsCount: 12,
  }
];


// constants/dummyData.js

// ... your existing shops, dummyJobs, and dummyPosts exports ...

export const dummyReplies = {
  // Key is the postId (p1, p2, etc.)
  'p1': [
    {
      id: 'r1',
      author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=3' },
      timestamp: '1h ago',
      content: 'Wow, this is a great tip! I will definitely try this on my next job. Thanks for sharing, John!',
    },
    {
      id: 'r2',
      author: { name: 'Mark Evans', avatar: 'https://i.pravatar.cc/150?img=7' },
      timestamp: '45m ago',
      content: 'Could you post a picture of the prepped brackets? I want to make sure I get it right.',
    },
  ],
  'p2': [
    {
      id: 'r3',
      author: { name: 'Admin', avatar: 'https://i.pravatar.cc/150?img=50' },
      timestamp: '7h ago',
      content: 'Thanks for the feedback, Jane. We take safety very seriously. I\'ve put in a request for a new set of high-quality wrenches.',
    },
  ],
  // p3 has no comments yet
};
