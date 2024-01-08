import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {FileDownloadService} from "../file-download.service";

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
  // @ts-ignore
  clients: Client[];
  // @ts-ignore
  closeResult: string;
  // @ts-ignore
  editForm: FormGroup;
  // @ts-ignore
  deleteId: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private fileDownloadService: FileDownloadService
  ) { }

  downloadFile(): void {
    this.fileDownloadService.downloadFile().subscribe(
      (data: Blob) => {
        // Create a Blob URL and trigger download
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'clients.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading file:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getClients();
    this.editForm = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      country: ['', Validators.required]
    });
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

  // @ts-ignore
  openEdit(targetModal, client: Client) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      contactNumber: client.contactNumber,
      email: client.email,
      country: client.country
    });
  }

  // @ts-ignore
  openDelete(targetModal, client: Client) {
    this.deleteId = client.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onSave() {
    const editURL = 'http://localhost:8080/api/v1/clients/' + this.editForm.value.id + '/edit';
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  onDelete() {
    const deleteURL = 'http://localhost:8080/api/v1/clients/' + this.deleteId + '/delete';
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
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
