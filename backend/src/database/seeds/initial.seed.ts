import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Create users
  const users = await Promise.all(
    Array(5).fill(null).map(async (_, index) => {
      const user = new User();
      user.name = `User ${index + 1}`;
      user.email = `user${index + 1}@example.com`;
      user.password = await bcrypt.hash('password123', 10);
      user.role = index === 0 ? 'admin' : 'user';
      return userRepository.save(user);
    })
  );
} 

