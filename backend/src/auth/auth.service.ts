import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService
	) {}

	async login(email: string, password: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new UnauthorizedException('Invalid credentials');
		}
		const payload = { sub: user.id, username: user.username };
		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				fullname: user.fullname,
			},
			token: this.jwtService.sign(payload),
		};
	}

	async register(email: string, password: string, fullname: string) {
		// Проверяем, существует ли пользователь с таким email
		const existingUser = await this.prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			throw new UnauthorizedException('User with this email already exists');
		}

		// Хешируем пароль
		const hashedPassword = await bcrypt.hash(password, 10);

		// Создаем пользователя
		const user = await this.prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				fullname,
				username: email, // Используем email как username
			},
		});

		const payload = { sub: user.id, username: user.username };
		return {
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				fullname: user.fullname,
			},
			token: this.jwtService.sign(payload),
		};
	}

	async getMe(userId: string) {
		return this.prisma.user.findUnique({ where: { id: userId } });
	}
}
