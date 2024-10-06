import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900'>
      <h1 className='text-4xl font-bold text-white mb-4'>Access Denied</h1>
      <p className='text-white mb-8'>
        You don't have permission to access this page.
      </p>
      <Link
        href='/'
        className='bg-white text-purple-700 px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors'
      >
        Go back to Home
      </Link>
    </div>
  );
}
