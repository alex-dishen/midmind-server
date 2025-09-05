import * as dotenv from 'dotenv';
dotenv.config();

import { DatabaseService } from '../db/db.service';
import { UserRepository } from '../api/user/user.repository';
import { UserService } from '../api/user/user.service';

export interface SeedContext {
  databaseService: DatabaseService;
  userRepository: UserRepository;
  userService: UserService;
}

export type SeedFunction = (context: SeedContext) => Promise<void>;

function createSeedContext(): SeedContext {
  const databaseService = new DatabaseService();
  const userRepository = new UserRepository(databaseService);
  const userService = new UserService(userRepository);

  return {
    databaseService,
    userRepository,
    userService,
  };
}

async function runSeeds() {
  const context = createSeedContext();

  // Dynamically import all seed functions
  const seedModules = [
    await import('./seeds/user.seed'),
    // Add more seed imports here as needed
  ];

  console.warn('Starting database seeding...');

  for (const module of seedModules) {
    if (module.default && typeof module.default === 'function') {
      try {
        await module.default(context);
      } catch (error) {
        console.error(`Error running seed ${module.default.name}:`, error);
        process.exit(1);
      }
    }
  }

  console.warn('All seeds completed successfully!');
}

void runSeeds();
