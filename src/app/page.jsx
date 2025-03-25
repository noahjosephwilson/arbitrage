// src/app/home/page.jsx
import { redirect } from 'next/navigation';

export default function HomeRedirect() {
  // This server component immediately redirects to /home/explorehome.
  redirect('/landing/landingmarkets/all');
  // Return null because the component won't render anything.
  return null;
}
