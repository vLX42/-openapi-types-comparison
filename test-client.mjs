/**
 * test-client.mjs
 * Run with: node test-client.mjs
 *
 * This script starts a client pointing at http://localhost:3001 (json-server)
 * and calls listPets().
 */
import { createClient } from './hey-api-client/src/client/index.js';

async function main() {
  const client = createClient('http://localhost:3001');
  try {
    const pets = await client.pets.listPets({ limit: 10 });
    console.log('pets:', pets);
  } catch (err) {
    console.error('Error calling client:', err);
    process.exitCode = 2;
  }
}

main();
