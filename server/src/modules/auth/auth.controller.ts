import { Controller, Res, Get, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginSignupDto, LoginSignupResponseDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async userSignup(@Res() res, @Body() body: LoginSignupDto): Promise<LoginSignupResponseDto> {
    const data = await this.authService.handleSignup(body);
    return res.send(data);
  }

  @Post('login')
  async userLogin(@Res() res, @Body() body: LoginSignupDto): Promise<LoginSignupResponseDto> {
    const data = await this.authService.handleLogin(body);
    return res.send(data);
  }
}
