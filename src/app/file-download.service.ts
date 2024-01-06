import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  constructor(private httpClient: HttpClient) {}

  downloadFile(): Observable<Blob> {
    return this.httpClient.get('http://localhost:8080/api/v1/clients/export/xlsx', {
      responseType: 'blob'
    });
  }
}
