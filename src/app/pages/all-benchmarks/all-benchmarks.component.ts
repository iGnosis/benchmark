import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BenchmarkRun } from '../edit-benchmark-config/edit-benchmark-config.component';

@Component({
  selector: 'app-all-benchmarks',
  templateUrl: './all-benchmarks.component.html',
  styleUrls: ['./all-benchmarks.component.scss'],
})
export class AllBenchmarksComponent implements OnInit {
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
  constructor(private router: Router) {}

  ngOnInit(): void {}

  downloadBenchmarkReport(benchmarkRunId: string) {
    // TODO: generate/download a benchmark report
    console.log('download::benchmarkRun::id:', benchmarkRunId);
  }

  redirectToAllBenchmarkConfig() {
    this.router.navigate(['app/configs/all']);
  }
}
