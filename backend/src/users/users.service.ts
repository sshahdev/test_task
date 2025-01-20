import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
        login_count: createUserDto.login_count || 0,
        pdf_download_count: createUserDto.pdf_download_count || 0,
        last_activity_at: new Date(),
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update the user properties
    Object.assign(user, {
      ...updateUserDto,
      last_activity_at: new Date(),
    });

    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async incrementPdfDownloadCount(userId: number) {
    return this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        pdf_download_count: () => 'pdf_download_count + 1',
        last_activity_at: new Date()
      })
      .where('id = :id', { id: userId })
      .execute();
  }

  async getActivityLogs(userId: number) {
    const user = await this.findOne(userId);
    
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      activities: {
        total_logins: user.login_count,
        total_downloads: user.pdf_download_count,
        last_activity: user.last_activity_at,
      }
    };
  }
}