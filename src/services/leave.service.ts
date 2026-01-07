import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Functions } from './functions';
import { logError } from '../utils/error';

export const LeaveService = {
    getByUser: async (userId: string) => {
        try {
            const q = query(
                collection(db, 'leaves'),
                where('submitterId', '==', userId),
                orderBy('startDate', 'desc')
            );
            const snaps = await getDocs(q);
            return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            logError('LeaveService:getByUser', error);
            // Fallback if index missing
            return [];
        }
    },

    applyLeave: async (data: any) => {
        return Functions.call('applyLeave', data);
    }
};
