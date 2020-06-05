import { IsString, MinLength } from 'class-validator';

export class LoginSignupDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class MessageStatusDto {
  readonly message: string;
  readonly success: boolean;
}

export class UserDataDto {
  readonly login: string;
  readonly token: string;
}

export class LoginSignupResponseDto extends MessageStatusDto {
  readonly user: UserDataDto | null;
}
