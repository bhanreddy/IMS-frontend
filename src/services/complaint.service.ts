import { db } from '../config/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { Complaint } from '../types/models';
import { ComplaintSchema } from '../types/schemas';
import { logError } from '../utils/error';

export const ComplaintService = {
    getAll: async (): Promise<Complaint[]> => {
        try {
            const snaps = await getDocs(collection(db, 'complaints'));
            const complaints = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
            // validate
            return complaints.filter(c => ComplaintSchema.safeParse(c).success) as Complaint[];
        } catch (e) {
            logError('ComplaintService:getAll', e);
            throw e;
        }
    },

    // Example specific queries
    getByUser: async (userId: string) => {
        //...
    }
};
