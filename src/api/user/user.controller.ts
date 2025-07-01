import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UserDto, CreateUserDto } from './dto/user.dto';
import { PaginatedResult, PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { IgnoreAuthGuard, JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-pagination-response.decorator';
import { UserService } from './user.service';

@ApiTags('Public Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user from public schema' })
  @Get('/current')
  getCurrentPublicUser(@GetUser('sub') userId: string): Promise<UserDto> {
    return this.userService.getUser(userId);
  }

  @ApiOperation({ summary: 'Update current user in public schema' })
  @Put('/current')
  updateCurrentPublicUser(@GetUser('sub') userId: string, @Body() data: UpdateUserDto): Promise<MessageDto> {
    return this.userService.updateUser(userId, data);
  }

  @ApiOperation({ summary: 'Delete current user from public schema' })
  @Delete('/current')
  deleteCurrentPublicUser(@GetUser('sub') userId: string): Promise<MessageDto> {
    return this.userService.deletePublicUser(userId);
  }

  @ApiOperation({ summary: 'Create a user in public schema' })
  @IgnoreAuthGuard()
  @Post()
  createPublicUser(@Body() data: CreateUserDto): Promise<UserDto> {
    return this.userService.createUser(data);
  }

  @ApiOperation({ summary: 'Get all users from public schema' })
  @ApiPaginatedResponse(UserDto)
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @Get()
  getAllPublicUsers(@Query() pagination: PaginationDto): Promise<PaginatedResult<UserDto>> {
    return this.userService.getAllUsers(pagination);
  }

  @ApiOperation({ summary: 'Get a user by id from public schema' })
  @Get('/:id')
  getPublicUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @ApiOperation({ summary: 'Update user information in public schema' })
  @Put('/:id')
  updatePublicUser(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<MessageDto> {
    return this.userService.updateUser(id, data);
  }

  @ApiOperation({ summary: 'Delete a user from public schema' })
  @Delete('/:id')
  deletePublicUser(@Param('id') id: string): Promise<MessageDto> {
    return this.userService.deletePublicUser(id);
  }
}
