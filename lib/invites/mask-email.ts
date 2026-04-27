export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain || !local) return "your invite email";
  return `${local.slice(0, 1)}***@${domain}`;
}
