import { UserService } from 'src/api/user/user.service';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { UpdateUserDto, UserDto } from 'src/api/user/dto/user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @Get('/current')
  getCurrentUser(@GetUser('sub') userId: string): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @ApiOperation({ summary: 'Update current user' })
  @Put('/current')
  updateCurrentUser(@GetUser('sub') userId: string, @Body() data: UpdateUserDto): Promise<MessageDto> {
    return this.userService.updateUser(userId, data);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @Delete('/current')
  deleteCurrentUser(@GetUser('sub') userId: string): Promise<MessageDto> {
    return this.userService.deleteUser(userId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiPaginatedResponse(UserDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get()
  getAllUsers(@Query() pagination: PaginationDto): Promise<PaginatedResult<UserDto>> {
    return this.userService.getAllUsers(pagination);
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @ApiOperation({ summary: 'Update user information' })
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<MessageDto> {
    return this.userService.updateUser(id, data);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Promise<MessageDto> {
    return this.userService.deleteUser(id);
  }
}
