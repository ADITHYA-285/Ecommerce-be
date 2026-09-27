import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // REGISTER
  // =========================

  async register(registerDto: RegisterDto) {

    const {
      name,
      email,
      password,
    } = registerDto;

    const existingUser =
      await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await this.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
        },
      });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }


  // =========================
  // LOGIN
  // =========================

  async login(loginDto: LoginDto) {

    const {
      email,
      password,
    } = loginDto;

    // Find user
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Check password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Create JWT
    const token =
      await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

    return {
      message: 'Login successful',

      access_token: token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}