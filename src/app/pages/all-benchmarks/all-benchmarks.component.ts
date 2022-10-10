import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { BenchmarkRun } from 'src/types/main';
@Component({
  selector: 'app-all-benchmarks',
  templateUrl: './all-benchmarks.component.html',
  styleUrls: ['./all-benchmarks.component.scss'],
})
export class AllBenchmarksComponent implements OnInit {
  previousBenchmarkRuns!: BenchmarkRun[];
  constructor(private router: Router, private gqlService: GraphqlService) {}

  async ngOnInit() {
    const benchmarkRunsResp: { game_benchmarks: BenchmarkRun[] } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_ALL_BENCHMARKS,
        {},
        true
      );
    this.previousBenchmarkRuns = benchmarkRunsResp.game_benchmarks;
  }

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
    console.log('download::benchmarkRun::id:', benchmarkRunId);
  }

  redirectToAllBenchmarkConfig() {
    this.router.navigate(['app/configs/all']);
  }

  getDateFromISOString(IsoString: string): string {
    const dateString = new Date(IsoString);
    const [_day, month, date, year] = dateString.toDateString().split(' ');
    return `${month} ${date}, ${year}`;
  }
}
