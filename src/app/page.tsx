import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Next Starter</title>
        <meta name="description" content="Welcome to My Next.js Starter App" />
      </Head>

      <div className="min-h-screen flex flex-col justify-between bg-white text-gray-900 font-sans">
        
        {/* Header */}
        <header className="w-full py-6 px-4 border-b bg-gray-100 text-center">
          <h1 className="text-3xl font-bold">My Next Starter</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Welcome to My App
          </h2>
          <p className="text-lg text-gray-700 max-w-xl">
            This is a simple and clean Next.js template. You can start building your amazing app from here.
          </p>
        </main>

        {/* Footer */}
        <footer className="w-full py-4 px-4 border-t text-center text-sm text-gray-500 bg-gray-100">
          © {new Date().getFullYear()} My App. All rights reserved.
        </footer>
      </div>
    </>
  );
}
