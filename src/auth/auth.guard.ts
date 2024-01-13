import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { authorization } = request.headers
    if (!authorization) throw new UnauthorizedException('Authorization Token Required')
    const user = await this.authService.validateToken(authorization)
    if (!user.isAdmin) throw new UnauthorizedException('Access denied: User Must Be Admin')
    return true;
  }
}
