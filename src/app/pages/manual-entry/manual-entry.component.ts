import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import {
  AnalyticsDTOWithPromptDetails,
  BenchmarkConfig,
  ManualCalculations,
  ManualEntry,
} from '../../../types/main';



@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements AfterViewInit, OnInit, OnDestroy {
  private routeSub!: Subscription;
  private benchmarkConfigId!: string;
  constructor(
    private route: ActivatedRoute,
    private gqlService: GraphqlService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.benchmarkConfigId = params['id'];
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  isPlaying = false;

  async ngAfterViewInit() {
    await this.initTables(this.benchmarkConfigId);

    this.video &&
      this.video.nativeElement.addEventListener('timeupdate', () => {
        this.onTimeUpdated();
      });

    if (
      this.benchmarkConfig.screenRecordingUrl &&
      this.benchmarkConfig.screenRecordingUploadStatus
    ) {
      const source: HTMLSourceElement = document.createElement('source');
      source.src = this.benchmarkConfig.screenRecordingUrl;
      source.type = 'video/mp4';
      this.video && this.video.nativeElement.appendChild(source);
    }
  }

  @ViewChild('videoEle') video!: ElementRef<HTMLVideoElement>;
  currentTime: number = 0;
  currentPrompt: ManualEntry | undefined;
  currentMetric: any;
  promptsList: any[] = [];

  analyticsList!: AnalyticsDTOWithPromptDetails[];
  benchmarkConfig!: BenchmarkConfig;

  manualCalculations!: ManualCalculations;

  async initTables(benchmarkConfigId: string) {
    const benchmarkConfigResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_BENCHMARK_CONFIG,
      { benchmarkConfigId }
    );
    this.benchmarkConfig = benchmarkConfigResp.game_benchmark_config_by_pk;
    console.log('benchmark::config:', this.benchmarkConfig);

    const gameAnalyticsResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_GAME_ANALYTICS,
      {
        gameId: this.benchmarkConfig.originalGameId,
      }
    );
    this.analyticsList = gameAnalyticsResp.game_by_pk.analytics;
    this.analyticsList = this.analyticsList.filter(
      (analytic) => analytic.prompt.type !== 'start'
    );
    console.log('analytics::', gameAnalyticsResp.game_by_pk.analytics);

    this.manualCalculations = this.benchmarkConfig.manualCalculations || {};

    Object.keys(this.manualCalculations).forEach((key) => {
      const index = this.analyticsList.findIndex(
        (analytics) => analytics.prompt.id === key
      );
      this.analyticsList[index].manualEntry = true;
    });
  }

  async saveManualEntry(currentPrompt: ManualEntry) {
    console.log(currentPrompt);

    if (
      !currentPrompt.initiationTimeStamp ||
      !currentPrompt.completionTimeStamp ||
      !currentPrompt.promptId
    ) {
      return;
    }

    const id = currentPrompt.promptId;

    // TODO: calculate promptStartTime to calculate the initiationTime
    // const initiationTimeInMs =
    //   currentPrompt.initiationTimeStamp - promptStartTime;

    const completionTimeStampInMS = currentPrompt.completionTimeStamp * 1000;
    const initiationTimeStampInMS = currentPrompt.initiationTimeStamp * 1000;

    const completionTimeInMs =
      completionTimeStampInMS - initiationTimeStampInMS;

    this.manualCalculations = this.manualCalculations || {};
    this.manualCalculations[id] = {
      initiationTimeStamp: currentPrompt.initiationTimeStamp,
      completionTimeStamp: currentPrompt.completionTimeStamp,
      isSuccess: currentPrompt.isSuccess as boolean,
      completionTimeInMs,
    };

    const resp = await this.gqlService.gqlRequest(
      GqlConstants.SET_MANUAL_CALCULATIONS,
      {
        manualCalculations: this.manualCalculations,
        benchmarkConfigId: this.benchmarkConfigId,
      }
    );

    this.manualCalculations =
      resp.update_game_benchmark_config_by_pk.manualCalculations;
    console.log('manualCalculations', this.manualCalculations);

    const index = this.analyticsList.findIndex(
      (analytics) => analytics.prompt.id === id
    );
    this.analyticsList[index].manualEntry = true;

    this.currentPrompt = undefined;
  }

  getManualCalculations(analytics: AnalyticsDTOWithPromptDetails): ManualEntry {
    const promptId = analytics.prompt.id;
    if (this.manualCalculations[promptId]) {
      return {
        ...this.manualCalculations[promptId],
        promptId,
        promptType: analytics.prompt.type,
      };
    }
    return {
      promptType: analytics.prompt.type,
      promptId: analytics.prompt.id,
    };
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowLeft':
        this.onBackward();
        break;
      case 'ArrowRight':
        this.onForward();
        break;
      case ' ':
      case 'Space':
      case 'Enter':
        this.isPlaying ? this.onPause() : this.onPlay();
        break;
      case 'Keyi':
      case 'KeyI':
        if (this.currentPrompt) {
          this.currentPrompt.initiationTimeStamp = this.currentTime;
        }
        break;
      case 'Keyc':
      case 'KeyC':
        if (this.currentPrompt) {
          this.currentPrompt.completionTimeStamp = this.currentTime;
        }
        break;
    }
  }

  setCurrentTime(event: any, model: any) {
    model = this.currentTime;
  }

  onPlay() {
    this.video.nativeElement.play();
    this.isPlaying = true;
  }

  onPause() {
    this.video.nativeElement.pause();
    this.isPlaying = false;
  }

  onChangePlayBackRate(rate: number) {
    this.video.nativeElement.playbackRate = rate;
  }

  onTimeUpdated() {
    this.currentTime = this.video.nativeElement.currentTime;
  }

  onForward() {
    if (this.video) {
      this.video.nativeElement.currentTime += 0.033;
    }
  }

  onBackward() {
    if (this.video) {
      this.video.nativeElement.currentTime -= 0.033;
    }
  }
}
