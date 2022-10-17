import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download/download.service';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import {
  AnalyticsDTO,
  BenchmarkConfig,
  BenchmarkRun,
  VideoUploadUrlsResp,
} from 'src/types/main';

export interface Prompt {
  id: string;
  prompt: string;
  initiationTime: string;
  completionTime: string;
  startTime: string;
  endTime: string;
  state: 'success' | 'failure';
}

type videoUploadStatus = 'pending' | 'in-progress' | 'uploaded'

@Component({
  selector: 'app-edit-benchmark-config',
  templateUrl: './edit-benchmark-config.component.html',
  styleUrls: ['./edit-benchmark-config.component.scss'],
})
export class EditBenchmarkConfigComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gqlService: GraphqlService,
    private uploadService: UploadService,
    private downloadService: DownloadService
  ) {
    this.sort = new MatSort();
  }

  private routeSub!: Subscription;
  private benchmarkConfigId!: string;
  rawVideoUploadStatus: videoUploadStatus = 'pending';
  screenRecVideoUploadStatus: videoUploadStatus = 'pending';
  benchmarkConfig!: BenchmarkConfig;

  originalGameId!: string;
  analyticsList!: AnalyticsDTO[];
  benchmarkRunsListDataSource!: MatTableDataSource<BenchmarkRun>;
  benchmarksDisplayedColumns: string[] = [
    'activityName',
    'completionTimeAbsAvg',
    'createdAt',
    'download',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.benchmarkConfigId = params['id'];
      console.log('config:id::', this.benchmarkConfigId);
    });
    this.initTables(this.benchmarkConfigId);
  }

  gameBenchmarkStartDate?: Date;
  gameBenchmarkEndDate?: Date;
  changeGameBenchmarksDates(type: 'start' | 'end', date: Date) {
    console.log(`${type}: ${date}`);
    if (!date) return;
    switch (type) {
      case 'start':
        if (date !== this.gameBenchmarkStartDate) {
          date.setHours(0, 0, 0, 0);
          this.gameBenchmarkStartDate = date;
          this.gameBenchmarkEndDate = undefined;
        }
        break;
      case 'end':
        if (date !== this.gameBenchmarkEndDate) {
          this.gameBenchmarkEndDate = date;
        }
        break;
    }
    if (this.gameBenchmarkStartDate && this.gameBenchmarkEndDate) {
      this.getGameBenchmarks(this.gameBenchmarkStartDate, this.gameBenchmarkEndDate);
    }
  }

  async getGameBenchmarks(startDate: Date, endDate: Date) {
    const reloadEndDate = new Date(new Date(endDate).setHours(24, 0, 0, 0));
    const benchmarkRunResp: {
      game_benchmarks: BenchmarkRun[]
    } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_GAME_BENCHMARKS_FOR_CONFIG,
        {
          originalGameId: this.originalGameId,
          startDate,
          endDate: reloadEndDate
        }
      );

    this.benchmarkRunsListDataSource = new MatTableDataSource(benchmarkRunResp.game_benchmarks);
    this.benchmarkRunsListDataSource.data.forEach(data => {
      data.completionTimeAbsAvg = data.avgAccuracy.completionTimeAbsAvg
    })

    this.benchmarkRunsListDataSource.sort = this.sort;
    this.benchmarkRunsListDataSource.paginator = this.paginator;

    console.log('benchmarks::runs::', this.benchmarkRunsListDataSource);
  }

  async initTables(benchmarkConfigId: string) {
    const benchmarkConfigResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_BENCHMARK_CONFIG,
      { benchmarkConfigId }
    );
    this.benchmarkConfig = benchmarkConfigResp.game_benchmark_config_by_pk;
    console.log('benchmark::config:', this.benchmarkConfig);

    const { originalGameId } = this.benchmarkConfig;
    this.originalGameId = originalGameId;

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    await this.getGameBenchmarks(startDate, now);

    const gameAnalyticsResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_GAME_ANALYTICS,
      {
        gameId: originalGameId,
      }
    );
    this.analyticsList = gameAnalyticsResp.game_by_pk.analytics;
    console.log('game:analytics::', gameAnalyticsResp.game_by_pk.analytics);
  }

  async onRawVideoUpload(event: any) {
    const rawFile: File = event.target.files[0];
    const { webcamUploadUrl } = await this.getUploadUrl();
    console.log('uploading:url:webcamUploadUrl::', webcamUploadUrl);
    this.rawVideoUploadStatus = 'in-progress';
    this.uploadService.uploadVideo(webcamUploadUrl, rawFile).subscribe({
      next: async (data) => {
        if (data.status === 200) {
          // setting the upload status in the db to true.
          await this.gqlService.gqlRequest(
            GqlConstants.SET_RAWVIDEO_UPLOAD_STATUS,
            {
              benchmarkConfigId: this.benchmarkConfigId,
            }
          );

          this.benchmarkConfig.rawVideoUploadStatus = true;

          console.log('upload:success::', data.status);
          this.gqlService.gqlRequest(GqlConstants.TRANSCODE_VIDEO, {
            benchmarkConfigId: this.benchmarkConfigId,
            videoType: 'webcam',
          });
          this.rawVideoUploadStatus = 'uploaded';
        }
      },
      error: (err) => {
        console.error('upload:Error::', err);
      },
    });
  }

  async onScreenRecUpload(event: any) {
    const screenRecFile: File = event.target.files[0];
    const { screenCaptureUploadUrl } = await this.getUploadUrl();
    this.screenRecVideoUploadStatus = 'in-progress';
    console.log(
      'uploading:url:screenCaptureUploadUrl::',
      screenCaptureUploadUrl
    );
    this.uploadService
      .uploadVideo(screenCaptureUploadUrl, screenRecFile)
      .subscribe({
        next: async (data) => {
          if (data.status === 200) {
            // setting the upload status in the db to true.
            await this.gqlService.gqlRequest(
              GqlConstants.SET_SCREENREC_UPLOAD_STATUS,
              {
                benchmarkConfigId: this.benchmarkConfigId,
              }
            );

            this.benchmarkConfig.screenRecordingUploadStatus = true;

            console.log('upload:success::', data.status);
            this.gqlService.gqlRequest(GqlConstants.TRANSCODE_VIDEO, {
              benchmarkConfigId: this.benchmarkConfigId,
              videoType: 'screenCapture',
            });
            this.screenRecVideoUploadStatus = 'uploaded';
          }
        },
        error: (err) => {
          console.error('upload:Error::', err);
        },
      });
  }

  async getUploadUrl() {
    const videoUploadUrlsResp: VideoUploadUrlsResp =
      await this.gqlService.gqlRequest(GqlConstants.GET_VIDEO_UPLOAD_URLS, {
        benchmarkConfigId: this.benchmarkConfigId,
      });
    return videoUploadUrlsResp.uploadBenchmarkVideos.data;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  runBenchmark() {
    console.log('run:benchmark::', this.benchmarkConfigId);
    this.router.navigate(["/app/session"], {
      queryParams: {
        benchmarkId: this.benchmarkConfigId
      }
    });
  }

  runManualBenchmark() {
    this.router.navigate(['app/configs/edit/manual', this.benchmarkConfigId]);
  }

  downloadBenchmarkReport(benchmarkRunId: string) {
    console.log('download::benchmarkRun::id:', benchmarkRunId);
    console.log('benchmark:config::id:', this.benchmarkConfigId);

    this.downloadService
      .downloadBenchmarkReport(benchmarkRunId, this.benchmarkConfigId)
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

  getDateFromISOString(IsoString: string): string {
    const dateString = new Date(IsoString);
    const [_day, month, date, year] = dateString.toDateString().split(' ');
    return `${month} ${date}, ${year}`;
  }
}
