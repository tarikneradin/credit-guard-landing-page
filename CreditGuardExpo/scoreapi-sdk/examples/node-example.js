/**
 * Node.js Example
 * Server-side integration example
 */

const { ScoreAPIClient } = require('@stitchcredit/scoreapi-sdk');

// Initialize SDK with in-memory storage
const client = new ScoreAPIClient({
  baseURL: 'https://api.stitchcredit.com',
  customerToken: process.env.CUSTOMER_TOKEN,
  storage: 'memory', // Use in-memory storage for server-side
});

async function main() {
  try {
    console.log('=== ScoreAPI SDK - Node.js Example ===\n');

    // 1. User Login
    console.log('1. Logging in...');
    const loginResponse = await client.auth.userLogin({
      username: 'user@example.com',
      password: 'password123',
    });
    console.log('✓ Login successful');
    console.log('  User ID:', loginResponse.user.id);
    console.log('  Email:', loginResponse.user.email);
    console.log('');

    // 2. Get User Profile
    console.log('2. Getting user profile...');
    const profile = await client.user.getProfile();
    console.log('✓ Profile retrieved');
    console.log('  Email:', profile.email);
    console.log('  Enrollment ID:', profile.enrollmentId || 'Not enrolled');
    console.log('  Active:', profile.active);
    console.log('');

    // 3. Get Credit Score
    console.log('3. Getting credit score...');
    const scores = await client.score.getLatestScores();
    console.log('✓ Scores retrieved');
    console.log('  VantageScore 3.0:', scores.vantageScore3);
    console.log('  Score Date:', scores.scoreDate);
    console.log('');

    // 4. Get Score History
    console.log('4. Getting score history...');
    const history = await client.score.getScoreHistory();
    console.log('✓ Score history retrieved');
    console.log('  Total entries:', history.scores?.length || 0);
    console.log('  Trend:', history.trend);
    console.log('');

    // 5. Get Credit Report Summary
    console.log('5. Getting credit report summary...');
    const reportSummary = await client.report.getLatestReportSummary();
    console.log('✓ Report summary retrieved');
    console.log('  Total Accounts:', reportSummary.summary.totalAccounts);
    console.log('  Open Accounts:', reportSummary.summary.openAccounts);
    console.log('  Total Balance:', reportSummary.summary.totalBalance);
    console.log('  Utilization:', reportSummary.summary.utilization + '%');
    console.log('');

    // 6. Get Alerts
    console.log('6. Getting alerts...');
    const alertsData = await client.alerts.getAlerts();
    console.log('✓ Alerts retrieved');
    console.log('  Total Alerts:', alertsData.totalCount);
    console.log('  Unread Alerts:', alertsData.unreadCount);
    if (alertsData.alerts.length > 0) {
      console.log('\n  Recent alerts:');
      alertsData.alerts.slice(0, 3).forEach((alert, i) => {
        console.log(`    ${i + 1}. ${alert.title} (${alert.severity})`);
      });
    }
    console.log('');

    // 7. Get Equifax Configuration
    console.log('7. Getting Equifax configuration...');
    const config = await client.score.getEquifaxConfig();
    console.log('✓ Configuration retrieved');
    console.log('  Enrolled:', config.enrolled);
    console.log('  Features:', JSON.stringify(config.features, null, 2));
    console.log('');

    // 8. Logout
    console.log('8. Logging out...');
    await client.auth.logout();
    console.log('✓ Logout successful');
    console.log('');

    console.log('=== All operations completed successfully ===');
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);
    if (error.details) {
      console.error('Details:', error.details);
    }
    process.exit(1);
  }
}

// Customer Authentication Example
async function customerAuthExample() {
  try {
    console.log('=== Customer Authentication Example ===\n');

    // Customer Login
    console.log('1. Customer login...');
    const response = await client.auth.customerLogin({
      username: 'customer@company.com',
      password: 'password123',
    });
    console.log('✓ Customer login successful');
    console.log('  Customer ID:', response.customer.id);
    console.log('  Name:', response.customer.name);
    console.log('');

    // After customer login, you can access customer-specific endpoints
    // (not implemented in this SDK as it focuses on user endpoints)

    await client.auth.logout();
    console.log('✓ Customer logout successful');
  } catch (error) {
    console.error('Customer auth error:', error.message);
  }
}

// Direct API Authentication Example
async function directApiAuthExample() {
  try {
    console.log('=== Direct API Authentication Example ===\n');

    // Direct API Login with API Key/Secret
    console.log('1. Direct API login with API credentials...');
    const response = await client.auth.directLogin({
      apiKey: process.env.API_KEY || 'your-api-key',
      secret: process.env.API_SECRET || 'your-api-secret',
    });
    console.log('✓ Direct API login successful');
    console.log('  Access Token:', response.accessToken.substring(0, 20) + '...');
    if (response.host) {
      console.log('  Host ID:', response.host.id);
      console.log('  Host Name:', response.host.name);
    }
    console.log('');

    // After direct login, you can use Direct API endpoints
    // The token is automatically stored and used for subsequent requests

    console.log('2. Token automatically used for API calls...');
    console.log('✓ Authentication token ready for Direct API calls');
    console.log('');

    await client.auth.logout();
    console.log('✓ Direct API logout successful');
  } catch (error) {
    console.error('Direct API auth error:', error.message);
  }
}

// Identity Verification Flow Example
async function identityVerificationExample() {
  try {
    console.log('=== Identity Verification Flow ===\n');

    // 1. Login
    await client.auth.userLogin({
      username: 'newuser@example.com',
      password: 'password123',
    });

    // 2. Submit identity
    console.log('1. Submitting identity information...');
    await client.identity.submitIdentity({
      firstName: 'John',
      lastName: 'Doe',
      ssn: '123-45-6789',
      dateOfBirth: '1990-01-01',
      address: {
        street1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
    });
    console.log('✓ Identity submitted');
    console.log('');

    // 3. Get DIT challenge
    console.log('2. Getting DIT verification challenge...');
    const ditChallenge = await client.identity.getDITChallenge();
    console.log('✓ DIT challenge received');
    console.log('  Transaction ID:', ditChallenge.transactionId);
    console.log('');

    // 4. Submit DIT verification (would be done after user completes challenge)
    console.log('3. Submitting DIT verification...');
    const ditResult = await client.identity.submitDITVerification({
      challengeResponse: ditChallenge.challenge,
    });
    console.log('✓ DIT verification completed');
    console.log('  SMFA Token:', ditResult.smfaToken ? 'Received' : 'Not received');
    console.log('');

    // 5. Send SMFA link (if SMFA token received)
    if (ditResult.smfaToken) {
      console.log('4. Sending SMFA verification link...');
      const smfaLink = await client.identity.sendSMFALink(ditResult.smfaToken);
      console.log('✓ SMFA link sent');
      console.log('  Auth URL:', smfaLink.authUrl);
      console.log('  Link Token:', smfaLink.linkToken);
      console.log('');

      // User would click SMS link here...

      // 6. Verify SMFA status
      console.log('5. Verifying SMFA status...');
      const smfaStatus = await client.identity.verifySMFAStatus(smfaLink.linkToken);
      console.log('✓ SMFA verification status checked');
      console.log('  Completed:', smfaStatus.completed);
      console.log('  Enrollment ID:', smfaStatus.enrollmentId || 'Pending');
    }

    console.log('\n=== Identity verification flow completed ===');
  } catch (error) {
    console.error('Identity verification error:', error.message);
  }
}

// Run examples
if (require.main === module) {
  const example = process.argv[2] || 'main';

  switch (example) {
    case 'customer':
      customerAuthExample();
      break;
    case 'direct':
      directApiAuthExample();
      break;
    case 'identity':
      identityVerificationExample();
      break;
    default:
      main();
  }
}

module.exports = { client };
