import { Component, AfterViewInit} from '@angular/core';


@Component({
  selector: 'ap-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
    role: string=JSON.parse(localStorage.getItem('identity')).role;
    
    ngAfterViewInit() {

        $(function () { 
            var url = window.location.toString();
            var element = $('ul#sidebarnav li a').filter(function () {
                let a = <HTMLAnchorElement>this;
                return (a.href == url ? true : false);
            }).addClass('active').parent().addClass('active');
            while (true) {
                if (element.is('li')) {
                    element.parent().prev().addClass('arrow-down');
                    element.parent().addClass('show');
                    element.parent().slideDown(500);
                    element = element.parent().addClass('in').parent().addClass('active');
                }
                else {
                    break;
                }
            }
            // (<any>$('#sidebarnav')).metisMenu();
        });

        $('.has-arrow').click(function(e) {
            e.preventDefault();

            $('.has-arrow').removeClass('li-active'); 
            let $this = $(this);

            if ($this.next().hasClass('show')) {
                $('.has-arrow').removeClass('arrow-down');
                $this.next().removeClass('show');
                $this.next().slideUp(500);
            } else {
                $('.has-arrow').removeClass('arrow-down'); 
                $this.addClass('li-active');  
                $this.parent().parent().find('li .inner').removeClass('show');
                $this.parent().parent().find('li .inner').slideUp(500);
                $this.addClass('arrow-down');
                $this.next().toggleClass('show');
                $this.next().slideToggle(500);
            }
        });



        $('ul#sidebarnav li').click(()=>{
            $('ul#sidebarnav li a').removeClass('active').parent().removeClass('active');
            $('ul#sidebarnav li.emp-dash a').children().removeClass('tab-active');
            $('ul#sidebarnav li.emp-job a').children().removeClass('tab-active');
        });
   
    }
}


            // "../node_modules/metismenu/dist/metisMenu.min.js",