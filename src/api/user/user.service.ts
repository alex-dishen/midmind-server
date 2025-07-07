import { hash } from 'argon2';
import { Injectable } from '@nestjs/common';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { UserRepository } from 'src/api/user/user.repository';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { CreateUserDto, UpdateUserDto, UserDto } from 'src/api/user/dto/user.dto';

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

    return { message: 'Successfully updated the user' };
  }

  async deleteUser(userId: string): Promise<MessageDto> {
    await this.userRepository.deleteUser(userId);

    return { message: 'Successfully deleted the user' };
  }
}
