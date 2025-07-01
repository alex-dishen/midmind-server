import { hash } from 'argon2';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await hash(data.password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmation_password, ...updatedData } = { ...data, password: hashedPassword };

    return this.userRepository.createUser(updatedData);
  }

  async getUser(userId: string): Promise<UserDto> {
    return this.userRepository.getUserBy({ id: userId });
  }

  async getAllUsers({ skip, take }: PaginationDto): Promise<PaginatedResult<UserDto>> {
    return this.userRepository.getUsersAll({ take, skip });
  }

  async updateUser(userId: string, data: Partial<UpdateUserDto>): Promise<MessageDto> {
    let dataToUpdate = data;

    if (data.password) {
      const hashedPassword = await hash(data.password);
      dataToUpdate = { ...data, password: hashedPassword };
    }

    await this.userRepository.updateUser(userId, dataToUpdate);

    return { message: 'Successfully updated a user' };
  }

  async deletePublicUser(userId: string): Promise<MessageDto> {
    await this.userRepository.deleteUser(userId);

    return { message: 'Successfully deleted a user' };
  }
}
