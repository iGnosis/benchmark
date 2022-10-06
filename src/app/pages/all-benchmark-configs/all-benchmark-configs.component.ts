import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface BenchmarkConfig {
  id: string;
  isRawVideo: boolean;
  isScreenRec: boolean;
  activity: string;
  bestAccuracy: number;
  lastRun: string;
  createdAt: number;
  setupUsage: number;
}

@Component({
  selector: 'app-all-benchmark-configs',
  templateUrl: './all-benchmark-configs.component.html',
  styleUrls: ['./all-benchmark-configs.component.scss'],
})
export class AllBenchmarkConfigsComponent implements OnInit {
  constructor(private router: Router) {}

  // mock data until API is available
  configList: BenchmarkConfig[] = [
    {
      id: '1',
      isRawVideo: true,
      isScreenRec: true,
      activity: 'Sit, Stand, Achieve',
      bestAccuracy: 99,
      lastRun: '5 minutes',
      createdAt: 1664973599567,
      setupUsage: 10,
    },
    {
      id: '2',
      isRawVideo: true,
      isScreenRec: false,
      activity: 'Beat Boxer',
      bestAccuracy: 80,
      lastRun: '3 minutes',
      createdAt: 1664973599567,
      setupUsage: 90,
    },
    {
      id: '3',
      isRawVideo: false,
      isScreenRec: true,
      activity: 'Sound Explorer',
      bestAccuracy: 90,
      lastRun: '2 minutes',
      createdAt: 1664973599567,
      setupUsage: 80,
    },
  ];

  ngOnInit(): void {}

  redirectToCreateNewBenchmark() {
    this.router.navigate(['/app/configs/new']);
  }

  editBenchmarkConfig(id: string) {
    this.router.navigate(['/app/configs/edit/', id]);
    console.log('open editBenchmarkConfig, id::', id);
  }
}
