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
	async login(@Body() body: { username: string; password: string }) {
		return this.authService.login(body.username, body.password);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	async getMe(@Request() req: any) {
		return this.authService.getMe(req.user.sub);
	}
}
