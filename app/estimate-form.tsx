"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function EstimateForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/estimates", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "The estimate request could not be sent.");
      }

      form.reset();
      setState("success");
      setMessage("Thanks — Austin received your request and will get back to you shortly.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please call or text Austin instead.",
      );
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Estimate request sent.</h3>
        <p>{message}</p>
        <a href="tel:+13522196137">Need a faster answer? Call or text 352-219-6137.</a>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setState("idle");
            setMessage("");
          }}
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="estimate-form" onSubmit={handleSubmit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={30}
            placeholder="(904) 000-0000"
            required
          />
        </div>
      </div>

      <fieldset className="service-choice">
        <legend>Service</legend>
        <div>
          <label>
            <input name="service" type="radio" value="Pressure washing" required />
            <span>Pressure washing</span>
          </label>
          <label>
            <input name="service" type="radio" value="Paver sealing" />
            <span>Paver sealing</span>
          </label>
          <label>
            <input name="service" type="radio" value="Both" />
            <span>Both</span>
          </label>
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="propertyDetails">Property address &amp; details</label>
        <input
          id="propertyDetails"
          name="propertyDetails"
          type="text"
          autoComplete="street-address"
          maxLength={2000}
          placeholder="000 Palm Valley Rd, Ponte Vedra — driveway and pool deck"
          required
        />
      </div>

      {message && state === "error" && <p className="form-error" role="alert">{message}</p>}

      <button className="button form-submit" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending request…" : "Request my estimate"}
      </button>
      <p className="form-reassurance">Most estimates come back the same day.</p>
    </form>
  );
}
