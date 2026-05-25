import type { EntitlementLifecycleStatus } from './entitlement-lifecycle';

export type EntitlementState = EntitlementLifecycleStatus | 'none';

export type EntitlementTransitionCause =
  | 'webhook_grant'
  | 'webhook_payment_failed'
  | 'webhook_recovered'
  | 'webhook_paused'
  | 'webhook_cancelled'
  | 'webhook_expired'
  | 'owner_manual_test'
  | 'owner_paid_recovery'
  | 'owner_revoke'
  | 'system_expired';

export type EntitlementTransitionDecision =
  | {
      ok: true;
      kind: 'transition';
      from: EntitlementState;
      to: EntitlementLifecycleStatus;
      cause: EntitlementTransitionCause;
    }
  | {
      ok: true;
      kind: 'noop';
      from: EntitlementState;
      to: EntitlementState;
      cause: EntitlementTransitionCause;
      reason: string;
    }
  | {
      ok: false;
      kind: 'error';
      from: EntitlementState;
      to: EntitlementLifecycleStatus;
      cause: EntitlementTransitionCause;
      code: string;
      safeStatus: EntitlementState;
    };

export interface EntitlementTransitionOptions {
  recoveryReason?: string | null;
  evidenceReviewed?: boolean;
}

const transitionTable: Record<EntitlementState, Partial<Record<EntitlementLifecycleStatus, EntitlementTransitionCause[]>>> = {
  none: {
    active: ['webhook_grant'],
    trialing: ['owner_manual_test'],
    manual_recovery: ['owner_paid_recovery'],
  },
  active: {
    past_due: ['webhook_payment_failed'],
    paused: ['webhook_paused'],
    cancelled: ['webhook_cancelled'],
    expired: ['webhook_expired', 'system_expired'],
    revoked: ['owner_revoke'],
  },
  trialing: {
    expired: ['webhook_expired', 'system_expired'],
    revoked: ['owner_revoke'],
  },
  manual_recovery: {
    active: ['webhook_recovered'],
    revoked: ['owner_revoke'],
  },
  past_due: {
    active: ['webhook_recovered'],
    manual_recovery: ['owner_paid_recovery'],
    cancelled: ['webhook_cancelled'],
    expired: ['webhook_expired', 'system_expired'],
    revoked: ['owner_revoke'],
  },
  paused: {
    active: ['webhook_recovered'],
    manual_recovery: ['owner_paid_recovery'],
    cancelled: ['webhook_cancelled'],
    expired: ['webhook_expired', 'system_expired'],
    revoked: ['owner_revoke'],
  },
  cancelled: {
    active: ['webhook_recovered'],
    manual_recovery: ['owner_paid_recovery'],
    revoked: ['owner_revoke'],
  },
  expired: {
    manual_recovery: ['owner_paid_recovery'],
    revoked: ['owner_revoke'],
  },
  revoked: {},
};

function isRecoveryEvidenceValid(cause: EntitlementTransitionCause, options: EntitlementTransitionOptions) {
  if (cause !== 'owner_paid_recovery') {
    return true;
  }

  return Boolean(options.evidenceReviewed && options.recoveryReason?.trim());
}

export function decideEntitlementTransition(
  from: EntitlementState,
  to: EntitlementLifecycleStatus,
  cause: EntitlementTransitionCause,
  options: EntitlementTransitionOptions = {}
): EntitlementTransitionDecision {
  if (!isRecoveryEvidenceValid(cause, options)) {
    return {
      ok: false,
      kind: 'error',
      from,
      to,
      cause,
      code: 'paid_recovery_requires_reason_and_evidence',
      safeStatus: from,
    };
  }

  if (from === to) {
    return {
      ok: true,
      kind: 'noop',
      from,
      to,
      cause,
      reason: 'state_already_applied',
    };
  }

  if (from === 'revoked') {
    return {
      ok: false,
      kind: 'error',
      from,
      to,
      cause,
      code: 'revoked_requires_explicit_owner_reactivation',
      safeStatus: 'revoked',
    };
  }

  const allowedCauses = transitionTable[from]?.[to] ?? [];

  if (allowedCauses.includes(cause)) {
    return {
      ok: true,
      kind: 'transition',
      from,
      to,
      cause,
    };
  }

  return {
    ok: false,
    kind: 'error',
    from,
    to,
    cause,
    code: 'invalid_entitlement_transition',
    safeStatus: from,
  };
}

export function listEntitlementStateMachineTransitions() {
  return transitionTable;
}
