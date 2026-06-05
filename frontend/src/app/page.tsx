/**
 * FILE: src/app/page.tsx
 * ROUTE: /
 * PURPOSE: Entry point. Immediately redirects to /board.
 *          Nothing is rendered here.
 */
import { redirect } from "next/navigation";
export default function RootPage() {
  redirect("/board");
}
