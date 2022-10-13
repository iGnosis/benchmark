import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { BenchmarkConfig } from 'src/types/main';

@Component({
  selector: 'app-all-benchmark-configs',
  templateUrl: './all-benchmark-configs.component.html',
  styleUrls: ['./all-benchmark-configs.component.scss'],
})
export class AllBenchmarkConfigsComponent implements OnInit {
  constructor(private router: Router, private gqlService: GraphqlService) {}

  benchmarkConfigsList!: BenchmarkConfig[];

  async ngOnInit() {
    const benchmarkConfigs = await this.gqlService.gqlRequest(
      GqlConstants.GET_ALL_BENCHMARK_CONFIGS,
      {}
    );
    console.log(
      'allBenchmarkConfigs::',
      benchmarkConfigs.game_benchmark_config
    );
    this.benchmarkConfigsList = benchmarkConfigs.game_benchmark_config;
  }

  redirectToCreateNewBenchmark() {
    this.router.navigate(['/app/configs/new']);
  }

  editBenchmarkConfig(id: string) {
    console.log('open editBenchmarkConfig, id::', id);
    this.router.navigate(['/app/configs/edit/', id]);
  }

  getDateFromISOString(IsoString: string): string {
    const dateString = new Date(IsoString);
    const [_day, month, date, year] = dateString.toDateString().split(' ');
    return `${month} ${date}, ${year}`;
  }
}
