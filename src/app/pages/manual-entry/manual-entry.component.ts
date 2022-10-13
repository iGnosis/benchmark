import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Prompt } from '../edit-benchmark-config/edit-benchmark-config.component';

export enum KEY_CODE {
  UP_ARROW = 38,
  DOWN_ARROW = 40,
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}


@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss']
})
export class ManualEntryComponent implements AfterViewInit {

  constructor(private renderer: Renderer2) { }
  isPlaying = false;

  ngAfterViewInit(): void {
    this.video.nativeElement.addEventListener('timeupdate', () => {
      this.onTimeUpdated()
    });
  }

  @ViewChild('video') video!: ElementRef;
  currentTime: number = 0;
  currentPrompt: any;
  currentMetric: any;
  promptsList: any = [
    {
      "prompt": {
        "id": "0ff8326d-0963-4437-8d10-cb265eeda859",
        "data": {
          "gameStartTime": 1665127406343,
          "loopStartTime": 1665127446521,
          "firstPromptTime": 1665127449881
        },
        "type": "start",
        "timestamp": 1665127449888
      },
      "result": {
        "type": "success",
        "score": 0,
        "timestamp": 1665127449889
      },
      "reaction": {
        "type": "start",
        "startTime": 1665127449889,
        "timestamp": 1665127449889,
        "completionTimeInMs": 0
      },
      manual: {}
    },
    {
      "prompt": {
        "id": "9e43769e-8f34-4b35-8710-2a2894fb3754",
        "data": {
          "number": 76
        },
        "type": "sit",
        "timestamp": 1665127449911
      },
      "result": {
        "type": "success",
        "score": 1,
        "timestamp": 1665127450892
      },
      "reaction": {
        "type": "sit",
        "startTime": 1665127450892,
        "timestamp": 1665127450892,
        "completionTimeInMs": 981
      },
      manual: {}
    },
    {
      "prompt": {
        "id": "1534cbbc-126d-43b1-8c58-0278ffcf9efc",
        "data": {
          "number": 89
        },
        "type": "stand",
        "timestamp": 1665127451955
      },
      "result": {
        "type": "success",
        "score": 1,
        "timestamp": 1665127453807
      },
      "reaction": {
        "type": "stand",
        "startTime": 1665127453808,
        "timestamp": 1665127453808,
        "completionTimeInMs": 1852
      },
      manual: {}
    },
    {
      "prompt": {
        "id": "ff965c0d-4899-406b-9c87-e5a04081c935",
        "data": {
          "number": 1
        },
        "type": "stand",
        "timestamp": 1665127454882
      },
      "result": {
        "type": "failure",
        "score": 0,
        "timestamp": 1665127457342
      },
      "reaction": {
        "type": "sit",
        "startTime": 1665127457342,
        "timestamp": 1665127457342,
        "completionTimeInMs": 2460
      },
      manual: {}
    }
  ]

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log('key'+event.code)
    switch(event.code){
      case 'ArrowLeft':
        this.onBackward()
        break;
      case 'ArrowRight':
        this.onForward()
        break;
      case ' ':
      case 'Spacebar':
      case 'Enter':
        this.isPlaying? this.onPause(): this.onPlay()
        break;
      case 'Keyi':
      case 'KeyI':
        if(this.currentPrompt) {
          this.currentPrompt.manual.initiationTimestamp = this.currentTime
        }
        break;
      case 'Keyc':
      case 'KeyC':
        if(this.currentPrompt) {
          this.currentPrompt.manual.completionTimestamp = this.currentTime
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
