import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../services/user.service';
import {ValidationService} from '../services/formValidation.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [UserService]
})
export class LoginComponent implements OnInit, AfterViewInit {

    public title: string;
    public user;
    public identity;
    public token;
    loader: boolean = false;
    code;
    message;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _userService: UserService,
                private floating: ValidationService
    ) {

        this.user = {
            "email" : "",
            "password" :"",
            "getHash" : "true"
        }
    }

    ngOnInit() {
        this.floating.floatLabel();
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

    onSubmit(f) {
        this.loader = true;
        // console.log(this.user);
        this._userService.signIn(this.user).subscribe(
            response => {
                this.identity = response;
                this.code = response.code;
                if (this.code!==200) {
                    this.loader = false;
                    this.message = response.msg
                    setTimeout(()=>{this.code = 0},5000);
                }
                if(this.identity.staus == 'error') {
                    this.code = 300;
                } {
                    if(!this.identity.status) {
                        localStorage.setItem('identity', JSON.stringify(this.identity));
                        this.loader = false;
                        this.user.getHash = null;
                        this._userService.signIn(this.user).subscribe(
                            response => {
                                this.token = response;
                                if (this.identity.staus == 'error') {
                                    this.code = 300;
                                    console.log('Error login');
                                    setTimeout(()=>{this.code = 0},5000);
                                }
                                {   
                                    // console.log(this.identity)
                                    if (!this.identity.staus) {
                                        this.code = 200; 
                                        // console.log(this.identity);
                                        localStorage.setItem('token', JSON.stringify(this.token));
                                        let returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
                                        if(this.identity.role=='employee') this._router.navigate([returnUrl || '/new-pending-job']);
                                        else this._router.navigate([returnUrl || '/dashboard']);
                                    }
                                }
                            },
                            error => {
                                console.log(<any> error);
                                this.loader = false;
                            }

                        );
                    }
                }
            });
    }

    cancelPopUp(){
        this.code = 0
    }

}
