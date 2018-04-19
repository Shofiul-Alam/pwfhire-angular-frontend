import { Component, OnInit, ElementRef } from '@angular/core';



@Component({
  selector: 'multi-file',
  templateUrl: 'multiFile.component.html',
  styleUrls: ['multiFile.component.css']
})
export class MultiFileComponent implements OnInit {

  filesToUpload: Array<any> = [];
  fileIdCounter= 0;
  domRemove = null;
  domHover = null;
  drop = null;
  
  constructor(private _rootNode: ElementRef){}

  ngOnInit() { 
    this.dragDropEffect();
  }

  dragDropEffect(){
      this.drop = $(this._rootNode.nativeElement).find("input#images");
      this.drop.on('dragenter', function (e) {
        $(".drop").addClass("dropHover");
        $('.drop').css('border-color', '#398bf7');
      }).on('dragleave dragend mouseout drop', function (e) {
        $(".drop").removeClass("dropHover");
        $('.drop').css('border-color', '#DADFE3');
      });

      $('.drop').hover(function(){
        $( this).addClass("dropHover");
      }, function(){
        $( this).removeClass("dropHover");
    });

  }
 
  inputFile(f){
    let total_file=f.target.files.length;
    let output = [];
    console.log(f.target.files);
    for (let i = 0; i < total_file; i++) {
      this.fileIdCounter++;
      let file = f.target.files[i];
      let fileId = 'image' + this.fileIdCounter;

      this.filesToUpload.push({
                id: fileId,
                file: file
            });
      console.log(this.filesToUpload);
      output.push(`
        <div class='col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xm-12 image-preview text-center'
          style = 'margin:16px; padding:10px; height:150px; border:1px solid; border-radius:10px;'>
          <div class="image-container" style="height:125px; max-width: 125px; margin:auto;">
            <img class='img-responsive image' width='100%' src='${URL.createObjectURL(file)}' 
            style="opacity: 1;transition: .5s ease;backface-visibility: hidden;">
            <div class="middle" style="transition: .5s ease;opacity: 0;position: absolute;top: 50%;
            left: 50%; width:80%;transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);">
              <div style="color:#343a40; font-weight:bold;cursor:default;">${file.name}</div>
              <div class="btn btn-sm btn-danger" id='removeFile' data-fileid='${fileId}' 
              style=" margin:5px;cursor: pointer;">Remove</div>
            </div>
          </div>
          
        </div>`);
    }
    //reset the input to null
    f.target.value = null;
    $('#image_preview').append(output);
    this.removeFile();
  }

  clear() {
      let f= this.filesToUpload;
      console.log(f); 
        for (let i = 0; i < f.length ; i) {
           if(f.length == 0) break;
            f.splice(i, 1);
        }

       this.filesToUpload = f;
        console.log(this.filesToUpload);
        $('.image-preview').remove();
  }

  removeFile(){
    this.domRemove= $(this._rootNode.nativeElement).find("div#removeFile");
    this.domHover= $(this._rootNode.nativeElement).find("div.image-container");

    let data = this.filesToUpload;
    $(this.domRemove).click(function(){
      let id = $(this).data("fileid");
      console.log(id);
      for (var i = 0; i < data.length; ++i) {
        if (data[i].id === id)
            data.splice(i, 1);
      }
       $(this).closest('.image-preview').remove();
       this.filesToUpload = data;
    });

    
    $(this.domHover).hover(function(){
      $( this).find(".image").css("opacity", "0.2");
      $( this).find(".middle").css("opacity", "1");
      }, function(){
      $( this).find(".image").css("opacity", "1");
      $( this).find(".middle").css("opacity", "0");
    });
  }

  uploadFile () {
        let formData = new FormData();
        console.log(this.filesToUpload);
        for (var i = 0, len = this.filesToUpload.length; i < len; i++) {
            formData.append("files", this.filesToUpload[i].file);
        }

  }

}

