"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export const LandingContactForm = () => {
  const [isSending, startSending] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startSending(async () => {
      try {
        const response = await fetch("/api/landing-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.error || "Invio non riuscito");
        }

        toast.success("Messaggio inviato, ti ricontatteremo presto");
        setName("");
        setEmail("");
        setMessage("");
      } catch (error) {
        toast.error("Errore durante l'invio del messaggio");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Il tuo nome"
          className="h-12 rounded-2xl border border-border bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="La tua email"
          className="h-12 rounded-2xl border border-border bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <textarea
        name="message"
        placeholder="Raccontaci della tua struttura e di cosa ti serve"
        className="min-h-[140px] w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        required
      />
      <Button type="submit" size="lg" disabled={isSending}>
        {isSending ? "Invio in corso..." : "Richiedi una demo"}
      </Button>
    </form>
  );
};
