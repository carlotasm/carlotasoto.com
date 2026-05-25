"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error" | "rate_limited";

export function ContactForm({ lang }: { lang: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      const json = await res.json();
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const isFR = lang === "fr";

  if (status === "success") {
    return (
      <p className="contact-form-success">
        {isFR ? "Message reçu — Carlota vous répondra bientôt." : "Message received — Carlota will be in touch soon."}
      </p>
    );
  }

  if (status === "rate_limited") {
    return (
      <p className="contact-form-error">
        {isFR
          ? "Vous avez déjà soumis une demande récemment. Veuillez réessayer dans quelques minutes."
          : "You've already submitted a request recently. Please try again in a few minutes."}
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="checkbox" name="botcheck" style={{ display: "none" }} />
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="name">
            {isFR ? "Nom" : "Name"}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="contact-form__input"
            placeholder={isFR ? "Votre nom" : "Your name"}
            required
          />
        </div>
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="email">
            {isFR ? "Courriel" : "Email"}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="contact-form__input"
            placeholder={isFR ? "votre@email.com" : "your@email.com"}
            required
          />
        </div>
      </div>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="phone">
          {isFR ? "Téléphone" : "Phone"}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="contact-form__input"
          placeholder={isFR ? "Votre numéro" : "Your number"}
          required
        />
      </div>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="piece">
          {isFR ? "Œuvre(s) qui vous intéresse(nt)" : "Piece(s) you're interested in"}
        </label>
        <input
          id="piece"
          name="piece"
          type="text"
          className="contact-form__input"
          placeholder={isFR ? "Titre ou description" : "Title or description"}
          required
        />
      </div>
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor="message">
          {isFR ? "Message" : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          className="contact-form__textarea"
          placeholder={isFR ? "Questions, budget, délai…" : "Questions, budget, timeline…"}
          rows={5}
          required
        />
      </div>
      {status === "error" && (
        <p className="contact-form-error">
          {isFR ? "Une erreur s'est produite. Réessayez." : "Something went wrong. Please try again."}
        </p>
      )}
      <button
        type="submit"
        className="button contact-form__submit"
        disabled={status === "loading"}
      >
        {status === "loading"
          ? isFR ? "Envoi…" : "Sending…"
          : isFR ? "Envoyer" : "Send inquiry"}
      </button>
    </form>
  );
}
