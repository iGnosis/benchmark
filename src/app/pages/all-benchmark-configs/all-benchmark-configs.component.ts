import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { BenchmarkConfig } from 'src/types/main';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { invoke } from '@tauri-apps/api';

@Component({
  selector: 'app-all-benchmark-configs',
  templateUrl: './all-benchmark-configs.component.html',
  styleUrls: ['./all-benchmark-configs.component.scss'],
})
export class AllBenchmarkConfigsComponent implements OnInit {
  constructor(private router: Router, private gqlService: GraphqlService) {}

  benchmarkConfigsListDataSource!: MatTableDataSource<BenchmarkConfig>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayColumns = [
    'rawVideoUrl',
    'screenRecordingUrl',
    'activity',
    'bestAccuracy',
    'lastRun',
    'createdAt',
    'setupUsage',
  ];

  async ngOnInit() {
    const now = new Date();
    const sevenDaysInPast = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    sevenDaysInPast.setHours(0, 0, 0, 0);
    this.getBenchmarkConfigs(sevenDaysInPast, now);
  }

  startDate?: Date;
  endDate?: Date;
  changeBenchmarkConfigDates(type: 'start' | 'end', date: Date) {
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
      this.getBenchmarkConfigs(this.startDate, this.endDate);
    }
  }

  async getBenchmarkConfigs(startDate: Date, endDate: Date) {
    const reloadEndDate = new Date(new Date(endDate).setHours(24, 0, 0, 0));
    const benchmarkConfigs = await this.gqlService.gqlRequest(
      GqlConstants.GET_ALL_BENCHMARK_CONFIGS,
      {
        startDate,
        endDate: reloadEndDate,
      },
      true
    );
    console.log(
      'allBenchmarkConfigs::',
      benchmarkConfigs.game_benchmark_config
    );
    this.benchmarkConfigsListDataSource = new MatTableDataSource(
      benchmarkConfigs.game_benchmark_config
    );
    this.benchmarkConfigsListDataSource.data.forEach((data) => {
      data.activity = data.game.gameName;
    });
    this.benchmarkConfigsListDataSource.paginator = this.paginator;
    this.benchmarkConfigsListDataSource.sort = this.sort;
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
