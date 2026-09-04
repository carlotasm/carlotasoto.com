import { notFound } from "next/navigation";

// Any path under a valid language that matches no page renders the localized 404.
export default function CatchAll() {
  notFound();
}
