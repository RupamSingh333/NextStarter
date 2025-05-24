import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Welcome to My App</h1>
      </header>
      <main className="flex flex-col items-center">
        <Image
          src="/images/hero-image.png"
          alt="Hero Image"
          width={500}
          height={300}
          className="rounded-lg shadow-lg"
        />
        <p className="mt-4 text-lg text-gray-700">
          This is a simple Next.js application with a responsive layout.
        </p>
      </main>
      <footer className="text-center text-sm text-gray-500">
        © 2023 My App. All rights reserved.
      </footer>
    </div>
  );
}
