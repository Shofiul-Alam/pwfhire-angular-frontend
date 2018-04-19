import { Injectable } from '@angular/core';
import {Router, CanActivateChild} from '@angular/router';


@Injectable()
export class ClientGuard implements CanActivateChild {

    constructor(private router: Router) { }

    canActivateChild() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        
        if(identity.role == 'client' || identity.role == 'admin')  return true;
            
        this.router.navigate(['/404']);
        return false;
    }

}
