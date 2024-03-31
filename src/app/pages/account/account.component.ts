import {Component, OnInit} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {environment} from "../../../environments/environment.development";
import {User} from "../../model/user";
import {MaterialModule} from "../../material/material.module";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {

  user!: User;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.user = {username:decodedToken.sub,roles:decodedToken.role.split(',')}
  }
}
