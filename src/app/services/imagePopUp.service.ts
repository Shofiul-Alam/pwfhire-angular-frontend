import {Injectable} from '@angular/core';


@Injectable()
export class ImagePopUpService {

   private rotate = 0;

    imagePreview(src){
            $("img.imgpreview").attr('src', src);
            this.rotate = 0;
            // console.log(src, this.rotate );
            this.rotatiom();
    }

    leftRotation(){
            this.rotate -= 90;
            this.rotatiom();
        ((this.rotate/90) == -1 || (this.rotate/90) == -3)? $('img.imgpreview').css('width','75%'):$('img.imgpreview').css('width','auto');
    }

    RightRotation(){
            this.rotate += 90;
            this.rotatiom();
        ((this.rotate/90) == 1 || (this.rotate/90) == 3)? $('img.imgpreview').css('width','75%'):$('img.imgpreview').css('width','auto');
    }

    rotatiom(){
        $('img.imgpreview').css({'-webkit-transform' : 'rotate('+ this.rotate +'deg)',
            '-moz-transform' : 'rotate('+ this.rotate +'deg)',
            '-ms-transform' : 'rotate('+ this.rotate +'deg)',
            'transform' : 'rotate('+ this.rotate +'deg)'});
    }

}