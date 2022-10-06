import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

interface Prompt {
  id: string;
  prompt: string;
  initiationTime: string;
  completionTime: string;
  startTime: string;
  endTime: string;
  state: 'success' | 'failure';
}

interface BenchmarkRun {
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
  constructor(private route: ActivatedRoute) {}

  private routeSub!: Subscription;
  private configId!: string;

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

  file: File | null = null; // Variable to store file

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      console.log('config:id::', params['id']);
      this.configId = params['id'];
    });
  }

  onFileUpload(event: any, type: 'withPrompts' | 'withoutPrompts') {
    // console.log(event);
    this.file = event.target.files[0];
    console.log('file::', this.file);
    console.log('fileType::', type);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  runBenchmark() {
    console.log('run:benchmark::', this.configId);
  }

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
    console.log('download::benchmarkRun::id:', benchmarkRunId);
  }
}
