import { db } from '../config/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../types/models'; // Staff is a User with role 'staff'/'teacher'
import { UserSchema } from '../types/schemas'; // Validating as User
import { Functions } from './functions';
import { logError } from '../utils/error';

export const StaffService = {
    getAll: async (): Promise<User[]> => {
        try {
            // Query users where role is in ['staff', 'teacher', 'admin']?
            // Or just 'staff' collection if separate? Blueprint said `staff/{staffId}`.
            // "Firestore Collections: users/{uid}, staff/{staffId}". 

            // Wait, models.ts defined Staff as User? Or separate? 
            // User request: "Firestore Collections: ... staff/{staffId}".
            // So Staff are in 'staff' collection? OR are they Users with role?
            // "students/{studentId}", "staff/{staffId}". 
            // AND "users/{uid}".
            // It implies separation. Users = Auth/Login data. Staff/Student = Domain data.

            const snaps = await getDocs(collection(db, 'staff'));
            const staff = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

            // Validate
            // Note: UserSchema might check for 'uid', but staff doc might have 'userId'?
            // Adjusting schema validation or using partial
            return staff as any[]; // TODO: Strict schema for Staff domain model

        } catch (error) {
            logError('StaffService:getAll', error);
            throw error;
        }
    },

    getClassTeacher: async (classId: string): Promise<User | null> => {
        try {
            const q = query(
                collection(db, 'staff'),
                where('classId', '==', classId),
                where('role', '==', 'teacher')
            );
            const snap = await getDocs(q);
            if (snap.empty) return null;
            // Return the first match
            const docSnap = snap.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as User;
        } catch (error) {
            logError('StaffService:getClassTeacher', error);
            return null;
        }
    },

    getById: async (id: string) => {
        try {
            const snap = await getDoc(doc(db, 'staff', id));
            if (!snap.exists()) return null;
            return { id: snap.id, ...snap.data() };
        } catch (e) {
            logError('StaffService:getById', e);
            throw e;
        }
    },

    create: (data: any) => Functions.createStaff(data),
    update: (id: string, data: any) => Functions.updateStaff({ id, ...data }),
};
