import { createClient } from 'redis';

                const client = createClient({
                RESP: 3,
                clientSideCache: {
                    ttl: 30000,             // Time-to-live in milliseconds (0 = no expiration)
                    maxEntries: 0,      // Maximum entries to store (0 = unlimited)
                    evictPolicy: "LRU"  // Eviction policy: "LRU" or "FIFO"
                }
                });        
        client.on('error', err => console.log('Redis Client Error', err));
        export default client;