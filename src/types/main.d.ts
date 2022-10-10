export interface BenchmarkConfig {
  id: string;
  manualCalculations: {
    [key: string]: { isSuccess: boolean; completionTimeInMs: number };
  };
  originalGameId: string;
  rawVideoUrl: string;
  screenRecordingUrl: string;
  createdAt: string;
  updatedAt: string;
  game: {
    gameName: string;
  };
}

interface VideoUploadUrlsResp {
  uploadBenchmarkVideos: {
    data: {
      screenCaptureUploadUrl: string;
      webcamUploadUrl: string;
    };
  };
}
