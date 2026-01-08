export type BookingAvailability = {
  unavailableDates: string[];
};

type ParsedEvent = {
  start?: string;
  end?: string;
  cancelled?: boolean;
};

const unfoldLines = (content: string) => content.replace(/\r?\n[ \t]/g, "");

const formatYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseYmd = (value: string) => {
  const parts = value.split("-").map((part) => Number.parseInt(part, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const parseDateValue = (value: string) => {
  const match = value.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
};

const expandRange = (startValue: string, endValue: string, maxDays: number) => {
  const start = parseYmd(startValue);
  const end = parseYmd(endValue);
  if (!start || !end) {
    return [];
  }
  if (end <= start) {
    return [startValue];
  }

  const dates: string[] = [];
  let current = new Date(start);
  let guard = 0;
  while (current < end && guard < maxDays) {
    dates.push(formatYmd(current));
    current = addDays(current, 1);
    guard += 1;
  }
  return dates;
};

export const extractUnavailableDatesFromIcal = (
  icalText: string,
  maxDays = 730
): string[] => {
  if (!icalText.trim()) {
    return [];
  }

  const lines = unfoldLines(icalText).split(/\r?\n/);
  const unavailable = new Set<string>();
  let current: ParsedEvent | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current && !current.cancelled && current.start) {
        const endValue = current.end;
        const startDate = current.start;
        const fallbackEnd = (() => {
          const start = parseYmd(startDate);
          return start ? formatYmd(addDays(start, 1)) : startDate;
        })();
        const expanded = expandRange(
          startDate,
          endValue ?? fallbackEnd,
          maxDays
        );
        expanded.forEach((date) => unavailable.add(date));
      }
      current = null;
      continue;
    }
    if (!current) {
      continue;
    }

    if (line.startsWith("DTSTART")) {
      const value = line.slice(line.indexOf(":") + 1);
      const parsed = parseDateValue(value);
      if (parsed) {
        current.start = parsed;
      }
      continue;
    }

    if (line.startsWith("DTEND")) {
      const value = line.slice(line.indexOf(":") + 1);
      const parsed = parseDateValue(value);
      if (parsed) {
        current.end = parsed;
      }
      continue;
    }

    if (line.startsWith("STATUS") && line.includes("CANCELLED")) {
      current.cancelled = true;
    }
  }

  return Array.from(unavailable).sort();
};
