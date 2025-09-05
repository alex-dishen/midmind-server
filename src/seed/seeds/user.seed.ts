import { CreateUserDto } from '../../api/user/dto/user.dto';
import { SeedContext } from '../index';

export default async function seedUsers(context: SeedContext): Promise<void> {
  const { userRepository, userService } = context;

  const defaultUser: CreateUserDto = {
    first_name: 'Name',
    last_name: 'Surname',
    email: 'test@test.com',
    password: 'password123',
    confirmation_password: 'password123',
    avatar: undefined,
  };

  const existingUser = await userRepository.getUserBy({
    email: defaultUser.email,
  });

  if (existingUser) {
    console.warn(`User with email ${defaultUser.email} already exists. Skipping seed.`);

    return;
  }

  const createdUser = await userService.createUser(defaultUser);
  console.error(`User seeded successfully: ${createdUser.email} (ID: ${createdUser.id})`);
}
