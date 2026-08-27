/**
 * Name of the cookie that marks a "logged in" demo session. Shared between
 * the server actions that set/clear it and the proxy that gates routes on
 * it — kept in its own file so both can import it without a cycle.
 */
export const AUTH_COOKIE_NAME = "pitchline_session";
