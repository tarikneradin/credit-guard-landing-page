# Test Data Overview

This document outlines the usage of specific test cases within the UAT environment, primarily leveraging `uat_identity_data.json`, `uat_vs3_data.json`, and `uat_vs3_3b_data.json`.

## UAT Environment and Stubbed Data

The UAT environment is frequently down, so we have introduced **stubbed data** to replicate Equifax responses for specific use cases, supporting both 1b and 3b reports.

### Triggering Stubbed Data Flows

To trigger demo use cases with stubbed data for 1b or 3b reports, use these specific combinations:

- **1B Report**:
  - Mobile: `555-555-1201`
  - SSN: `666-10-1000`
- **3B Report**:
  - Mobile: `555-555-1203`
  - SSN: `666-10-3000`

These specific mobile number and SSN combinations bypass the actual Equifax service calls and use predefined test data from the JSON files. This is useful for demo purposes and provides predictable responses, avoiding situations where we are doing demos and the UAT Equifax API is down.

## Triggering Test Cases

To trigger these test case flows, it is sufficient to provide the **first name** and **last name** of the corresponding test identity, in combination with a valid mobile number and SSN for the UAT environment.

**Important Note**: For UAT testing, other fields in the identity request (such as address, date of birth, etc.) are not important and can be any values. The exact test case data will be pulled from the JSON files based on the first name and last name match. Only the first name, last name, SSN, and mobile number are used for matching and flow control.

## Approve DIT Status

The following test cases from `uat_identity_data.json` are designed to produce an **Approve DIT** status:

- `test-0019` - **Allow NoChannelUAT**
- `test-0020` - **Melane McolenUAT**
- `test-0021` - **Abby CaineenUAT**
- `test-0022` - **Nolan YoungUAT**

These identities will be mapped with corresponding test cases from the enrollment suite (`uat_vs3_data.json` for 1b or `uat_vs3_3b_data.json` for 3b) based on their `referenceId` (e.g., `test-0019`, `test-0020`, etc.). Use these specific test cases if you want to achieve a successful credit report approval.

## Deny Status

To obtain a **Deny** status, use the following test cases:

- `test-0023` - **Martin SmithUAT**
- `test-0015` - **Jacob MorrisUAT**
- `test-0016` - \*\*Henry MccoolUAT`

## Review Status

To obtain a **Review** status, use the following test cases:

- `test-0018` - **Test NoChannelUAT**
- `test-0008` - **Malcolm MccoolUAT**
- `test-0009` - \*\*Lynn MccoolUAT`

## Example Datasets for Successful Flows

### Example 1: Approve DIT + SMFA Success

```json
{
  "firstName": "Allow",
  "lastName": "NoChannelUAT",
  "ssn": "666458856",
  "mobile": "555-123-0022",
  "email": "test@example.com"
}
```

### Example 2: Approve DIT + SMFA Success (Alternative)

```json
{
  "firstName": "Melane",
  "lastName": "McolenUAT",
  "ssn": "666106116",
  "mobile": "555-123-0022",
  "email": "test@example.com"
}
```

### Example 3: Deny Status + SMFA Failure

```json
{
  "firstName": "Martin",
  "lastName": "SmithUAT",
  "ssn": "666568514",
  "mobile": "555-123-0033",
  "email": "test@example.com"
}
```

### Example 4: Review Status + SMFA Incomplete

```json
{
  "firstName": "Test",
  "lastName": "NoChannelUAT",
  "ssn": "666422017",
  "mobile": "555-123-0044",
  "email": "test@example.com"
}
```

### Example 5: Stubbed Data - 1b Report

```json
{
  "firstName": "Allow",
  "lastName": "NoChannelUAT",
  "ssn": "666458856",
  "mobile": "555-123-0001",
  "email": "test@example.com"
}
```

### Example 6: Stubbed Data - 3b Report

```json
{
  "firstName": "Melane",
  "lastName": "McolenUAT",
  "ssn": "666106116",
  "mobile": "555-123-0003",
  "email": "test@example.com"
}
```

## SMFA Mobile Number Simulation

In the UAT environment, mobile numbers ending with specific digits are used to simulate different SMFA (Secure Multi-Factor Authentication) flows:

### SMFA Send Flows

- **Ends with "22"**: Simulates **DEMO SUCCESS** - Returns success response without actual SMFA URL
- **Ends with "33"**: Simulates **DEMO FAILURE** - Returns failure response
- **Ends with "44"**: Simulates **DEMO INCOMPLETE** - Returns incomplete response
- **Ends with "55"**: Simulates **DEMO THINFILE** - Returns thin file response
- **Ends with "66"**: Simulates **DEMO ENROLLMENT ERROR** - Returns enrollment error response

### SMFA Send Error Scenarios

- **Ends with "77"**: Simulates **DEMO SEND FAILURE** - Throws `SmfaSendFailedException` (SMFA send service unavailable)
- **Ends with "88"**: Simulates **DEMO SERVICE UNAVAILABLE** - Throws `IdentityServiceUnavailableException` (Identity service temporarily unavailable)

### SMFA Verification Flows

- **Ends with "22"**: Simulates **DEMO VERIFY SUCCESS** - Enrolls user and returns success
- **Ends with "33"**: Simulates **DEMO VERIFY FAILURE** - Throws `SmfaStatusFailedException` (SMFA verification failed - user denied e.green/orange status)
- **Ends with "44"**: Simulates **DEMO VERIFY INCOMPLETE** - Throws `SmfaStatusIncompleteException` (SMFA verification incomplete - user did not complete SMFA authorization e.g user didn't clicked the sms/email link)
- **Ends with "55"**: Simulates **DEMO VERIFY THINFILE** - Throws `UserThinFileException` (User has insufficient credit history)
- **Ends with "66"**: Simulates **DEMO VERIFY ENROLLMENT ERROR** - Throws `VS3UnavailableException` (Enrollment service temporarily unavailable)
- **Ends with "99"**: Simulates **DEMO VERIFY SERVICE UNAVAILABLE** - Throws `IdentityServiceUnavailableException` (Identity verification service temporarily unavailable)

### Special Mobile Numbers

- **"1111111111"**: Simulates **SMFA SERVICE FAILURE** - Throws `VS3UnavailableException` (SMFA service temporarily unavailable during verification)

### Example Usage

To test SMFA send success flow, use a mobile number ending with "22":

```
Mobile: 555-123-0022
```

To test SMFA verification failure flow, use a mobile number ending with "33":

```
Mobile: 555-123-0033
```

To test service failure simulation, use the specific mobile number:

```
Mobile: 1111111111
```

**Note**: Any mobile number not ending with these specific digits will throw an `IdentityServiceRequestException` with the message "Demo User Invalid Testcase Mobile Number".

---

creditUtilization: {

}
