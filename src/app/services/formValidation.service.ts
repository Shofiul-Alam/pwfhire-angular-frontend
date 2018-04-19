import {Injectable} from '@angular/core';
import {CustomDate} from '../models/customDate';
import {CustomTime} from "../models/customTime";
import {SMS} from "../models/sms";


@Injectable()
export class ValidationService {
    isReallyNumber(data) { 
        if (isNaN(data)) return true;
        else return false;
    }
    checkPassword(x,y) {
        if (x!=y) return true;
        else return false;
    }

    checkDateForOrder(start,end){
        let a = start.year + "-"+start.month+"-"+start.day;
        let firstDate = new Date(a).getTime();
        let b = end.year + "-"+end.month+"-"+end.day;
        let lastDate = new Date(b).getTime();
        if (firstDate<lastDate) return false;
        return true;
    }

    isValidDate(dateString) {
        if(dateString.year != 0 && dateString.month != 0 && dateString.day != 0){

            let regEx = /^\d{4}-\d{2}-\d{2}$/;
            if(!dateString.match(regEx)) {
                return true;
            }  // Invalid format
            return false;
        } else return;
    }

    convertDate(UNIX_timestamp) {
            var a = new Date(UNIX_timestamp * 1000);
            var year = a.getFullYear();
            var month = a.getMonth()+1;
            var day = a.getDate();
            var date = new CustomDate(year, month, day);
            return date;
    }
    convertTime(UNIX_timestamp) {
        var a = new Date(UNIX_timestamp.timestamp * 1000);
        var hour = a.getHours();
        var minute = a.getMinutes();
        var second = a.getSeconds();
        var time = new CustomTime(hour, minute, second);
        return time;
    }
    convertToCustomDate(data) {
        let date = new CustomDate();
        if(data!=null){
            if(data.hasOwnProperty('timestamp')){
                return this.dateConversion(data);
            } return data;
        } return  date
    }
    convertToCustomTime(data) {
        let date = new CustomTime();
        if(data!=null){
            if(data.hasOwnProperty('timestamp')){
                return this.convertTime(data);
            } return data;
        } return  date
    }
    dateShow(data){
        let newDate = new CustomDate();
        if(data != null){
            if(data.hasOwnProperty('timestamp')){
                newDate = this.dateConversion(data);
                let date = ((newDate.day.toLocaleString()).length==1? ('0'+newDate.day):newDate.day) +"-"
                    + ((newDate.month.toLocaleString()).length==1? ('0'+newDate.month):newDate.month)+"-"+newDate.year;
                return date;
            }else {
                let date = ((data.day.toLocaleString()).length==1? ('0'+data.day):data.day) +"-"
                + ((data.month.toLocaleString()).length==1? ('0'+data.month):data.month)+"-"+data.year;
                return date;
            }
        }
        return '';
    }

    timeShow(data) {
        let time = new CustomTime();
        if(data != null){
            if(data.hasOwnProperty('timestamp')){
                time = this.convertTime(data);
                let date = ((time.hour.toLocaleString()).length==1? ('0'+time.hour):time.hour) +":"
                    + ((time.minute.toLocaleString()).length==1? ('0'+time.minute):time.minute)+":"
                    + ((time.seconds.toLocaleString()).length==1? ('0'+time.seconds):time.seconds);
                return date;
            }else {
                  data = this.timeconvertion(data);
                  let date = ((data['hour'].toLocaleString()).length==1? ('0'+data['hour']):data['hour']) +":"
                  + ((data['minute'].toLocaleString()).length==1? ('0'+data['minute']):data['minute'])+":"
                  + ((data['seconds'].toLocaleString()).length==1? ('0'+data['seconds']):data['seconds']);
                  return date;
            }
        }
        return '';
    }

    timeconvertion(data){
      let a = new Date(1970,0,1,data['hour'],data['minute']);
      var hour = a.getHours();
        var minute = a.getMinutes();
        var second = a.getSeconds();
        var time = new CustomTime(hour, minute, second);
        return time;
    }

    dateConversion(data){
        let a = new Date(data.timestamp * 1000);
        let year = a.getFullYear();
        let month = a.getMonth()+1;
        let day = a.getDate();
        let date = new CustomDate(year, month, day);
        return date;
    }

    getDates( d1, d2 ):Array<CustomDate>{
        let d:Array<CustomDate>=[];
        let ms=d1.timestamp*1000;
        let last=d2.timestamp*1000;
        for (ms;ms<=last;ms+=86400000){
          let a = new Date(ms), year = a.getFullYear(), month = a.getMonth()+1, day = a.getDate();
          let date = new CustomDate(year, month, day);
          d.push(date);
        }
        return d;
    }

    getWeekDay(date){
        let a = date.year + "-"+date.month+"-"+date.day;
        let d = new Date(a);
        let weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        return weekday[d.getDay()];
    }

    picIcon(data){
        return data.substr( data.lastIndexOf('.') + 1 );
    }
    docName(data){
        return data.substring(0, data.lastIndexOf('.') );
    }

    checkPdf(a){
        let x;
        if(a){
            if(a.indexOf("/")==-1) x = this.picIcon(a);
            else {
                let n = a.indexOf("/");
                x = this.picIcon(a.slice(n+1));
            }
            if(x=='pdf') return 1;
            return 0;
        }
    }

    hasExpiryData(data){
        if(data.timestamp != null || data.timestamp != '') return false;
        return true;
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

     errorStatus(error,extra){
        extra.loader = false;
        extra.code = error.status;
        extra.status = error.statusText;
        setTimeout(()=>{extra.code = 0},3000);
      }

    successRes(response,f,extra){
      extra.loader = false;
      extra.status = response.msg;
      setTimeout(()=>{
        extra.code = 0;
        f.form.reset();
      },2000);
    }

    getResponce(response,extra){
      extra.status = response.msg;
      extra.loader = false;
      setTimeout(()=>{
        extra.code = 0;
      },2000);
    }

    colorContact(i){
        return {'btn-primary':i==0||i==5||i==10||i==15||i==20||i==25,
                'btn-warning':i==1||i==6||i==11||i==16||i==21||i==26,
                'btn-inverse':i==2||i==7||i==12||i==17||i==22||i==27,
                'btn-info':i==3||i==8||i==13||i==18||i==23||i==28,
                'btn-danger':i==4||i==9||i==14||i==19||i==24||i==29,
                'btn-default': i>30 
            }
    }

    openModalScroll(add,addContact){
        $(add).addClass('openModal');
        $(addContact).removeClass('openModal');
    }
    contactModalScroll(add){
       $(add).addClass('openModal');
    }

    validContactbutton(){
        if(!sessionStorage.getItem('conAddress')) return true;
        return false;
    }

    validAddbutton(){
        if(!sessionStorage.getItem('address')) return true;
        return false;
    }

    checkRattingRang(num){
        if(!isNaN(num)){
            let x = parseInt(num);
            if(x>0 && x<6) return false;
            return true;
        } return false;
    }

    removeDot(id){
       if(id!=null) return id.replace(/\./g,'');
    }

    getSMSIndex(sms,id){
        for(let s=0; s<sms.length;s++){
            if(sms[s].empId==id) return s;
        }
    }

    showSMS(task){
       return `Hi *****, you have a work from "${task.order.project.client.companyName}" at "${task.order.project.projectAddress}", to perform "${task.taskName}", during the following dates
       [Date, Starting time, Ending Time]`;
          
    }

    createSMSObject(employee,allocatedDates,smsline,task){
        let sms = new SMS();
        sms.line = smsline.line;
        sms.empId = employee.id;
        sms.empName = employee.user.firstName + " " + employee.user.lastName;
        let d = this.smsDates(allocatedDates,task);
        sms.dates.push(d);
        return sms;
      }

      smsDates(allocatedDates,task){
        let smsDates = '';
        if(allocatedDates.id==0){
          smsDates = this.dateShow(allocatedDates.date) + "("+allocatedDates.day+") from " +
                this.timeShow(task.startTime) + " to "+
                this.timeShow(task.endTime);
        }
        return smsDates;
      }

      checkSMSDate(date){
          let a = date.indexOf('(');
          let b = (date.slice(0,a)).trim();
          let d = b.split("-");
          return d[2]+'-'+d[1]+'-'+d[0];
      }

      makeSMS(sms){
        let dates = '';
        let filterDate = sms.dates.filter((n)=> {
            if(n!=="")
                return true;
        });
        // console.log(filterDate)
        let smsDates = this.sortingSMSDates(filterDate);
        // console.log(smsDates)
        for(let s of smsDates){
          dates+= s + "\n";
        }
        return 'Hi "'+ sms.empName+'", '+ sms.line+ "\n" + dates;
      }

      sortingSMSDates(dates){
          dates.sort((a,b)=>{
              let dateA=this.checkSMSDate(a), dateB=this.checkSMSDate(b);
              // console.log(dateA,dateB)
              let fDate = new Date(dateA).getTime();
              let lDate = new Date(dateB).getTime();
              if (fDate < lDate)
                return -1 
              if (fDate > lDate)
                return 1
              return 0 
          });
          return dates;
      }

     checkExpiryDate(d){
        let now = new Date().getTime();
        let date;
        if(d.hasOwnProperty('timestamp')) date=d.timestamp*1000;
           else date = this.toTimestamp(d) * 1000;
        
        let beforeExpiry=now + (3*86400000);

        if(date < now){
            return 'expired';
        } else if(date >=now && date <= beforeExpiry){
            return 'expiring';
        }   
        return null;
     }

     expiringDocList(arr,expired:boolean){
         let list = [];
         for(let data of arr){
             if(data.hasOwnProperty('skillId')){
                 let ch = this.checkExpiryDate(data.expiryDate);
                 if(expired && ch=='expired'){
                     list.push(data);
                 } else if(!expired && ch=='expiring'){
                     list.push(data);
                 }
             }
         }
         return list;
     }

     toTimestamp(date){
        if(date!=null){
            let a = date.year +'-'+date.month+'-'+date.day;
            let datum = Date.parse(a);
            return datum/1000;
        } return null;
    }

    convertHourMin(data){
      let time = new CustomTime();
      if(data&&data!=''){
          if(data.includes('hour')){
            let a = data.indexOf('hours');
            let b = data.indexOf('mins');
            time.hour = data.slice(0,a).trim();
            time.minute = data.slice(a+5,b).trim();
          } else {
            time.hour = data;
          }
      }
      return time;
    }

    convertToHour(data){
      let time = data.hour + (data.hour>2?' hours':' hour') + ' ' + data.minute + (data.minute>2?' mins':' min');
       return time;
    }

   formatTime(a){
      let time = this.convertToCustomTime(a);
      let t = '1970-01-01 ' + time.hour +':'+ time.minute;
      return new Date(t);
    }

    getTimeDifferenc(a,b){
      let time = new CustomTime();
      let t1 = this.formatTime(a), t2 = this.formatTime(b);
      let diff =(t2.getTime() - t1.getTime()) / 60000;
      let d = Math.abs(diff)/60;
      time.hour = parseInt(d.toString().split(".")[0]);
      time.minute = Math.abs(diff)%60;
      return time;
    }

    checkWeekend(d){
      let arr = ['SATURDAY','SUNDAY'];
      let day = d.trim().toUpperCase();
      if(arr.includes(day)) return d;
      return 'No'
    }

    checkWeekday(d){
      let arr = ['SATURDAY','SUNDAY'];
      let day = d.trim().toUpperCase();
      if(arr.includes(day)) return 'No';
      return d;
    }

    checkday(d,b){
      if(d){
        let a = this.convertToCustomDate(d);
        let getDay = this.getWeekDay(a);
        if(b) return this.checkWeekday(getDay);
        return this.checkWeekend(getDay);
      }
    }


    getDefferenc(a,b){
      let t1 = this.formatTime(a), t2 = this.formatTime(b);
      let diff =(t2.getTime() - t1.getTime()) / 60000;
      return Math.abs(diff)/60;
    }

    checkOverTime(time){
      if(time && time.hour>18) {
        let h = time.hour-18;
        let m =time.minute? time.minute:0;
        return h + (h<2?" hour ":" hours ") + m + (m<2? ' min ':' mins ');
      } 
      return 'No overtime';
    }

    getDateRange( d1, d2 ):Array<CustomDate>{
        let d:Array<CustomDate>=[];
        let ms=new Date(d1).getTime();
        let last=new Date(d2).getTime();
        for (ms;ms<=last;ms+=86400000){
          let a = new Date(ms), year = a.getFullYear(), month = a.getMonth()+1, day = a.getDate();
          let date = new CustomDate(year, month, day);
          d.push(date);
        }
        return d;
    }

    getShift(s){
      let time = this.convertToCustomTime(s);
      if(time.hour<18) return 'Day'
      return 'Night'
    }

    getOvertime(t){
      let time = this.convertToCustomTime(t);
      if(time.hour>18) {
        let h = time.hour-18;
        let m =time.minute;
        return h+(m/60);
      } 
      return 0;
    }

        


}