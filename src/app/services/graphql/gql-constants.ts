export const GqlConstants = {
  REQUEST_LOGIN_OTP: `mutation RequestLoginOtp($phoneCountryCode: String!, $phoneNumber: String!) {
    requestLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
      data {
        message
      }
    }
  }`,
  RESEND_LOGIN_OTP: `mutation ResendLoginOtp($phoneCountryCode: String!, $phoneNumber: String!) {
    resendLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber) {
      data {
        message
      }
    }
  }`,
  VERIFY_LOGIN_OTP: `mutation VerifyLoginOtp($phoneCountryCode: String!, $phoneNumber: String!, $otp: Int!) {
    verifyLoginOtp(phoneCountryCode: $phoneCountryCode, phoneNumber: $phoneNumber, otp: $otp) {
      data {
        token
      }
    }
  }`,
  GET_ALL_BENCHMARK_CONFIGS: `query GetBenchmarkConfigs($startDate: timestamptz!, $endDate: timestamptz!) {
    game_benchmark_config(order_by: {createdAt: asc}, where: {createdAt: {_gte: $startDate, _lte: $endDate}}) {
      id
      originalGameId
      createdAt
      updatedAt
      manualCalculations
      rawVideoUrl
      screenRecordingUrl
      screenRecordingUploadStatus
      rawVideoUploadStatus
      game {
        gameName: game
      }
    }
  }`,
  GET_VIDEO_UPLOAD_URLS: `mutation UploadBenchmarkVideos($benchmarkConfigId: ID!) {
  uploadBenchmarkVideos(benchmarkConfigId: $benchmarkConfigId) {
    data {
      webcamUploadUrl
      screenCaptureUploadUrl
    }
  }
}`,
  GET_BENCHMARK_CONFIG: `query GetBenchmarkConfig($benchmarkConfigId: uuid!) {
  game_benchmark_config_by_pk(id: $benchmarkConfigId) {
    id
    createdAt
    updatedAt
    screenRecordingUrl
    rawVideoUrl
    originalGameId
    manualCalculations
    game {
      game_name: game
    }
    screenRecordingUploadStatus
    rawVideoUploadStatus
  }
}
`,
  GET_GAME_BENCHMARKS_FOR_CONFIG: `query GetGameBenchmarks($originalGameId: uuid!, $startDate: timestamptz!, $endDate: timestamptz!) {
    game_benchmarks(where: {originalGameId: {_eq: $originalGameId}, createdAt: {_gte: $startDate, _lte: $endDate}}, order_by: {createdAt: desc}) {
      analytics
      createdAt
      gameId
      game {
        gameName: game
      }
      id
      originalGameId
      systemSpec
      avgAccuracy
    }
  }`,
  GET_ALL_BENCHMARKS: `query GetAllGameBenchmarks($startDate: timestamptz!, $endDate: timestamptz!) {
    game_benchmarks(order_by: {createdAt: desc}, where: {createdAt: {_gte: $startDate, _lte: $endDate}}) {
      createdAt
      gameId
      game {
        gameName: game
      }
      avgAccuracy
      id
      originalGameId
      systemSpec
    }
  }`,
  GET_GAME_ANALYTICS: `query GetGameAnalytics($gameId: uuid!) {
  game_by_pk(id: $gameId) {
    analytics
  }
}`,
  GET_RECENT_ACTIVITIES: `query GetRecentActivities($limit: Int = 10, $offset: Int = 0) {
  game(limit: $limit, order_by: {createdAt: desc}, offset: $offset, where: {endedAt: {_is_null: false}}) {
    id
    game_name: game
    patient
    patientByPatient {
      nickname
    }
    aggregate_analytics(where: {key: {_eq: "avgAchievementRatio"}}) {
      key
      value
    }
    endedAt
    createdAt
    repsCompleted
    totalDuration
  }
}`,
  INSERT_NEW_BENCHMARK_CONFIG: `mutation InsertNewBenchmarkConfig($originalGameId: uuid!) {
  insert_game_benchmark_config_one(object: {originalGameId: $originalGameId}, on_conflict: {constraint: game_benchmark_config_originalGameId_key}) {
    id
  }
}`,
  GET_CONFIG_ID: `query GetConfigId($originalGameId: uuid!) {
  game_benchmark_config(where: {originalGameId: {_eq: $originalGameId}}) {
    id
  }
}`,
  TRANSCODE_VIDEO: `mutation TranscodeVideo($benchmarkConfigId: ID!, $videoType: transcodeVideoType!) {
  transcodeVideo(benchmarkConfigId: $benchmarkConfigId, type: $videoType) {
    data {
      status
    }
  }
}`,
  SET_MANUAL_CALCULATIONS: `mutation UpdateManualCalculations($manualCalculations: jsonb!, $benchmarkConfigId: uuid!, ) {
  update_game_benchmark_config_by_pk(pk_columns: {id: $benchmarkConfigId}, _set: {manualCalculations: $manualCalculations}) {
    manualCalculations
  }
}`,
  SET_RAWVIDEO_UPLOAD_STATUS: `mutation SetRawVideoUploadStatus($benchmarkConfigId: uuid!) {
  update_game_benchmark_config(where: {id: {_eq: $benchmarkConfigId}}, _set: {rawVideoUploadStatus: true}) {
    affected_rows
  }
}`,
  SET_SCREENREC_UPLOAD_STATUS: `mutation SetScreenRecordingUploadStatus($benchmarkConfigId: uuid!) {
  update_game_benchmark_config(where: {id: {_eq: $benchmarkConfigId}}, _set: {screenRecordingUploadStatus: true}) {
    affected_rows
  }
}`,
  UPDATE_GAME_BENCHMARK_SYSTEM_CONF: `mutation UpdateBenchmarkSystemConf($gameBenchmarkId: uuid!, $systemSpec: jsonb!) {
    update_game_benchmarks_by_pk(pk_columns: {id: $gameBenchmarkId}, _set: {systemSpec: $systemSpec}) {
      id
    }
  }`
};
