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
  GET_ALL_BENCHMARK_CONFIGS: `query GetBenchmarkConfigs {
  game_benchmark_config {
    id
    originalGameId
    createdAt
    updatedAt
    manualCalculations
    rawVideoUrl
    screenRecordingUrl
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
  }
}
`,
  GET_GAME_BENCHMARKS_FOR_CONFIG: `query GetGameBenchmarks($originalGameId: uuid!) {
  game_benchmarks(where: {originalGameId: {_eq: $originalGameId}}) {
    analytics
    createdAt
    gameId
    id
    originalGameId
    systemSpec
  }
}`,
  GET_ALL_BENCHMARKS: `query GetAllGameBenchmarks {
  game_benchmarks(order_by: {createdAt: desc}) {
    createdAt
    gameId
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
};
