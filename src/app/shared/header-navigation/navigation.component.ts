import { Component, AfterViewInit, OnInit  } from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {UserService} from '../../services/user.service';
import {ClientService} from '../../services/client.service';
import {AdminService} from '../../services/admin/admin.service';
import {GLOBAL} from '../../models/global';


@Component({
  selector: 'ap-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, AfterViewInit {
	  name:string;
  	showHide:boolean;
    private user;
    public userName: string ='';
    public userEmail: string = '';
    public userPic:string=null;
    role: string=JSON.parse(localStorage.getItem('identity')).role;
  
  	constructor(
          public _userService: UserService,
          private admin:AdminService,
          private client:ClientService,
          private employee: EmployeeService
      ) {
    	this.showHide = true;
  	}

  	ngOnInit(){
        if(this.role=='admin'){
            this.admin.user.subscribe(
              data => this.getUserData(data)
            );
           
            this.admin.getUser().subscribe(
                userData => this.getUserData(userData),
                error => console.log(<any> error)
            );
            
        } else if(this.role=='employee'){
            this.employee.user.subscribe(
              data => this.getUserData(data)
            );

            this.employee.getUser().subscribe(
                userData => this.getUserData(userData),
                error => console.log(<any> error)
            );

        } else if(this.role=='client'){
            this.client.user.subscribe(
              data => this.getUserData(data)
            );

            this.client.getUser().subscribe(
                userData => this.getUserData(userData),
                error => console.log(<any> error)
            );
            
        }
    }

    getUserData(userData){
       this.user = userData;
       // console.log(userData);
       if(this.role!='client') this.userName = this.user.user.firstName + ' ' + this.user.user.lastName;
       else this.userName = this.user.companyName;
       this.userEmail = this.user.user.email;
       if(this.user.user.userAvatar!=null)
         this.userPic = GLOBAL.url + this.user.user.userAvatar.path + '/' + this.user.user.userAvatar.fileName; 
       else this.userPic = null;
       // console.log(this.userPic);
    }


  	changeShowStatus(){
    	this.showHide = !this.showHide;
  	}
    
    ngAfterViewInit() {
        $(function () {
            $(".preloader").fadeOut();
        });

        var set = function () {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            var topOffset = 0;
            if (width < 1170) {
                $("body").addClass("mini-sidebar");
                $('.navbar-brand span').hide();
                $(".sidebartoggler i").addClass("ti-menu");
            } else {
                $("body").removeClass("mini-sidebar");
                $('.navbar-brand span').show();
            }

            var height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $(".page-wrapper").css("min-height", (height) + "px");
            }

        };
        $(window).ready(set);
        $(window).on("resize", set);

        $(document).on('click', '.mega-dropdown', function (e) {
            e.stopPropagation();
        });
        
        $(".search-box a, .search-box .app-search .srh-btn").on('click', function () {
            $(".app-search").toggle(200);
        });
        
        (<any>$('.scroll-sidebar, .right-sidebar, .message-center')).perfectScrollbar();

        $("body").trigger("resize");
    }

    reloadComponete(){

    }


}
