import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Client } from './../../models/client';
import { UserType } from './../../models/UserType';
import { ValidationService } from './../../services/formValidation.service';
import { ClientService } from './../../services/client.service';

@Component({
    selector: 'client-signup',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, AfterViewInit{

    public title: string;
    // public client: Client;
    public client: Client;
    public status;
    public checkPass:string = '';
    public checkboxTerm: boolean = false;
    code;
    loader: boolean = false;

    constructor(
        public validationForm: ValidationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _clientService: ClientService
    ){
        this.title = "Register";
        var userType = new UserType(0, "client");
        this.client = new Client();
        this.client.user.userType = userType;
    }


    ngAfterViewInit() {
        $(function() {
            $(".preloader").fadeOut();
        });
    }

    ngOnInit() {
        this.validationForm.floatLabel();
    }


    onSubmit() {
        // console.log(this.client);
        this.loader = true;
        this._clientService.register(this.client).subscribe(
            response => {
                this.code = response.code;
                // console.log(response);
                if(response.code != 200) {
                    this.status = response.msg;
                    this.loader = false;
                    setTimeout(()=>{this.code = 0},10000);
                } else{
                    this.loader = false;
                }
            },
            error => {
                console.log(<any> error);
                this.loader = false;
            }
        );
    }

    cancelPopUp(){
        this.code = 0;
    }



}
