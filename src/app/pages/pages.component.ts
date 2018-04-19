import { Component, OnInit, AfterViewInit } from '@angular/core';
import {  Router, Event, NavigationStart} from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PageComponent implements OnInit, AfterViewInit {
    url;
    role: string=JSON.parse(localStorage.getItem('identity')).role;
    constructor(public router: Router) { }

    ngOnInit() {
        if (this.router.url === '/') {
            if(this.role=='employee') this.router.navigate(['/new-pending-job']);
            else this.router.navigate(['/dashboard']);
        }

        this.router.events.subscribe((event : Event) => {
            if(event instanceof NavigationStart) {
                this.url = event.url;
                this.tabSidebarColor(this.url);    
            }
        });
        
        
    }

    ngAfterViewInit() {
        $(function() {
            $(".preloader").fadeOut();
        });

        this.url = this.router.url;
        this.tabSidebarColor(this.url);
    }

    tabSidebarColor(url){
        if(url=='/emp-induction-list') $('ul#sidebarnav li.emp-dash a').children().addClass('tab-active');
        if(url=='/accepted-job') $('ul#sidebarnav li.emp-job a').children().addClass('tab-active');
    }

}
