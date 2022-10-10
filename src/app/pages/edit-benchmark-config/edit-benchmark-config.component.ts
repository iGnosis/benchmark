import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UploadService } from 'src/app/services/upload/upload.service';
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
    private uploadService: UploadService
  ) {}

  private routeSub!: Subscription;
  private benchmarkConfigId!: string;
  private benchmarkConfig!: BenchmarkConfig;

  analyticsList!: AnalyticsDTO[];

  benchmarkRunsList!: BenchmarkRun[];

  rawFile!: File;
  screenRecFile!: File;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.benchmarkConfigId = params['id'];
      console.log('config:id::', this.benchmarkConfigId);
    });
    this.getBenchmarkConfig(this.benchmarkConfigId);
  }

  async getBenchmarkConfig(benchmarkConfigId: string) {
    const benchmarkConfigResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_BENCHMARK_CONFIG,
      { benchmarkConfigId },
      true
    );
    this.benchmarkConfig = benchmarkConfigResp.game_benchmark_config_by_pk;
    console.log('benchmark::config:', this.benchmarkConfig);

    const { originalGameId } = this.benchmarkConfig;

    const benchmarkRunResp: { game_benchmarks: BenchmarkRun[] } =
      await this.gqlService.gqlRequest(
        GqlConstants.GET_GAME_BENCHMARKS_FOR_CONFIG,
        {
          originalGameId,
        },
        true
      );
    this.benchmarkRunsList = benchmarkRunResp.game_benchmarks;
    console.log('benchmarks::runs::', benchmarkRunResp.game_benchmarks);

    // TODO: get analytics using originalGamId
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
        console.log('upload:success::', data);
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
          console.log('upload:success::', data);
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
        },
        true
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

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
    console.log('download::benchmarkRun::id:', benchmarkRunId);
  }

  getDateFromISOString(IsoString: string): string {
    const dateString = new Date(IsoString);
    const [_day, month, date, year] = dateString.toDateString().split(' ');
    return `${month} ${date}, ${year}`;
  }
}
