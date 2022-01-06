import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OnlyWalletInstalledGuard implements CanActivate {
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if ((this.document.defaultView as any).ethereum) {
      return true;
    } else {
      return this.router.createUrlTree(['/wallet-required']);
    }
  }
}
