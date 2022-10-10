import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { VideoUploadUrlsResp } from 'src/types/main';

export interface Prompt {
  id: string;
  prompt: string;
  initiationTime: string;
  completionTime: string;
  startTime: string;
  endTime: string;
  state: 'success' | 'failure';
}

export interface BenchmarkRun {
  id: string;
  activity: string;
  accuracy: number;
  createdAt: string;
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
  private benchmarkConfig!: string;

  // TODO: remove mock data, Integrate APIs.
  promptsList: Prompt[] = [
    {
      id: '1',
      prompt: 'red',
      initiationTime: '400',
      completionTime: '643',
      startTime: '01:02:450',
      endTime: '01:04:535',
      state: 'success',
    },
    {
      id: '2',
      prompt: 'blue',
      initiationTime: '500',
      completionTime: '743',
      startTime: '01:02:450',
      endTime: '01:04:535',
      state: 'failure',
    },
    {
      id: '3',
      prompt: 'blue',
      initiationTime: '200',
      completionTime: '443',
      startTime: '01:02:450',
      endTime: '01:04:535',
      state: 'success',
    },
    {
      id: '4',
      prompt: 'red',
      initiationTime: '300',
      completionTime: '543',
      startTime: '01:02:450',
      endTime: '01:04:535',
      state: 'failure',
    },
  ];

  previousBenchmarkRuns: BenchmarkRun[] = [
    {
      id: '1',
      activity: 'Sit, Stand, Achieve',
      accuracy: 89,
      createdAt: 'Aug 20, 2022',
    },
    {
      id: '2',
      activity: 'Beat Boxer',
      accuracy: 49,
      createdAt: 'Aug 19, 2022',
    },
    {
      id: '3',
      activity: 'Sound Explorer',
      accuracy: 70,
      createdAt: 'Aug 18, 2022',
    },
  ];

  rawFile!: File;
  screenRecFile!: File;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log('config:id::', params['id']);
      this.benchmarkConfig = params['id'];
    });
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
          benchmarkConfigId: this.benchmarkConfig,
        },
        true
      );
    return videoUploadUrlsResp.uploadBenchmarkVideos.data;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  runBenchmark() {
    console.log('run:benchmark::', this.benchmarkConfig);
    this.router.navigate(['app/benchmarks/all']);
  }

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
    console.log('download::benchmarkRun::id:', benchmarkRunId);
  }
}
