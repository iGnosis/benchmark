import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-benchmark-config',
  templateUrl: './edit-benchmark-config.component.html',
  styleUrls: ['./edit-benchmark-config.component.scss'],
})
export class EditBenchmarkConfigComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}

  private routeSub!: Subscription;
  private configId!: string;

  shortLink: string = '';
  loading: boolean = false; // Flag variable
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
}
