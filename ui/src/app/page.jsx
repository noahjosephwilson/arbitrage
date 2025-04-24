'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 Redirecting to /landing");
    router.push('/landing');
  }, [router]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
