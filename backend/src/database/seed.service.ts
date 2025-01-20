import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Check if users already exist
    const existingUsers = await this.userRepository.find();
    if (existingUsers.length > 0) {
      console.log('Database already seeded');
      return;
    }

    // Create users if none exist
    await Promise.all(
      Array(5).fill(null).map(async (_, index) => {
        const user = this.userRepository.create({
          name: `User ${index + 1}`,
          email: `user${index + 1}@example.com`,
          password: await bcrypt.hash('password123', 10),
          role: index === 0 ? 'admin' : 'user',
          login_count: Math.floor(Math.random() * 10),
          pdf_download_count: Math.floor(Math.random() * 5),
          last_activity_at: new Date()
        });
        return this.userRepository.save(user);
      })
    );
    console.log('Seed completed');
  }
} 