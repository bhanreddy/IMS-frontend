import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import { modelClasses } from './models'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment out the migration for the initial version)
    // migrations, 
    // (optional database name or file system path)
    // dbName: 'myapp',
    // (recommended option, should work flawlessly out of the box on iOS. On Android,
    // additional installation steps have to be taken - prevent JSI issues)
    jsi: true, /* Platform.OS === 'ios' */

    onSetUpError: error => {
        // Database failed to load -- offer the user to reload the app or log out
        console.error('Database setup failed', error)
    }
})

// Then, make a Watermelon database from it!
const database = new Database({
    adapter,
    modelClasses,
})

export default database
