/** Shared by Server Actions and the client <ActionForm>. */
export type ActionState = {
  ok: boolean;
  message?: string;
  errors: Record<string, string>;
  values?: Record<string, string>;
  /** Changes on every completed submission; used to re-mount the form with the returned values. */
  nonce: number;
};

export const initialActionState: ActionState = { ok: false, errors: {}, nonce: 0 };
