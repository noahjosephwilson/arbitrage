import { redirect } from 'next/navigation';

export default function Home() {
  console.log("🏠 Home page loaded — redirecting to /landing");
  redirect('/landing');
}
