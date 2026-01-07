export interface LMSContent {
    id: string;
    topic: string;
    subTopic: string;
    videoUrl: string;
    description?: string;
    date: string;
    teacherName: string;
    className: string; // Added class field
}

export const MOCK_LMS_CONTENT: LMSContent[] = [
    {
        id: '1',
        topic: 'Mathematics',
        subTopic: 'Algebra - Quadratic Equations',
        videoUrl: 'https://www.youtube.com/watch?v=JustAMockVideoId',
        description: 'Introduction to solving quadratic equations using factorization.',
        date: '2024-05-15',
        teacherName: 'Rahul Reddy',
        className: '10th A',
    },
    {
        id: '2',
        topic: 'Science',
        subTopic: 'Physics - Newton\'s Laws',
        videoUrl: 'https://www.youtube.com/watch?v=JustAMockVideoId2',
        description: 'Understanding Newton\'s three laws of motion with examples.',
        date: '2024-05-16',
        teacherName: 'Rahul Reddy',
        className: '9th B',
    }
];
