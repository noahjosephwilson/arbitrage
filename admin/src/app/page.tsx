import { redirect } from 'next/navigation';

export default function HomeRedirect(): null {
  // This server component immediately redirects to /registration/login.
  redirect('/registration/login');
  // Return null because the component won't render anything.
  return null;
} 