import { CanActivate, ExecutionContext } from '@nestjs/common';

export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    // return
    return request.currentUser.superAdmin;
  }
}
