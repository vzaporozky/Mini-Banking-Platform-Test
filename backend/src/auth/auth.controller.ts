import {
	Controller,
	Post,
	Body,
	Get,
	UseGuards,
	Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() body: { email: string; password: string }) {
		return this.authService.login(body.email, body.password);
	}

	@Post('register')
	async register(
		@Body() body: { email: string; password: string; fullname: string }
	) {
		return this.authService.register(body.email, body.password, body.fullname);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@Request() req: any) {
		return this.authService.getMe(req.user.sub);
	}
}
