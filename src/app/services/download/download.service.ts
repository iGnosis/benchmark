import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtService } from '../jwt/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  downloadBenchmarkReport(newGameId: string, benchmarkConfigId: string) {
    return this.http.get(
      `${environment.apiEndpoint}/game-benchmarking/report`,
      {
        headers: {
          Authorization: 'Bearer ' + this.jwtService.getToken(),
        },
        params: {
          newGameId,
          benchmarkConfigId,
        },
        responseType: 'arraybuffer',
      }
    );
  }
}
