import type { Database } from "@/lib/db/types";

type ContactRow = Database["public"]["Tables"]["contact"]["Row"];

const dateFormatter = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatTimestamp = (value: string) => {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }
  return dateFormatter.format(timestamp);
};

export function PropertyContactsList({ contacts }: { contacts: ContactRow[] }) {
  if (!contacts || contacts.length === 0) {
    return (
      <p className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Nessun messaggio ricevuto finora.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {contacts.map((contact) => (
        <article
          key={contact.id}
          className="rounded-2xl border border-border/40 bg-card/60 p-5 shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-slate-900/40"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {contact.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(contact.created_at)}
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {contact.email ?? contact.phone ?? "Contatto"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {contact.email && <span>Email: {contact.email}</span>}
            {contact.phone && <span>Telefono: {contact.phone}</span>}
          </div>
          <p
            className="mt-4 text-sm leading-relaxed text-foreground"
            style={{ whiteSpace: "pre-line" }}
          >
            {contact.message}
          </p>
        </article>
      ))}
    </div>
  );
}
