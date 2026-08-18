const recentRequests = new Map<string, number[]>();

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRateLimited(request: Request) {
  const client = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const cutoff = now - 15 * 60 * 1000;
  const previous = (recentRequests.get(client) || []).filter((timestamp) => timestamp > cutoff);

  if (previous.length >= 5) return true;

  previous.push(now);
  recentRequests.set(client, previous);
  return false;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    if (clean(formData.get("company"), 100)) {
      return Response.json({ ok: true }, { status: 201 });
    }

    if (isRateLimited(request)) {
      return Response.json(
        { error: "Too many requests were sent recently. Please call or text Austin instead." },
        { status: 429 },
      );
    }

    const name = clean(formData.get("name"), 100);
    const phone = clean(formData.get("phone"), 30);
    const service = clean(formData.get("service"), 500);
    const address = clean(formData.get("address"), 200);

    if (!name || !phone || !service || !address) {
      return Response.json({ error: "Please complete every required field." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const recipient = process.env.LEAD_TO_EMAIL || "austin.sollenberger@gmail.com";

    if (!apiKey || !from) {
      return Response.json(
        { error: "Online requests are not connected yet. Please call or text Austin at 352-219-6137." },
        { status: 503 },
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: `New estimate request from ${name}`,
        html: `
          <h1>New Florida Orange estimate request</h1>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p><strong>Service:</strong><br>${escapeHtml(service).replaceAll("\n", "<br>")}</p>
          <p><strong>Address:</strong> ${escapeHtml(address)}</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error("Estimate notification failed", response.status);
      return Response.json(
        { error: "The request could not be sent. Please call or text Austin at 352-219-6137." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Estimate submission failed", error);
    return Response.json(
      { error: "The request could not be sent. Please call or text Austin at 352-219-6137." },
      { status: 500 },
    );
  }
}
