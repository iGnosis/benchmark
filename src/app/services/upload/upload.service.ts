import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadVideo(uploadUrl: string, file: File) {
    return this.http.put(uploadUrl, file, { observe: 'response' });
  }
}
