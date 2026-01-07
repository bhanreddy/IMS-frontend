import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { logError } from '../utils/error';

export const ClassService = {
    getAll: async () => {
        try {
            const q = query(collection(db, 'classes'), orderBy('name'));
            const snaps = await getDocs(q);
            return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            logError('ClassService:getAll', error);
            return [];
        }
    }
};
