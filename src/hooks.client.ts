import { handleErrorWithSentry } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },

  dsn: "https://8fcdff9cb272d2481c7b4a860217c688@o4511802616578048.ingest.de.sentry.io/4511802689257552",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  tracesSampleRate: 1.0,

  // Route events through our own origin so ad blockers that block
  // *.ingest.sentry.io don't cause CORS/network failures in the browser.
  tunnel: "/monitoring",
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
