import { formatDistanceToNow, isValid, parseISO } from "date-fns";

const resolveDate = (value?: string | number | null) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    const dateFromNumber = new Date(value);
    return isValid(dateFromNumber) ? dateFromNumber : null;
  }

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    const num = Number(trimmed);
    const millis = trimmed.length === 10 ? num * 1000 : num;
    const dateFromNumber = new Date(millis);
    return isValid(dateFromNumber) ? dateFromNumber : null;
  }

  const parsedIso = parseISO(trimmed);
  if (isValid(parsedIso)) return parsedIso;

  const fallback = new Date(trimmed);
  return isValid(fallback) ? fallback : null;
};

export const formatRelativeTime = (value?: string | number | null) => {
  const date = resolveDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true }) : "";
};
