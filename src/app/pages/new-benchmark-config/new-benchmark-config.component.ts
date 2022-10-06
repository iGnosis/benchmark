import { Component, OnInit } from '@angular/core';

export interface BenchmarkActivity {
  id: string;
  activity: string;
  achievementRatio: number;
  user: string;
  date: string;
}

@Component({
  selector: 'app-new-benchmark-config',
  templateUrl: './new-benchmark-config.component.html',
  styleUrls: ['./new-benchmark-config.component.scss'],
})
export class NewBenchmarkConfigComponent implements OnInit {
  constructor() {}

  configList: BenchmarkActivity[] = [
    {
      id: '1',
      activity: 'Sit, Stand, Achieve',
      achievementRatio: 83,
      user: 'Mohan',
      date: '1664973599567',
    },
    {
      id: '2',
      activity: 'Beat Boxer',
      achievementRatio: 60,
      user: 'Mohan',
      date: '1664973599567',
    },
  ];

  ngOnInit(): void {}

  startNewActivity() {
    console.log('clicked on start new activity');
  }
}
