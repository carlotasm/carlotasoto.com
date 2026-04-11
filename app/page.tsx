import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";
  // Match the first language tag that starts with "fr" (fr, fr-CA, fr-FR…).
  const prefersFrench = /(^|,)\s*fr\b/i.test(acceptLanguage);
  redirect(prefersFrench ? "/fr" : "/en");
}
