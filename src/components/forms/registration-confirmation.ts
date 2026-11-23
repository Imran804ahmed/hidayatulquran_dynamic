/**
 * Hand-off from the registration form to /registration/confirmation. The form writes this
 * sessionStorage entry only after the server confirms the registration was saved. It holds no
 * personal details: only the course, plan and preferred time the visitor chose.
 */
export const CONFIRMATION_KEY = "hq-registration-confirmation";

export type ConfirmationData = { course: string; plan: string; time: string; at: number };
