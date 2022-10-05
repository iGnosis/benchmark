import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  CanActivate,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt/jwt.service';

@Injectable()
export class PrivateGuard implements CanActivateChild, CanActivate {
  constructor(private router: Router, private jwtService: JwtService) {}

  handleActivate() {
    if (this.jwtService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/public/login']);
      return false;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handleActivate();
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any {
    return this.handleActivate();
  }
}
