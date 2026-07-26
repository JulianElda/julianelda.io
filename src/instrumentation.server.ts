import * as Sentry from "@sentry/sveltekit";

Sentry.init({
  dsn: "https://8fcdff9cb272d2481c7b4a860217c688@o4511802616578048.ingest.de.sentry.io/4511802689257552",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  tracesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});
