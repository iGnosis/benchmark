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
};
