import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit} from '@angular/core';
import { StarterService } from './starter.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ProjectManagement } from './../../services/admin/projectManagement.service';
import { AdminGLOBAL } from './../../services/admin/adminGlobal';
import { Project } from './../../models/project';



@Component({
	templateUrl: './starter.component.html',
	styleUrls: ['./starter.component.css']
})

export class StarterComponent implements OnInit, AfterViewInit  {

	@ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
	chart: Array<any> = [];
	url = AdminGLOBAL.url;
	months:string[]= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	years:string[] = [];
	currentYear:number = new Date().getFullYear();
	noOfEmployee: number = 0;
	noOfProject: number = 0;
	totalInvoice:number = 0;
	totalPayment:number = 0;

	public yearObject = {};
	public monthObject = {}; 
	public allocation = {
		total:0,
		year:0,
		month:0,
		week:0
	}

	result:Array<any>;
	projects:Array<Project> = [];
	comments:Array<any>;
	contacts:Array<any>;
	dataforLineOne:{};
	dataforDoughnut:{};
	tabledataDoughnut:Array<any>;
	totalDoughnut:number;
  	public lineChartData:Array<any>=[
		{data: []}
	];
	public lineChartLabels:Array<any>=[];
	public doughnutChartLabels:string[] = [];
	public doughnutChartData:number[] = [];

	dataFrolineSiteA;
	dataFrolineSiteB;
	dataForLine2:{};
	public lineChartData1:Array<any> = [
		{data: []},
		{data: []}
	];
	public lineChartLabels1:Array<any> = [];


	private _url: string = './assets/api/allocated_dates.json';
	private _url2: string = './assets/api/Comments.json';
	private _url3: string = './assets/api/MyContact.json';
	private _url4: string = './assets/api/appUser.json';
	private _url5: string = './assets/api/website.json';
	constructor( 
		private _service: StarterService, 
		private _project: ProjectManagement
	) {}

	ngOnInit() {
		this.totalProjects();
		this.loadCharts();
		this.getTotalInvoice();
		this.getTotalPayment();
		this.loadChart1();
		this.loadChart2();
	}

	ngAfterViewInit() {
		this.parseCharts();
		this.loadChart3();
	}

	loadCharts(){
		this._service.getlineonedata(this._url2).subscribe(resCommentData=> {this.comments = resCommentData['comments'];
			// console.log(this.comments);
		});
		this._service.getlineonedata(this._url3).subscribe(resContactData=> {this.contacts = resContactData['contacts'];
			// console.log(this.contacts);
		});
	}


	totalProjects(){
		this._project.allProject(1).subscribe(
			res=> {
				this.noOfProject = res.total_items_count;
				this.projects = res.data;
			},
			err=> console.log(err)
		);
	}

	getTotalInvoice(){
		this.totalInvoice = 0
	}

	getTotalPayment(){
		this.totalPayment = 0
	}

	parseCharts() {
		this.charts.forEach((child) => {
			this.chart.push(child);
		});
		//console.log(this.chart[0]);
	}

	loadChart1(){
		this._service.getlineonedata(this._url).subscribe(res=> {
			let data = res;
			this.yearObject = this._service.makeYearObject(data);
			this.years = Object.keys(this.yearObject);
			console.log(this.yearObject);
			this.monthObject = this._service.makeMonthObject(this.yearObject,this.currentYear);
			console.log(this.monthObject);
			this.result = this._service.makeAllocationChartData(this.monthObject); 
			this.populateChartOne(this.result);
			this.allocation.total = data.length;
			this.allocation.year = this.yearObject[this.currentYear].length;
			let mw = this._service.getTotalMonthAlloc(this.monthObject);
			this.allocation.month = mw.month;
			this.allocation.week = mw.week;
		});
	}

	populateChartOne(data){
		this.dataforLineOne=this._service.getLabelData(this.result);
		// console.log(this.dataforLineOne['dat'],this.dataforLineOne['lab']);
		this.lineChartData=[{data: this.dataforLineOne['dat']}];
		this.lineChartLabels=this.dataforLineOne['lab'];
		this.chart[0].chart.config.data.labels  = this.dataforLineOne['lab'];
	}

	selectedYearChart(y){
		console.log(y);
		this.monthObject = this._service.makeMonthObject(this.yearObject,y);
		this.result = this._service.makeAllocationChartData(this.monthObject); 
		this.populateChartOne(this.result);
	}

	selectedMonthChart(m){
		console.log(m);
		if(m){
			this.result = this._service.makeWeekObject(this.monthObject,m,this.currentYear);
			this.populateChartOne(this.result);
		} else {
			this.result = this._service.makeAllocationChartData(this.monthObject); 
			this.populateChartOne(this.result);
		}
			
	}

	//Doughnut
	loadChart2(){
		this._service.getlineonedata(this._url4).subscribe(
			resLineData=> {
			let data = resLineData['users'];
			this.noOfEmployee = this._service.getEmployeeCount(data);
			this.tabledataDoughnut = this._service.proccesDoughnut(data);
			this.dataforDoughnut=this._service.getLabelData(this.tabledataDoughnut);
			this.totalDoughnut = this._service.getTotal(this.dataforDoughnut['dat']);
			this.doughnutChartData=this._service.getPercentage(this.dataforDoughnut['dat'],this.totalDoughnut);

			this.doughnutChartLabels=this.dataforDoughnut['lab'];
			this.chart[1].chart.config.data.labels = this.dataforDoughnut['lab'];
		});
	}


	loadChart3(){
		// this._service.getlineonedata(this._url5).subscribe(
		// 	resLineData=> {
		// 		this.dataForLine2 = resLineData['website'];
			
		// 	this.dataFrolineSiteA = this._service.getLabelData(this.dataForLine2['SiteA']);
		// 	this.dataFrolineSiteB = this._service.getLabelData(this.dataForLine2['SiteB']);
		// 	this.lineChartData1 = [
		// 		{data: this.dataFrolineSiteA['dat']},
		// 		{data: this.dataFrolineSiteB['dat']}
		// 	];
		// 	 this.chart[2].chart.config.data.labels = this.dataFrolineSiteA['lab'];
		// });
	}




	// lineChart

	public lineChartOptions:any = {
		elements: {
			line: {
				tension: 0
			}
		},
		responsive: true,
		scales: {
			yAxes: [
				{
					ticks: {
						callback: function(label) {
							return label;
						},
						min: 0,
						stepSize: 10,
						beginAtZero: true,
						fontSize: 15,
						fontColor: 'lightgrey',
						maxTicksLimit: 5,
						padding: 25,
					},
					gridLines: {
						drawBorder: false,
					}
				}
			],
			xAxes : [ {
				gridLines : {
					display : false
				},
				ticks: {
					fontSize: 15,
					fontColor: 'lightgrey'
				}
			} ]
		},
		tooltips: {
			callbacks: {
				// title: function() {
				// 	return 'Allocation'
				// },
				label: function(tooltipItem, data) {
					return data['datasets'][0]['data'][tooltipItem['index']];
				}
			},
			titleFontSize: 16,
			titleFontColor: '#ffffff',
			bodyFontColor: '#ffffff',
			bodyFontSize: 18,
			displayColors: false
		}
	};
	public lineChartColors:Array<any> = [
		{
			backgroundColor: 'transparent',
			borderColor: '#1e90ff',
			pointBackgroundColor: '#1e90ff',
			pointBorderColor: '#1e90ff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		}
	];
	public Legend:boolean = false;
	public lineChartType:string = 'line';

	//Doughnut
	public doughnutChartType:string = 'doughnut';
	public doughnutChartColors:Array<any> = [
		{
			backgroundColor: ['#eceff1', '#745af2', '#1e88e5'],
			borderColor: ['#eceff1', '#745af2', '#1e88e5'],
			hoverBackgroundColor: ['#eceff1', '#745af2', '#1e88e5'],
			hoverBorderColor: ['#eceff1', '#745af2', '#1e88e5'],
			hoverBorderWidth: [5,5,5,5]
		}
	];
	public doughnutChartOptions:any = {
		responsive: true,
		tooltips: {
			callbacks: {
				title: function(tooltipItem, data) {
					return data['labels'][tooltipItem[0]['index']];
				},
				label: function (tooltipItem, data) {
					return data['datasets'][0]['data'][tooltipItem['index']] + '%';
				}
			},
			titleFontSize: 16,
			titleFontColor: '#ffffff',
			bodyFontColor: '#ffffff',
			bodyFontSize: 18,
			displayColors: false
		}
	};


	/*******website*************/
	public lineChartOptions1:any = {
		responsive: true,
		scales: {
			yAxes: [
				{
					ticks: {
						callback: function(label) {
							return label+'k';
						},
						min: 0,
						stepSize: 5,
						beginAtZero: true,
						fontSize: 15,
						fontColor: 'lightgrey',
						maxTicksLimit: 5,
						padding: 25,
					}
				}
			],
			xAxes : [ {
				ticks: {
					fontSize: 15,
					fontColor: 'lightgrey'
				}
			} ]
		},
		tooltips: {
			callbacks: {
				title: function() {
					return
				}
			},
			titleFontSize: 16,
			titleFontColor: '#ffffff',
			bodyFontColor: '#ffffff',
			bodyFontSize: 18,
			displayColors: false
		}
	};
	public lineChartColors1:Array<any> = [
		{
			backgroundColor: 'rgba(6, 215, 156,0.1)',
			borderColor: '#06d79c',
			pointBackgroundColor: '#06d79c',
			pointBorderColor: '#06d79c',
			pointHoverBackgroundColor: '#06d79c',
			pointHoverBorderColor: '#06d79c'
		},
		{
			backgroundColor: 'rgba(57, 139, 247,0.1)',
			borderColor: '#398bf7',
			pointBackgroundColor: '#398bf7',
			pointBorderColor: '#398bf7',
			pointHoverBackgroundColor: '#398bf7',
			pointHoverBorderColor: '#398bf7'
		}
	];


	public chartClicked(e:any):void {}
	public chartHovered(e:any):void {}
}