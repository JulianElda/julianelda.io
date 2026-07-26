import type { RequestHandler } from "./$types";

const SENTRY_HOST = "o4511802616578048.ingest.de.sentry.io";
const SENTRY_PROJECT_IDS = new Set(["4511802689257552"]);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const envelopeBytes = await request.text();
    const [header] = envelopeBytes.split("\n");
    const dsn = new URL(JSON.parse(header).dsn);
    const projectId = dsn.pathname.replace("/", "");

    if (dsn.hostname !== SENTRY_HOST) {
      throw new Error(`Invalid sentry hostname: ${dsn.hostname}`);
    }

    if (!SENTRY_PROJECT_IDS.has(projectId)) {
      throw new Error(`Invalid sentry project id: ${projectId}`);
    }

    const response = await fetch(
      `https://${SENTRY_HOST}/api/${projectId}/envelope/`,
      {
        body: envelopeBytes,
        method: "POST",
      },
    );

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
    });
  } catch {
    // oxlint-disable-next-line unicorn/no-null
    return new Response(null, { status: 500 });
  }
};
