import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

export interface Activity {
  id: string;
  game_name: string;
  aggregate_analytics: [{ key: string; value: number }];
  patientByPatient: {
    nickname: string;
  };
  endedAt: string;
  createdAt: string;
}

@Component({
  selector: 'app-new-benchmark-config',
  templateUrl: './new-benchmark-config.component.html',
  styleUrls: ['./new-benchmark-config.component.scss'],
})
export class NewBenchmarkConfigComponent implements OnInit {
  constructor(private router: Router, private gqlService: GraphqlService) {}

  recentGames: Activity[] = [];
  rowsAvailable = false;
  private offset = 0;

  async ngOnInit() {
    await this.showMoreActivities();
    this.rowsAvailable = true;
  }

  async showMoreActivities() {
    const activities: Activity[] = await this.getRecentGames(this.offset);
    this.recentGames.push(...activities);
  }

  async getRecentGames(offset: number, limit = 10) {
    const recentGames = await this.gqlService.gqlRequest(
      GqlConstants.GET_RECENT_ACTIVITIES,
      {
        limit,
        offset,
      }
    );

    this.offset += limit;
    return recentGames.game;
  }

  async createNewBenchmarkConfig(gameId: string) {
    // TODO: Create new benchmark config
    console.log(gameId);
    const resp = await this.gqlService.gqlRequest(
      GqlConstants.INSERT_NEW_BENCHMARK_CONFIG,
      {
        originalGameId: gameId,
      }
    );

    console.log('create::new::benchmarkConfig:', resp);

    if (
      resp.insert_game_benchmark_config_one &&
      resp.insert_game_benchmark_config_one.id
    ) {
      this.router.navigate([
        '/app/configs/edit/',
        resp.insert_game_benchmark_config_one.id,
      ]);
    } else {
      const resp = await this.gqlService.gqlRequest(
        GqlConstants.GET_CONFIG_ID,
        {
          originalGameId: gameId,
        }
      );
      this.router.navigate([
        '/app/configs/edit/',
        resp.game_benchmark_config[0].id,
      ]);
    }
  }

  startNewActivity() {
    // TODO: Start new activity
    console.log('clicked on start new activity');
  }

  getDateFromISOString(IsoString: string): string {
    const dateString = new Date(IsoString);
    const [_day, month, date, year] = dateString.toDateString().split(' ');
    return `${month} ${date}, ${year}`;
  }
}
