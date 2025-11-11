/* eslint-disable @typescript-eslint/no-explicit-any */
import {CreditAccount} from '../types';
import {CreditInquiry, Collection, CreditAccount as ApiCreditAccount} from '../types/api';
import {parseApiPaymentHistory} from './paymentHistoryParser';

/**
 * Safely extract amount from object or number
 */
const extractAmount = (value: any): number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }
  if (typeof value === 'object' && value.amount !== undefined) {
    const amount = typeof value.amount === 'number' ? value.amount : parseFloat(value.amount);
    return isNaN(amount) ? undefined : amount;
  }
  return undefined;
};

/**
 * Map account type string to standardized CreditAccount type
 */
export const mapAccountType = (type: string): CreditAccount['type'] => {
  const typeMap: Record<string, CreditAccount['type']> = {
    // Standard formats
    creditcard: 'credit_card',
    cc: 'credit_card',
    mortgage: 'mortgage',
    homeloan: 'mortgage',
    autoloan: 'auto_loan',
    auto: 'auto_loan',
    carloan: 'auto_loan',
    personalloan: 'personal_loan',
    personal: 'personal_loan',
    studentloan: 'student_loan',
    student: 'student_loan',

    // Equifax API specific values
    revolving: 'credit_card',
    chargeaccount: 'credit_card',
    checkcreditorlineofcredit: 'credit_card',
    realestatejuniorliens: 'mortgage',
    installment: 'personal_loan',
  };

  const normalizedType = type?.toLowerCase().replace(/[_\s-]/g, '');
  return typeMap[normalizedType] || 'personal_loan'; // Default fallback
};

/**
 * Map payment status string to standardized CreditAccount status
 */
export const mapPaymentStatus = (status: string): CreditAccount['status'] => {
  const statusMap: Record<string, CreditAccount['status']> = {
    // Standard formats
    current: 'current',
    ok: 'current',
    good: 'current',
    late: 'late',
    delinquent: 'delinquent',
    closed: 'closed',

    // Map various late payment statuses to 'late'
    late_30: 'late',
    late30: 'late',
    '30_days_late': 'late',
    late_60: 'late',
    late60: 'late',
    '60_days_late': 'late',
    late_90: 'late',
    late90: 'late',
    '90_days_late': 'late',

    // Map charge-offs to delinquent
    charge_off: 'delinquent',
    chargeoff: 'delinquent',
    charged_off: 'delinquent',

    // Equifax API specific values
    paysasagreed: 'current',
    unavailable: 'current', // Treat unavailable as current for closed accounts
    late30days: 'late',
    late60days: 'late',
    late90days: 'late',
  };

  const normalizedStatus = status?.toLowerCase().replace(/[_\s-]/g, '');
  return statusMap[normalizedStatus] || 'current'; // Default to current
};

/**
 * Map API account object to CreditAccount interface
 */
export const mapApiAccountToCreditAccount = (apiAccount: any): CreditAccount => {
  // Handle the actual Equifax API structure
  const balance = apiAccount.balanceAmount?.amount || apiAccount.balance || 0;
  const creditLimit = apiAccount.creditLimitAmount?.amount || apiAccount.creditLimit || 0;
  const openDate = apiAccount.dateOpened
    ? new Date(apiAccount.dateOpened).toISOString()
    : new Date().toISOString();
  const lastPaymentDate = apiAccount.lastActivityDate
    ? new Date(apiAccount.lastActivityDate).toISOString()
    : undefined;

  // Determine account status - check accountOpen flag first, then payment status
  let accountStatus = mapPaymentStatus(
    apiAccount.accountStatus || apiAccount.paymentStatus || apiAccount.status,
  );

  // If accountOpen is false, mark as closed
  if (apiAccount.accountOpen === false) {
    accountStatus = 'closed';
  }

  // Parse payment history from API format
  const parsedPaymentHistory = parseApiPaymentHistory(apiAccount.paymentHistory);

  const minimumPaymentValue =
    extractAmount(apiAccount.minimumPayment) ?? extractAmount(apiAccount.monthlyPayment);
  const monthlyPaymentValue = extractAmount(apiAccount.monthlyPayment);

  return {
    id: apiAccount.id || apiAccount.accountId || `account_${Date.now()}`,
    name:
      apiAccount.accountName || apiAccount.creditorName || apiAccount.name || 'Unknown Creditor',
    type: mapAccountType(apiAccount.accountType || apiAccount.type || apiAccount.loanType?.code),
    accountNumber: apiAccount.accountNumber || 'N/A',
    balance: balance,
    creditLimit: creditLimit > 0 ? creditLimit : undefined,
    creditUtilization: creditLimit > 0 ? (balance / creditLimit) * 100 : undefined,
    interestRate: apiAccount.interestRate || 0,
    status: accountStatus,
    openDate: openDate,
    lastPaymentDate: lastPaymentDate,
    minimumPayment: minimumPaymentValue ?? 0,
    monthlyPayment: monthlyPaymentValue,
    paymentHistory: parsedPaymentHistory || undefined,
    isNegative: apiAccount.isNegative === true,
  };
};

/**
 * Map API inquiry object to CreditInquiry interface
 */
export const mapApiInquiryToCreditInquiry = (apiInquiry: any): CreditInquiry => {
  const date = apiInquiry.reportedDate
    ? new Date(apiInquiry.reportedDate).toISOString()
    : apiInquiry.date
      ? new Date(apiInquiry.date).toISOString()
      : new Date().toISOString();

  const creditorName =
    apiInquiry.contactInformation?.contactName ||
    apiInquiry.creditorName ||
    apiInquiry.name ||
    'Unknown Creditor';

  const type =
    apiInquiry.type?.toLowerCase() === 'hard' || apiInquiry.type?.toLowerCase() === 'soft'
      ? apiInquiry.type.toLowerCase()
      : 'hard';

  return {
    date: date,
    creditorName: creditorName,
    type: type as 'hard' | 'soft',
  };
};

/**
 * Map Equifax API personal info to our PersonalInfo interface
 */
export const mapApiPersonalInfo = (apiPersonalInfo: any): any => {
  if (!apiPersonalInfo) return null;

  // Handle new Equifax structure: providerViews[].summary.subject
  if (apiPersonalInfo.currentName) {
    // Extract name from currentName object
    const firstName = apiPersonalInfo.currentName.firstName || '';
    const lastName = apiPersonalInfo.currentName.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';

    // Extract address from currentAddress object
    const currentAddr = apiPersonalInfo.currentAddress || {};
    const street = currentAddr.line1 || 'N/A';
    const city = currentAddr.line3 || 'N/A';
    const state = currentAddr.line4 || 'N/A';
    const zipCode = currentAddr.line5 || 'N/A';
    const country = currentAddr.country?.code || 'US';

    // Extract previous addresses if available
    const previousAddresses = (apiPersonalInfo.previousAddresses || []).map((addr: any) => ({
      street: addr.line1 || 'N/A',
      city: addr.line3 || 'N/A',
      state: addr.line4 || 'N/A',
      zipCode: addr.line5 || 'N/A',
      country: addr.country?.code || 'US',
    }));

    // Extract date of birth (convert from timestamp if available)
    let dateOfBirth = 'N/A';

    // Check if dateOfBirth exists (could be 0 or negative for dates before 1970)
    if (apiPersonalInfo.dateOfBirth !== undefined && apiPersonalInfo.dateOfBirth !== null) {
      try {
        // Handle negative timestamps (dates before 1970)
        const timestamp = Number(apiPersonalInfo.dateOfBirth);

        const dobDate = new Date(timestamp);

        if (!isNaN(dobDate.getTime())) {
          dateOfBirth = dobDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
      } catch {
        // Failed to parse date of birth
      }
    }

    // Extract SSN from nationalIdentifier (already masked)
    const ssn = apiPersonalInfo.nationalIdentifier || '***-**-****';

    // Extract employment information from employmentHistory
    let employmentInfo: any;
    let previousEmployments: any[] = [];

    if (
      apiPersonalInfo.employmentHistory &&
      Array.isArray(apiPersonalInfo.employmentHistory) &&
      apiPersonalInfo.employmentHistory.length > 0
    ) {
      // Find current employer first, otherwise use the first one (latest)
      const currentEmployer = apiPersonalInfo.employmentHistory.find(
        (emp: any) => emp.currentEmployer === true,
      );
      const selectedEmployer = currentEmployer || apiPersonalInfo.employmentHistory[0];
      const isCurrent = selectedEmployer?.currentEmployer === true;

      if (selectedEmployer && selectedEmployer.employerName) {
        // Calculate years employed from dateOfEmployment if available
        let yearsEmployed = 0;
        if (selectedEmployer.dateOfEmployment) {
          try {
            const employmentDate = new Date(selectedEmployer.dateOfEmployment);
            if (!isNaN(employmentDate.getTime())) {
              yearsEmployed = employmentDate.getFullYear();
            }
          } catch {
            // Failed to parse date
          }
        }

        employmentInfo = {
          employer: selectedEmployer.employerName || 'N/A',
          position: 'N/A', // Position not available in API response
          yearsEmployed: yearsEmployed,
          isCurrent: isCurrent,
        };

        // Collect previous employments (all except the selected one)
        previousEmployments = apiPersonalInfo.employmentHistory
          .filter((emp: any) => emp !== selectedEmployer)
          .map((emp: any) => {
            let dateFormatted = 'N/A';
            if (emp.dateOfEmployment) {
              try {
                const date = new Date(emp.dateOfEmployment);
                if (!isNaN(date.getTime())) {
                  dateFormatted = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });
                }
              } catch {
                // Failed to parse date
              }
            }
            return {
              employer: emp.employerName || 'N/A',
              dateOfEmployment: emp.dateOfEmployment,
              dateFormatted: dateFormatted,
            };
          });
      }
    }

    const result = {
      fullName: fullName,
      dateOfBirth: dateOfBirth,
      ssn: ssn,
      address: {
        street: street,
        city: city,
        state: state,
        zipCode: zipCode,
        country: country,
      },
      previousAddresses: previousAddresses,
      phone: 'N/A', // Will be extracted from accounts in next step
      email: 'N/A', // Not available in this structure
      employmentInfo: employmentInfo,
      previousEmployments: previousEmployments.length > 0 ? previousEmployments : undefined,
    };

    return result;
  }

  // Handle legacy API structures
  const name = apiPersonalInfo.name || {};
  const fullName =
    apiPersonalInfo.fullName ||
    `${name.firstName || ''} ${name.middleName || ''} ${name.lastName || ''}`.trim() ||
    'Unknown';

  const addresses = apiPersonalInfo.addresses || [];
  const currentAddress = addresses[0] || {};
  const previousAddresses = addresses.slice(1, 3) || [];

  return {
    fullName: fullName,
    dateOfBirth: apiPersonalInfo.dateOfBirth || apiPersonalInfo.dob || 'N/A',
    ssn: apiPersonalInfo.ssn || apiPersonalInfo.socialSecurityNumber || '***-**-****',
    address: {
      street: currentAddress.street || currentAddress.streetAddress || 'N/A',
      city: currentAddress.city || 'N/A',
      state: currentAddress.state || currentAddress.stateCode || 'N/A',
      zipCode: currentAddress.zipCode || currentAddress.postalCode || 'N/A',
      country: currentAddress.country || 'US',
    },
    previousAddresses: previousAddresses.map((addr: any) => ({
      street: addr.street || addr.streetAddress || 'N/A',
      city: addr.city || 'N/A',
      state: addr.state || addr.stateCode || 'N/A',
      zipCode: addr.zipCode || addr.postalCode || 'N/A',
      country: addr.country || 'US',
    })),
    phone: apiPersonalInfo.phone || apiPersonalInfo.phoneNumber || 'N/A',
    email: apiPersonalInfo.email || apiPersonalInfo.emailAddress || 'N/A',
    employmentInfo: apiPersonalInfo.employment
      ? {
          employer: apiPersonalInfo.employment.employer || 'N/A',
          position:
            apiPersonalInfo.employment.position || apiPersonalInfo.employment.title || 'N/A',
          yearsEmployed: apiPersonalInfo.employment.yearsEmployed || 0,
        }
      : undefined,
  };
};

/**
 * Map Equifax API public record to our PublicRecord interface
 */
export const mapApiPublicRecord = (apiRecord: any): any => {
  // Determine record type
  let recordType = 'collection';
  if (
    apiRecord.bankruptcyType ||
    apiRecord.type?.toLowerCase().includes('bankruptcy') ||
    apiRecord.dispositionStatus
  ) {
    recordType = 'bankruptcy';
  } else if (
    apiRecord.type?.toLowerCase().includes('lien') ||
    apiRecord.type === 'State Tax Lien' ||
    apiRecord.type === 'Federal Tax Lien'
  ) {
    recordType = 'tax_lien';
  } else if (
    apiRecord.type?.toLowerCase().includes('judgment') ||
    apiRecord.type === 'Civil Judgment' ||
    apiRecord.type === 'Small Claims Judgment'
  ) {
    recordType = 'civil_judgment';
  } else if (apiRecord.type?.toLowerCase().includes('foreclosure')) {
    recordType = 'foreclosure';
  }

  // Determine status - check both dispositionStatus (for bankruptcies) and status (for liens/judgments)
  let status = 'active';
  const statusObj = apiRecord.dispositionStatus || apiRecord.status;
  let statusStr = '';

  if (typeof statusObj === 'object' && statusObj !== null) {
    // Handle object with code/description
    statusStr = (statusObj.code || statusObj.description || '').toLowerCase();
  } else {
    // Handle string status
    statusStr = (statusObj || apiRecord.status || '').toLowerCase();
  }

  if (statusStr.includes('satisfied') || statusStr.includes('paid')) {
    status = 'satisfied';
  } else if (statusStr.includes('dismissed') || statusStr.includes('discharged')) {
    status = 'dismissed';
  } else if (statusStr.includes('filed')) {
    status = 'filed';
  } else if (statusStr.includes('active')) {
    status = 'active';
  }

  // Handle filing date - can be timestamp (milliseconds) or ISO string
  let filingDate: string;
  if (apiRecord.filedDate) {
    // Check if it's a timestamp (number)
    if (typeof apiRecord.filedDate === 'number') {
      filingDate = new Date(apiRecord.filedDate).toISOString();
    } else {
      filingDate = apiRecord.filedDate;
    }
  } else {
    filingDate = apiRecord.dateFiled || apiRecord.reportedDate || new Date().toISOString();
  }

  const amount = apiRecord.amount || apiRecord.balance || apiRecord.originalAmount || 0;

  // Build description from available fields
  let description = apiRecord.description;
  if (!description) {
    const statusDesc =
      typeof statusObj === 'object' && statusObj?.description ? statusObj.description : statusStr;
    description = apiRecord.remarks || statusDesc || `${recordType.replace(/_/g, ' ')} - ${status}`;
  }

  return {
    id: apiRecord.id || `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: recordType,
    status: status,
    filingDate: filingDate,
    amount: amount > 0 ? amount : undefined,
    court: apiRecord.court || apiRecord.courtName || undefined,
    caseNumber: apiRecord.caseNumber || apiRecord.referenceNumber || undefined,
    description: description,
    expectedRemovalDate: apiRecord.removalDate || apiRecord.expectedRemovalDate || undefined,
  };
};

/**
 * Map Equifax API collection to our Collection interface
 */
export const mapApiCollectionToCollection = (apiCollection: any): Collection => {
  const reportedDate = apiCollection.reportedDate
    ? new Date(apiCollection.reportedDate).toISOString()
    : new Date().toISOString();

  const assignedDate = apiCollection.assignedDate
    ? new Date(apiCollection.assignedDate).toISOString()
    : undefined;

  const balanceDate = apiCollection.balanceDate
    ? new Date(apiCollection.balanceDate).toISOString()
    : undefined;

  const statusDate = apiCollection.statusDate
    ? new Date(apiCollection.statusDate).toISOString()
    : undefined;

  // Normalize status
  const normalizeStatus = (status: string): Collection['status'] => {
    const statusStr = (status || '').toUpperCase();
    if (statusStr.includes('PAID') || statusStr.includes('SATISFIED')) return 'PAID';
    if (statusStr.includes('SETTLED')) return 'SETTLED';
    if (statusStr.includes('DISPUTED')) return 'DISPUTED';
    if (statusStr.includes('CLOSED')) return 'CLOSED';
    return 'OPEN'; // Default to open
  };

  return {
    id: apiCollection.id || `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    creditorName: apiCollection.agencyClient || apiCollection.creditorName || 'Unknown Creditor',
    accountNumber: apiCollection.accountNumber || 'N/A',
    amount: {
      amount: apiCollection.amount?.amount || 0,
      currency: apiCollection.amount?.currency || 'USD',
    },
    status: normalizeStatus(apiCollection.status),
    reportedDate: reportedDate,
    assignedDate: assignedDate,
    balanceDate: balanceDate,
    statusDate: statusDate,
    agencyClient: apiCollection.agencyClient,
    accountDesignatorCode: apiCollection.accountDesignatorCode,
    provider: apiCollection.provider,
  };
};

/**
 * Convert parsed PaymentHistory back to API format
 */
export const convertPaymentHistoryToApiFormat = (
  paymentHistory?: CreditAccount['paymentHistory'],
): ApiCreditAccount['paymentHistory'] => {
  if (!paymentHistory || !paymentHistory.payments || paymentHistory.payments.length === 0) {
    return undefined;
  }

  const monthNames = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  // Group payments by year
  const paymentsByYear: Record<number, typeof paymentHistory.payments> = {};
  paymentHistory.payments.forEach(payment => {
    if (!paymentsByYear[payment.year]) {
      paymentsByYear[payment.year] = [];
    }
    paymentsByYear[payment.year].push(payment);
  });

  // Convert to API format
  const apiPaymentHistory: ApiCreditAccount['paymentHistory'] = [];

  Object.keys(paymentsByYear)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach(year => {
      const yearPayments = paymentsByYear[year];
      const yearData: any = {year};

      // Map each month
      monthNames.forEach((monthName, monthIndex) => {
        const payment = yearPayments.find(p => p.month === monthIndex + 1);
        if (payment) {
          // Convert status back to API format
          let monthType = 'NO_DATA';
          let value = 'NOT_REPORTED';

          if (payment.status === 'current') {
            monthType = 'POSITIVE';
            value = 'PAYS_AS_AGREED';
          } else if (payment.status === 'late') {
            monthType = 'NEGATIVE';
            value = 'LATE';
          } else if (payment.status === 'derogatory') {
            monthType = 'NEGATIVE';
            value = 'CHARGE_OFF';
          }

          yearData[monthName] = {monthType, value};
        }
      });

      apiPaymentHistory.push(yearData);
    });

  return apiPaymentHistory.length > 0 ? apiPaymentHistory : undefined;
};

/**
 * Convert CreditAccount to ApiCreditAccount for AccountTypeSection
 */
export const convertToApiCreditAccount = (account: CreditAccount): ApiCreditAccount => {
  return {
    id: account.id,
    creditorName: account.name,
    accountType: account.type,
    accountNumber: account.accountNumber || 'N/A',
    balance: account.balance,
    creditLimit: account.creditLimit,
    paymentStatus:
      account.status === 'late'
        ? 'late_30'
        : account.status === 'delinquent'
          ? 'charge_off'
          : 'current',
    openDate: account.openDate,
    lastPaymentDate: account.lastPaymentDate,
    monthsReviewed: 0, // Default value
    monthlyPayment: account.monthlyPayment,
    paymentHistory: convertPaymentHistoryToApiFormat(account.paymentHistory),
  };
};
