import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/download/download.service';
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
  constructor(
    private router: Router,
    private gqlService: GraphqlService,
    private downloadService: DownloadService
  ) {}

  async ngOnInit() {
    const benchmarkRunsResp: { game_benchmarks: BenchmarkRun[] } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_ALL_BENCHMARKS,
        {}
      );
    this.previousBenchmarkRuns = benchmarkRunsResp.game_benchmarks;
  }

  async downloadBenchmarkReport(
    benchmarkRunId: string,
    originalGameId: string
  ) {
    const benchmarkConfigIdResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_CONFIG_ID,
      {
        originalGameId,
      }
    );

    console.log('download::benchmarkRun::id:', benchmarkRunId);
    if (!benchmarkConfigIdResp.game_benchmark_config[0]) {
      return;
    }
    const benchmarkConfigId: string =
      benchmarkConfigIdResp.game_benchmark_config[0].id;
    console.log('download::benchmarkConfig::id:', benchmarkConfigId);

    this.downloadService
      .downloadBenchmarkReport(benchmarkRunId, benchmarkConfigId)
      .subscribe((arrayBuffer) => {
        if (arrayBuffer) {
          var a = document.createElement('a');
          document.body.appendChild(a);
          const blob = new Blob([arrayBuffer], {
            type: 'application/vnd.ms-excel',
          });

          a.href = URL.createObjectURL(blob);
          a.download = `${benchmarkRunId}-report.xlsx`;
          a.click();
          URL.revokeObjectURL(a.href);
          a.remove();
        }
      });
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
