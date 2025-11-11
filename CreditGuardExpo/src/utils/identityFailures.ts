export type FailureSignals = {
  message?: string | null;
  details?: Array<string | null | undefined> | null;
  codes?: Array<string | null | undefined> | null;
  origin?: string | null;
};

type SignalHelpers = {
  hasCode: (...targets: string[]) => boolean;
  includes: (...needles: string[]) => boolean;
  bucket: string[];
  codes: string[];
};

const buildHelpers = ({message, details, codes, origin}: FailureSignals): SignalHelpers => {
  const normalizedCodes =
    codes?.filter(Boolean).map(code => code!.toString().trim().toUpperCase()) ?? [];
  const bucket =
    [
      message ?? '',
      ...(details?.filter(Boolean).map(detail => detail!.toString()) ?? []),
      ...normalizedCodes,
      origin ?? '',
    ]
      .map(entry => entry.trim().toLowerCase())
      .filter(entry => entry.length > 0) ?? [];

  const hasCode = (...targets: string[]) =>
    targets.some(target => normalizedCodes.includes(target.trim().toUpperCase()));

  const includes = (...needles: string[]) => {
    const lowered = needles.map(needle => needle.trim().toLowerCase()).filter(Boolean);
    return lowered.some(needle => bucket.some(entry => entry.includes(needle)));
  };

  return {hasCode, includes, bucket, codes: normalizedCodes};
};

export type SmfaFailureVariant =
  | 'verificationDenied'
  | 'statusMismatch'
  | 'incomplete'
  | 'thinFile'
  | 'eidMismatch'
  | 'serviceIssue'
  | 'generic';

export const classifySmfaFailure = (signals: FailureSignals): SmfaFailureVariant => {
  const helpers = buildHelpers(signals);

  if (helpers.hasCode('SC313') || helpers.includes('eid failed', 'eid failure')) {
    return 'eidMismatch';
  }

  if (
    helpers.hasCode('SC306') ||
    helpers.includes('thinfile', 'thin file', 'subject not found', 'not found')
  ) {
    return 'thinFile';
  }

  if (
    helpers.hasCode('SC324') ||
    helpers.includes('status failed', 'verification failed', 'verify failed') ||
    helpers.includes('mismatch detected')
  ) {
    return 'statusMismatch';
  }

  if (
    helpers.includes('verification denied', 'smfa verify failed: red', 'denied') ||
    helpers.hasCode('SC331')
  ) {
    return 'verificationDenied';
  }

  if (
    helpers.includes('incomplete', 'did not complete', 'pending authorization') ||
    helpers.hasCode('SC328')
  ) {
    return 'incomplete';
  }

  if (
    helpers.includes('service unavailable', 'temporarily unavailable', 'vs3', 'enrollment error') ||
    helpers.hasCode('SC323', 'SC327')
  ) {
    return 'serviceIssue';
  }

  return 'generic';
};

export type IdentityFailureVariant =
  | 'alreadyIdentified'
  | 'thinFile'
  | 'verificationFailed'
  | 'serviceIssue'
  | 'generic';

export const classifyIdentityFailure = (signals: FailureSignals): IdentityFailureVariant => {
  const helpers = buildHelpers(signals);

  if (helpers.hasCode('SC301') || helpers.includes('already verified', 'already identified')) {
    return 'alreadyIdentified';
  }

  if (
    helpers.hasCode('SC306', 'SC312') ||
    helpers.includes('thin file', 'thinfile', 'insufficient credit', 'subject not found')
  ) {
    return 'thinFile';
  }

  if (
    helpers.includes('service unavailable', 'temporarily unavailable', 'vs3') ||
    helpers.hasCode('SC323')
  ) {
    return 'serviceIssue';
  }

  if (
    helpers.includes('could not verify', 'failed', 'not match') ||
    helpers.hasCode('SC317', 'SC320', 'SC401', 'SC324')
  ) {
    return 'verificationFailed';
  }

  return 'generic';
};

export type ServiceFailureVariant =
  | 'smfaSend'
  | 'smfaVerify'
  | 'identity'
  | 'enrollment'
  | 'cooldown'
  | 'generic';

export const classifyServiceFailure = (signals: FailureSignals): ServiceFailureVariant => {
  const helpers = buildHelpers(signals);

  if (helpers.includes('cooldown', 'too early', 'wait', '30-second', 'retry later')) {
    return 'cooldown';
  }

  if (helpers.includes('enrollment', 'vs3', 'enroll')) {
    return 'enrollment';
  }

  if (
    helpers.includes('smfa', 'secure link') &&
    helpers.includes('send', 'unable to send', 'send failure', 'resend')
  ) {
    return 'smfaSend';
  }

  if (
    helpers.includes('smfa', 'secure link', 'verification') &&
    helpers.includes('verify', 'verification failure', 'verification unavailable')
  ) {
    return 'smfaVerify';
  }

  if (helpers.includes('smfa')) {
    return 'smfaVerify';
  }

  if (helpers.includes('identity', 'vendor', 'service outage')) {
    return 'identity';
  }

  return 'generic';
};

export const mapToFailureSignals = (signals?: FailureSignals | null): FailureSignals => ({
  message: signals?.message ?? undefined,
  details: signals?.details ?? undefined,
  codes: signals?.codes ?? undefined,
  origin: signals?.origin ?? undefined,
});
