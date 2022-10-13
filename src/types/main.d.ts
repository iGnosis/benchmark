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

export interface BenchmarkRun {
  analytics: AnalyticsDTO[];
  createdAt: string;
  gameId: string;
  id: string;
  originalGameId: string;
  systemSpec: { [key: string]: string };
}

export interface VideoUploadUrlsResp {
  uploadBenchmarkVideos: {
    data: {
      screenCaptureUploadUrl: string;
      webcamUploadUrl: string;
    };
  };
}

export type AnalyticsDTO = {
  prompt: AnalyticsPromptDTO;
  reaction: AnalyticsReactionDTO;
  result: AnalyticsResultDTO;
};

export type AnalyticsPromptDTO = {
  id: string;
  type: string;
  timestamp: number;
  data:
    | Sit2StandAnalyticsDTO
    | BeatboxerAnalyticsDTO
    | SoundExplorerAnalyticsDTO;
};

export type AnalyticsReactionDTO = {
  type: string;
  timestamp: number;
  startTime: number;
  completionTime: number | null;
  completionTimeInMs: number | null;
};

export type AnalyticsResultDTO = {
  type: 'success' | 'failure';
  timestamp: number;
  score: number;
};

// individual game data
export type Sit2StandAnalyticsDTO = {
  number: number | string;
};

export type BeatboxerAnalyticsDTO = {
  leftBag: BagType | 'obstacle' | undefined;
  rightBag: BagType | 'obstacle' | undefined;
};

export type SoundExplorerAnalyticsDTO = {
  shapes: Shape[];
};

export type BagType = 'heavy-blue' | 'heavy-red' | 'speed-blue' | 'speed-red';
export type Shape = 'circle' | 'triangle' | 'rectangle' | 'wrong' | 'hexagon';
