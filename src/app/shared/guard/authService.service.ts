import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http} from "@angular/http";

@Injectable()
export class AuthService implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(){}
}
