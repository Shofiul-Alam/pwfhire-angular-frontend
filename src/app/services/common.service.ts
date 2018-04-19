import {Injectable} from '@angular/core';
import { ValidationService } from './formValidation.service';
import {Http, Response, Headers} from '@angular/http';


@Injectable()
export class CommonService {
  constructor(private dateConvert:ValidationService, private _http: Http){

  }

  sortInnerObject(data,obj:string,inner:string,prop:string,asc:boolean){ 
    this.iconColor();
    data.sort((a,b)=>{
      let nameA=(a[obj][inner][prop]).toLowerCase(), nameB=(b[obj][inner][prop]).toLowerCase();
      if(asc){
        if(isNaN(nameA)){
          if (nameA < nameB) return -1; 
          if (nameA > nameB) return 1;
          return 0 
        } else return parseInt(a[obj][inner][prop]) - parseInt(b[obj][inner][prop]);
      } else {
        if(isNaN(nameA)){
          if (nameA > nameB) return -1; 
          if (nameA < nameB) return 1;
          return 0 
        } else return parseInt(b[obj][inner][prop]) - parseInt(a[obj][inner][prop]);
      }
    });
  }



   sortAscendingUser(data,obj,prop){
    this.iconColor();
    data.sort((a,b)=>{
      let nameA=a[obj][prop].toLowerCase(), nameB=b[obj][prop].toLowerCase();
      if(isNaN(nameA)){
        if (nameA < nameB) //sort string ascending
          return -1 
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      } else {
        return parseInt(a[obj][prop]) - parseInt(b[obj][prop])
      }
    });
  }

  sortDescendingUser(data,obj,prop){
    this.iconColor();
    data.sort((a,b)=>{
      let nameA=a[obj][prop].toLowerCase(), nameB=b[obj][prop].toLowerCase();
      if(isNaN(nameA)){
        if (nameA > nameB) //sort string descending
          return -1 
        if (nameA < nameB)
          return 1
        return 0 //default return value (no sorting)
      } else {
        return parseInt(b[obj][prop]) - parseInt(a[obj][prop])
      }
    });
  }

  sortAscendingDate(data,propName){
    this.iconColor();
    let array = data
    let prop = propName;
    array.sort((a,b)=>{
      if (a[prop] != null && b[prop] != null) {
        let dateA = Number(new Date(a[prop].timestamp *1000));
        let dateB = Number(new Date(b[prop].timestamp *1000));
        return dateA - dateB; 
      }
      return 1;
    });
  }

  sortDescendingDate(data,propName){
    this.iconColor();
    let array = data
    let prop = propName;
    array.sort((a,b)=>{
      if (a[prop] != null && b[prop] != null) {
        let dateA = Number(new Date(a[prop].timestamp *1000));
        let dateB = Number(new Date(b[prop].timestamp *1000));
        return dateB - dateA; 
      }
      return 1;
    });
  }

  sortAscending(data,propName){
    this.iconColor();
    let array = data
    let prop = propName;
    array.sort((a,b)=>{
      if (a[prop] != null && b[prop] != null) {
        let nameA=a[prop].toLowerCase(), nameB=b[prop].toLowerCase();
        if(isNaN(nameA)){
          if (nameA < nameB) //sort string ascending
            return -1 
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        } else {
          return parseInt(a[prop]) - parseInt(b[prop])
        }
      } return 1;
    });
  }

  sortDescending(data,propName){
    this.iconColor();
    let array = data
    let prop = propName;
    array.sort((a,b)=>{
      if (a[prop] != null && b[prop] != null) {
        let nameA=a[prop].toLowerCase(), nameB=b[prop].toLowerCase();
        if(isNaN(nameA)){
          if (nameA > nameB) //sort string descending
            return -1 
          if (nameA < nameB)
            return 1
          return 0 //default return value (no sorting)
        } else {
          return parseInt(b[prop]) - parseInt(a[prop])
        }
      } return 1;
    });
  }

  //  ** for firebase data only*********

  sortingTimeOnly(data,prop:string,asc:boolean){
    this.iconColor();
    data.sort((a,b)=>{
        let x = new Date(1970,1,1,a[prop].hour,a[prop].minute);
        let y = new Date(1970,1,1,b[prop].hour,b[prop].minute);
        if(asc) return Date.parse(x.toLocaleString()) - Date.parse(y.toLocaleString())
        else return Date.parse(y.toLocaleString()) - Date.parse(x.toLocaleString())
    });
  }


  sortingDateOnly(data,prop:string,asc:boolean){
    this.iconColor();
    data.sort((a,b)=>{
      if (typeof a[prop] == 'object') {
        let x = new Date(a[prop].year , (a[prop].month-1) , a[prop].day);
        let y = new Date(b[prop].year , (b[prop].month-1) , b[prop].day);
        if(asc) return Date.parse(x.toLocaleString()) - Date.parse(y.toLocaleString())
        else return Date.parse(y.toLocaleString()) - Date.parse(x.toLocaleString())
      } else{
        if(asc) return Date.parse(a[prop]) - Date.parse(b[prop])
        else return Date.parse(b[prop]) - Date.parse(a[prop])
      }
    });
  }

  sortingNumberOnly(data,prop:string,asc:boolean){
    this.iconColor();
    data.sort((a,b)=>{
      if(asc) return a[prop] - b[prop]
      else return b[prop] - a[prop]
    });
  }

  private iconColor(){
    $('.up-down-angle div i').on('click', event => {
      $('.up-down-angle div i').removeClass('sorting-blue');
      let clickedElement = $(event.target);
      clickedElement.addClass('sorting-blue');
    });
  }



  getLocation(term: string):Promise<any> {
    let address = '';
    let  a = term.split(" ");
       address = a.join('+');
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCaa9lro2eKyLYyOhPyR_OhKp9cWrFQtE0`;
    // console.log(url);  
    return this._http.get(url)
         .toPromise()
         .then(response => Promise.resolve(response.json()))
         .catch( error => Promise.resolve(error.json()));
 }
 redrawMap(map,lat,lng) {
       map.triggerResize()
      .then(() => map._mapsWrapper.setCenter({lat: lat, lng: lng}));
  }

 floatLabel(){
        this.label();
        $('.floating-labels .form-control').on('focus blur', function(e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');

    }

    private label(){
        $('.form-group label').on('click', event => {
          let clickedElement = $(event.target);
          clickedElement.parents('.form-group').addClass('focused');
          clickedElement.parents('.form-group').find('.form-control').focus();
        });
     }
 
 getMultiSelectValue(con,prop){
    let induc = [];
    for(let i of con){
      induc.push(i[prop].id);             
    }
    return induc;
 }


 /* employee job/allocation sorting*/

 jobSorting(arr,asc:boolean){
    this.iconColor();
    arr.sort((a,b)=>{
      let nameA=(a.employeeAllocation.task.taskName).toLowerCase(), nameB=(b.employeeAllocation.task.taskName).toLowerCase();
      if(asc){
          if (nameA < nameB) return -1; 
          if (nameA > nameB) return 1;
          return 0 
      } else {
          if (nameA > nameB) return -1; 
          if (nameA < nameB) return 1;
          return 0 
      }
    });
 }

 clientSorting(arr,asc:boolean){
    this.iconColor();
    arr.sort((a,b)=>{
      let nameA=(a.employeeAllocation.task.order.project.client.companyName).toLowerCase(), nameB=(b.employeeAllocation.task.order.project.client.companyName).toLowerCase();
      if(asc){
          if (nameA < nameB) return -1; 
          if (nameA > nameB) return 1;
          return 0 
      } else {
          if (nameA > nameB) return -1; 
          if (nameA < nameB) return 1;
          return 0 
      }
    });
 }

 taskSorting(arr,asc:boolean){
    this.iconColor();
    arr.sort((a,b)=>{
      let nameA=(a.allocatedDates.employeeAllocation.task.taskName).toLowerCase(), nameB=(b.allocatedDates.employeeAllocation.task.taskName).toLowerCase();
      if(asc){
          if (nameA < nameB) return -1; 
          if (nameA > nameB) return 1;
          return 0 
      } else {
          if (nameA > nameB) return -1; 
          if (nameA < nameB) return 1;
          return 0 
      }
    });
 }

 timeClientSorting(arr,asc:boolean){
    this.iconColor();
    arr.sort((a,b)=>{
      let nameA=(a.allocatedDates.employeeAllocation.task.order.project.client.companyName).toLowerCase(), nameB=(b.allocatedDates.employeeAllocation.task.order.project.client.companyName).toLowerCase();
      if(asc){
          if (nameA < nameB) return -1; 
          if (nameA > nameB) return 1;
          return 0 
      } else {
          if (nameA > nameB) return -1; 
          if (nameA < nameB) return 1;
          return 0 
      }
    });
 }





}