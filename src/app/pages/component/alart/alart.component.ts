import { Component, Input,Output,EventEmitter } from '@angular/core';



@Component({
  selector: 'alart',
  templateUrl: 'alart.component.html',
  styleUrls: ['alart.component.css']
})
export class AlartComponent  {
  @Input('code') code: number = 0 ;
  @Input('status') status: string = '' ;
 

  cancelPopUp() {
        this.code=0;
  }

}

