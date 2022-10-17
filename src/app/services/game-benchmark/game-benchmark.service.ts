import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { environment } from 'src/environments/environment';
import { GqlConstants } from '../graphql/gql-constants';
import { GraphqlService } from '../graphql/graphql.service';
import { JwtService } from '../jwt/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class GameBenchmarkService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private graphqlService: GraphqlService
  ) { }

  async updateUserConf(gameBenchmarkId: string) {
    const systemSpec = await invoke('get_system_details');
    console.log('systemSpec::', systemSpec);
    return await this.graphqlService.client.request(GqlConstants.UPDATE_GAME_BENCHMARK_SYSTEM_CONF, {
      gameBenchmarkId,
      systemSpec
    })
  }
}
