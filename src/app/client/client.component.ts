import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";

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
  closeResult!: string;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal
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

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/api/v1/clients';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // @ts-ignore
  openDetails(targetModal, client: Client) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    // @ts-ignore
    document.getElementById('fname').setAttribute('value', client.firstName);
    // @ts-ignore
    document.getElementById('lname').setAttribute('value', client.lastName);
    // @ts-ignore
    document.getElementById('contact_number').setAttribute('value', client.contactNumber);
    // @ts-ignore
    document.getElementById('email_details').setAttribute('value', client.email);
    // @ts-ignore
    document.getElementById('country_details').setAttribute('value', client.country);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
