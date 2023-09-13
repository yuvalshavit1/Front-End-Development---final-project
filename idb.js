// Define the name of the IndexedDB database
const databaseName = "costsdb";

// Create a class for managing IndexedDB operations
class IndexedDB {

    constructor() {
        // Initialize the database name and database connection
        this.dbName = databaseName;
        this.db = null;
        this.init();
    }

    // Initialize the IndexedDB database and object store
    init() {
        // Open a connection to the database or create it if it doesn't exist
        const request = window.indexedDB.open(this.dbName, 1);
        // Handle database schema upgrades
        request.onupgradeneeded = (event) => {
            this.db = event.target.result;

            // Create an object store named 'expenses' with auto-incrementing integer keys
            const objectStore = this.db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
            // Create an index for querying expenses by date
            objectStore.createIndex('date', 'date', { unique: false });
        };

        // Handle successful database connection
        request.onsuccess = (event) => {
            this.db = event.target.result;
        };

        // Handle database connection errors
        request.onerror = (event) => {
            console.error('Error opening database', event.target.error);
        };
    }

    // Add an expense to the 'expenses' object store
    async addCost(expense) {
        if (!this.db) {
            console.error('IndexedDB is not initialized.');
            return;
        }
        // Create a read-write transaction and access the 'expenses' object store
        const transaction = this.db.transaction('expenses', 'readwrite');
        const objectStore = transaction.objectStore('expenses');
        // Add the expense to the object store
        await objectStore.add(expense);
    }

    // Retrieve all expenses from the 'expenses' object store
    async getCost() {
        if (!this.db) {
            console.error('IndexedDB is not initialized.');
            return [];
        }
        // Create a promise for asynchronously retrieving expenses
        return new Promise((resolve, reject) => {
            // Create a read-only transaction and access the 'expenses' object store
            const transaction = this.db.transaction('expenses', 'readonly');
            const objectStore = transaction.objectStore('expenses');
            const expenses = [];

            // Iterate through expenses using a cursor
            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    expenses.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(expenses);
                }
            };

            // Handle transaction completion
            transaction.oncomplete = () => {
                // Resolve the promise with the collected expenses
                resolve(expenses);
            };

            // Handle transaction errors
            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }
}

export default IndexedDB;
