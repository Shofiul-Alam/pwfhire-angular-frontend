import { Component } from '@angular/core';


@Component({
  selector: 'profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent {

    public role:string = '';
    constructor(){
      this.role = JSON.parse(localStorage.getItem('identity')).role;        
  }

}