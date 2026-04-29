import { redirect } from 'next/navigation';

// Root page just redirects to the login page
export default function Home() {
  redirect('/login');
}
