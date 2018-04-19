import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import {NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [NgbDatepickerConfig]
})
export class SignupComponent implements OnInit, AfterViewInit {

    public status='';
    public emp: boolean = true ;
    public cli: boolean = false;

    client(){
        this.cli = true;
        this.emp = false;
    }
    employee(){
       this.emp = true;
        this.cli = false;
    }

    constructor(
        config: NgbDatepickerConfig
    ){
        config.minDate = {year: 1950, month: 1, day: 1};
        config.maxDate = {year: 2099, month: 12, day: 31};
    }


    ngAfterViewInit() {
        $(function() {
            $(".preloader").fadeOut();
        });
        $(function() {
            (<any>$('[data-toggle="tooltip"]')).tooltip()
        });
        $('#to-recover').on("click", function() {
            $("#loginform").slideUp();
            $("#recoverform").fadeIn();
        });
    }

    ngOnInit() {
        // console.log('Hi this is Register component here!!!!');
    }

}
