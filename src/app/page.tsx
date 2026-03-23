import { redirect } from "next/navigation";

export default function Home() {
  // Don't redirect automatically - let middleware handle it
  // Or redirect to login if you prefer
  redirect("/login");
}
