import { synchronize } from '@nozbe/watermelondb/sync'
import database from './index'
import { api } from '../services/apiClient'

export async function sync() {
    await synchronize({
        database,
        pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
            // 1. Fetch changes from backend
            // We need an endpoint that returns { changes: { diary_entries: { created, updated, deleted } }, timestamp }
            // Since we might not have a dedicated sync endpoint yet, we will construct a valid response
            // from standard endpoints for now (or minimal implementation).

            // For this "First Pass", let's assume we pull *all* recent diary entries and user profile
            // and format them as 'updated' to let WatermelonDB merge them.

            const timestamp = Date.now()

            // Fetch Diary
            // Limiting to recent for performance if no incremental sync available
            const diaryEntries = await api.get<any[]>('/diary', { updated_since: lastPulledAt || 0 });

            // Fetch User (Self)
            const userProfile = await api.get<any>('/auth/me'); // or similar

            return {
                changes: {
                    diary_entries: {
                        created: [], // If we can't distinguish, we can treat all as updated (upsert)
                        updated: diaryEntries.map(d => ({
                            id: d.id,
                            class_section_id: d.class_section_id,
                            entry_date: d.entry_date,
                            subject_id: d.subject_id,
                            title: d.title,
                            content: d.content,
                            homework_due_date: d.homework_due_date,
                            attachments: d.attachments,
                            subject_name: d.subject_name,
                            created_by: d.created_by,
                            created_at: new Date(d.created_at).getTime(),
                            updated_at: new Date(d.created_at).getTime(), // Fallback if no updated_at
                        })),
                        deleted: [], // We need a way to track deletions
                    },
                    users: {
                        created: [],
                        updated: [userProfile].map(u => ({
                            id: u.id, // Ensure ID matches
                            email: u.email,
                            first_name: u.first_name,
                            last_name: u.last_name,
                            display_name: u.display_name,
                            role: u.role,
                            photo_url: u.photo_url,
                            permissions: u.permissions
                        })),
                        deleted: [],
                    },
                },
                timestamp,
            }
        },
        pushChanges: async ({ changes, lastPulledAt }) => {
            // Push changes to backend
            // changes = { diary_entries: { created: [], updated: [], deleted: [] } }

            const { diary_entries } = changes as any

            if (diary_entries) {
                // created
                for (const entry of diary_entries.created) {
                    await api.post('/diary', entry)
                }
                // updated
                for (const entry of diary_entries.updated) {
                    await api.put(`/diary/${entry.id}`, entry)
                }
                // deleted
                for (const id of diary_entries.deleted) {
                    await api.delete(`/diary/${id}`)
                }
            }

            // Users are typically read-only or handled separately
        },
        migrationsEnabledAtVersion: 1,
    })
}
