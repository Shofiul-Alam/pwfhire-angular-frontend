import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) {
        let identity = JSON.parse(localStorage.getItem('identity'));
        let token = JSON.parse(localStorage.getItem('token'));

        if(identity != null && token != null) {
            if ((token.staus!== 'error' && identity.staus!== 'error')) {
                return true;
            }
        }


        this.router.navigate(['/login'], {queryParams: {returnUrl:state.url}});
        return false;
    }

}
