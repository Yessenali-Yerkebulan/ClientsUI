import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export class Client{
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public contactNumber: string,
    public email: string,
    public country: string
  ){}
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients!: Client[];

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.getClients();
  }

  getClients(){
    this.httpClient.get<any>('http://localhost:8080/api/v1/clients').subscribe(
      response => {
        console.log(response);
        this.clients = response;
      }
    );
  }

}
