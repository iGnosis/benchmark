import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DownloadService } from 'src/app/services/download/download.service';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { BenchmarkRun } from 'src/types/main';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-all-benchmarks',
  templateUrl: './all-benchmarks.component.html',
  styleUrls: ['./all-benchmarks.component.scss'],
})
export class AllBenchmarksComponent implements OnInit {
  constructor(
    private router: Router,
    private gqlService: GraphqlService,
    private downloadService: DownloadService
  ) {}

  displayColumns = [
    'activity',
    'completionTimeAbsAvg',
    'initiationTimeAbsAvg',
    'createdAt',
    'download'
  ]
  dataSource!: MatTableDataSource<BenchmarkRun>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    await this.getAllBenchmarks(startDate, now);
  }

  startDate?: Date;
  endDate?: Date;
  changeDate(type: 'start' | 'end', date: Date) {
    console.log(`${type}: ${date}`);
    if (!date) return;
    switch (type) {
      case 'start':
        if (date !== this.startDate) {
          date.setHours(0, 0, 0, 0);
          this.startDate = date;
          this.endDate = undefined;
        }
        break;
      case 'end':
        if (date !== this.endDate) {
          this.endDate = date;
        }
        break;
    }
    if (this.startDate && this.endDate) {
      this.getAllBenchmarks(this.startDate, this.endDate);
    }
  }

  async getAllBenchmarks(startDate: Date, endDate: Date) {
    const reloadEndDate = new Date(new Date(endDate).setHours(24, 0, 0, 0));
    const benchmarkRunsResp: { game_benchmarks: BenchmarkRun[] } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_ALL_BENCHMARKS,
        {
          startDate,
          endDate: reloadEndDate
        }
      );
    this.dataSource = new MatTableDataSource(benchmarkRunsResp.game_benchmarks);
    this.dataSource.data.forEach(data => {
      data.completionTimeAbsAvg = data.avgAccuracy.completionTimeAbsAvg
      data.activity = data.game.gameName;
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async downloadBenchmarkReport(
    newGameId: string,
    originalGameId: string
  ) {
    const benchmarkConfigIdResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_CONFIG_ID,
      {
        originalGameId,
      }
    );

    console.log('download::gameId::id:', newGameId);
    if (!benchmarkConfigIdResp.game_benchmark_config[0]) {
      return;
    }
    const benchmarkConfigId: string =
      benchmarkConfigIdResp.game_benchmark_config[0].id;
    console.log('download::benchmarkConfig::id:', benchmarkConfigId);

    this.downloadService
      .downloadBenchmarkReport(newGameId, benchmarkConfigId)
      .subscribe((arrayBuffer) => {
        if (arrayBuffer) {
          var a = document.createElement('a');
          document.body.appendChild(a);
          const blob = new Blob([arrayBuffer], {
            type: 'application/vnd.ms-excel',
          });

          a.href = URL.createObjectURL(blob);
          a.download = `${newGameId}-report.xlsx`;
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
