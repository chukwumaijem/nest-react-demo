import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

import { LoginSignupDto, LoginSignupResponseDto } from './auth.dto';
import { Auth } from './schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
    private readonly configService: ConfigService,
  ) {}

  private reponseHandler(
    message: string,
    success: boolean,
    user = null,
  ): LoginSignupResponseDto {
    return {
      message,
      success,
      user,
    };
  }

  private generateToken(login: string, id: string): string {
    return sign({ login, id }, this.configService.get('authSecret'), {
      expiresIn: '7d',
    });
  }

  private verifyPassword(received: string, saved: string): boolean {
    return compareSync(received, saved);
  }

  async handleSignup(signupDto: LoginSignupDto) {
    try {
      const user = new this.authModel(signupDto);
      await user.save();

      const data = {
        login: user.login,
        token: this.generateToken(user.login, user.id),
      };

      return this.reponseHandler('Account created.', true, data);
    } catch (error) {
      return this.reponseHandler(`Signup Failed: ${error.message}`, false);
    }
  }

  async handleLogin({ login, password}: LoginSignupDto) {
    try {
      const user = await this.authModel.findOne({ login });
      if (!user || !this.verifyPassword(password, user.password)) {
        return this.reponseHandler('Login Failed.', false);
      }

      const data = {
        login: user.login,
        token: this.generateToken(user.login, user.id),
      };

      return this.reponseHandler('Login Succeeded', true, data);
    } catch (error) {
      return this.reponseHandler(`Login Failed: ${error.message}`, false);
    }
  }
}
