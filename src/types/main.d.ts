export interface BenchmarkConfig {
  id: string;
  manualCalculations: {
    [key: string]: {
      isSuccess: boolean;
      completionTimeInMs: number;
      initiationTimeInMs?: number;
    };
  };
  originalGameId: string;
  rawVideoUrl: string;
  screenRecordingUrl: string;
  createdAt: string;
  updatedAt: string;
  game: {
    gameName: string;
  };
  screenRecordingUploadStatus: boolean;
  rawVideoUploadStatus: boolean;
  activity?: string; // doing this cos' of MatSort not sorting JSON fields!
}

export interface BenchmarkRun {
  analytics: AnalyticsDTO[];
  createdAt: string;
  gameId: string;
  game: {
    gameName: string;
  };
  id: string;
  originalGameId: string;
  systemSpec: { [key: string]: string };
  avgAccuracy: {
    isSuccessAbsAvg: number;
    completionTimeAbsAvg: number;
  };
  completionTimeAbsAvg?: number; // doing this cos' of MatSort not sorting JSON fields!
}

export interface AnalyticsDTOWithPromptDetails extends AnalyticsDTO {
  initiationTimeStamp?: number;
  completionTimestamp?: number;
  success?: boolean;
  manualEntry?: boolean;
}

export interface VideoUploadUrlsResp {
  uploadBenchmarkVideos: {
    data: {
      screenCaptureUploadUrl: string;
      webcamUploadUrl: string;
    };
  };
}

export interface AnalyticsDTO {
  prompt: AnalyticsPromptDTO;
  reaction: AnalyticsReactionDTO;
  result: AnalyticsResultDTO;
}

export interface AnalyticsPromptDTO {
  id: string;
  type: string;
  timestamp: number;
  data:
    | Sit2StandAnalyticsDTO
    | BeatboxerAnalyticsDTO
    | SoundExplorerAnalyticsDTO;
}

export interface AnalyticsReactionDTO {
  type: string;
  timestamp: number; // placeholder value.
  startTime: number; // placeholder value.
  completionTimeInMs: number | null;
}

export interface AnalyticsResultDTO {
  type: 'success' | 'failure';
  timestamp: number;
  score: number;
}

// individual game data
export interface Sit2StandAnalyticsDTO {
  number: number | string;
}

export interface BeatboxerAnalyticsDTO {
  leftBag: BagType | 'obstacle' | undefined;
  rightBag: BagType | 'obstacle' | undefined;
}

export interface SoundExplorerAnalyticsDTO {
  shapes: Shape[];
}

export type BagType = 'heavy-blue' | 'heavy-red' | 'speed-blue' | 'speed-red';
export type Shape = 'circle' | 'triangle' | 'rectangle' | 'wrong' | 'hexagon';
