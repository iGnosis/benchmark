import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GqlConstants } from 'src/app/services/graphql/gql-constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { AnalyticsDTO, BenchmarkConfig } from 'src/types/main';
import { Prompt } from '../edit-benchmark-config/edit-benchmark-config.component';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
}

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent implements AfterViewInit, OnInit, OnDestroy {
  private routeSub!: Subscription;
  private benchmarkConfigId!: string;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private gqlService: GraphqlService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.benchmarkConfigId = params['id'];
    });
    this.initTables(this.benchmarkConfigId);
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  isPlaying = false;

  ngAfterViewInit(): void {
    this.video.nativeElement.addEventListener('timeupdate', () => {
      this.onTimeUpdated();
    });
  }

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  currentTime: number = 0;
  currentPrompt: any | undefined;
  currentMetric: any;
  promptsList: any[] = [];

  analyticsList!: AnalyticsDTO[];
  benchmarkConfig!: BenchmarkConfig;
  async initTables(benchmarkConfigId: string) {
    const benchmarkConfigResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_BENCHMARK_CONFIG,
      { benchmarkConfigId },
      true
    );
    this.benchmarkConfig = benchmarkConfigResp.game_benchmark_config_by_pk;
    console.log('benchmark::config:', this.benchmarkConfig);

    if (this.benchmarkConfig.screenRecordingUrl) {
      const source: HTMLSourceElement = document.createElement('source');
      source.src = this.benchmarkConfig.rawVideoUrl;
      source.type = 'video/mp4';
      this.video.nativeElement.appendChild(source);
    }

    const gameAnalyticsResp = await this.gqlService.gqlRequest(
      GqlConstants.GET_GAME_ANALYTICS,
      {
        gameId: this.benchmarkConfig.originalGameId,
      }
    );
    this.analyticsList = gameAnalyticsResp.game_by_pk.analytics;
    console.log(gameAnalyticsResp.game_by_pk.analytics);
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
          this.currentPrompt.manual.initiationTimestamp = this.currentTime;
        }
        break;
      case 'Keyc':
      case 'KeyC':
        if (this.currentPrompt) {
          this.currentPrompt.manual.completionTimestamp = this.currentTime;
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
    this.video.nativeElement.currentTime += 0.033;
  }

  onBackward() {
    this.video.nativeElement.currentTime -= 0.033;
  }
}
