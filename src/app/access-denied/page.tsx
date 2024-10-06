import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6 flex flex-col items-center justify-center'>
      <h1 className='text-white text-4xl font-bold mb-4'>Access Denied</h1>
      <p className='text-white mb-8'>You do not have permission to access this page.</p>
      <Link href="/" className='text-white underline'>
        Return to Home
      </Link>
    </div>
  );
}