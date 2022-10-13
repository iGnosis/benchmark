import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { DownloadService } from 'src/app/services/download/download.service';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { environment } from 'src/environments/environment';
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
    private http: HttpClient,
    private jwtService: JwtService,
    private downloadService: DownloadService
  ) {}

  private routeSub!: Subscription;
  private benchmarkConfigId!: string;
  private benchmarkConfig!: BenchmarkConfig;

  // Pagination
  offset = 0;
  pageLimit = 10;
  currentPage = 1;
  noOfPagesRequired: number[] = [];
  totalBenchmarkRunsCount = 0;

  originalGameId!: string;
  analyticsList!: AnalyticsDTO[];
  benchmarkRunsList!: BenchmarkRun[];
  rawFile!: File;
  screenRecFile!: File;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.benchmarkConfigId = params['id'];
      console.log('config:id::', this.benchmarkConfigId);
    });
    this.initTables(this.benchmarkConfigId);
  }

  decPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  incPage() {
    if (this.currentPage < this.noOfPagesRequired.length) {
      this.changePage(this.currentPage + 1);
    }
  }

  changePage(pageNo: number) {
    console.log('changePage', pageNo);
    this.currentPage = pageNo;

    this.offset = (pageNo * this.pageLimit) - this.pageLimit;
    console.log('this.offset:', this.offset);
    this.getGameBenchmarks();
  }

  async getGameBenchmarks() {
    const benchmarkRunResp: {
      game_benchmarks_aggregate: {
        aggregate: {
          count: number
        }
      },
      game_benchmarks: BenchmarkRun[]
    } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_GAME_BENCHMARKS_FOR_CONFIG,
        {
          originalGameId: this.originalGameId,
          limit: this.pageLimit,
          offset: this.offset
        }
      );
    this.benchmarkRunsList = benchmarkRunResp.game_benchmarks;
    console.log('benchmarks::runs::', this.benchmarkRunsList);
    this.totalBenchmarkRunsCount = benchmarkRunResp.game_benchmarks_aggregate.aggregate.count;
  }

  noOfPagesRequiredCount() {
    const noOfPages = Math.ceil(this.totalBenchmarkRunsCount / this.pageLimit);
    for (let i = 1; i <= noOfPages; i++) {
      this.noOfPagesRequired.push(i);
    }
    console.log('this.totalBenchmarkRunsCount:', this.totalBenchmarkRunsCount);
    console.log('this.noOfPagesRequired:', this.noOfPagesRequired);
    return this.noOfPagesRequired;
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

    await this.getGameBenchmarks();
    this.noOfPagesRequiredCount();

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
    this.rawFile = event.target.files[0];
    const { webcamUploadUrl } = await this.getUploadUrl();
    console.log('uploading:url:webcamUploadUrl::', webcamUploadUrl);
    this.uploadService.uploadVideo(webcamUploadUrl, this.rawFile).subscribe({
      next: (data) => {
        if (data.status === 200) {
          console.log('upload:success::', data.status);
          this.gqlService.gqlRequest(
            GqlConstants.TRANSCODE_VIDEO,
            {
              benchmarkConfigId: this.benchmarkConfigId,
              videoType: 'webcam',
            }
          );
        }
      },
      error: (err) => {
        console.error('upload:Error::', err);
      },
    });
  }

  async onScreenRecUpload(event: any) {
    this.screenRecFile = event.target.files[0];
    const { screenCaptureUploadUrl } = await this.getUploadUrl();
    console.log(
      'uploading:url:screenCaptureUploadUrl::',
      screenCaptureUploadUrl
    );
    this.uploadService
      .uploadVideo(screenCaptureUploadUrl, this.rawFile)
      .subscribe({
        next: (data) => {
          if (data.status === 200) {
            console.log('upload:success::', data.status);
            this.gqlService.gqlRequest(
              GqlConstants.TRANSCODE_VIDEO,
              {
                benchmarkConfigId: this.benchmarkConfigId,
                videoType: 'screenCapture',
              }
            );
          }
        },
        error: (err) => {
          console.error('upload:Error::', err);
        },
      });
  }

  async getUploadUrl() {
    const videoUploadUrlsResp: VideoUploadUrlsResp =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_VIDEO_UPLOAD_URLS,
        {
          benchmarkConfigId: this.benchmarkConfigId,
        }
      );
    return videoUploadUrlsResp.uploadBenchmarkVideos.data;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  runBenchmark() {
    console.log('run:benchmark::', this.benchmarkConfigId);
    this.router.navigate(['app/benchmarks/all']);
  }

  runManualBenchmark() {
    this.router.navigate(['app/configs/edit/manual', this.benchmarkConfigId]);
  }

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
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
