import { db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Notice } from '../types/models';
import { logError } from '../utils/error';

export const NoticeService = {
    getRecent: async (limitCount = 5): Promise<Notice[]> => {
        try {
            const q = query(
                collection(db, 'notices'),
                orderBy('date', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notice[];
        } catch (error) {
            logError('NoticeService:getRecent', error);
            // Return mock if empty or error (for prototype resilience)
            return [
                { id: '1', title: 'School Reopens', content: 'School reopens on Monday.', date: '2025-01-10' },
                { id: '2', title: 'Exam Schedule', content: 'Mid-term exams start next week.', date: '2025-01-05' }
            ];
        }
    }
};
