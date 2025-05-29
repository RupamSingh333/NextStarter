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
        <header className="w-full py-6 px-6 border-b bg-indigo-600 text-white text-center shadow-md">
          <h1 className="text-4xl font-extrabold tracking-tight">My Next Starter</h1>
          <p className="mt-1 text-indigo-200">Clean & Modern Next.js Template</p>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold mb-8 leading-tight text-indigo-700">
            Welcome to My App
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mb-16">
            This is a simple and clean Next.js template. You can start building your amazing app from here.
          </p>

          {/* CI/CD Section */}
          <section className="w-full bg-indigo-50 rounded-lg p-8 shadow-md text-left">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">🚀 CI/CD Pipeline Setup</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-800">
              <li>
                <strong>Push to GitHub:</strong> Whenever you push code to the <code className="bg-gray-200 px-1 rounded">main</code> branch, the pipeline triggers.
              </li>
              <li>
                <strong>GitHub Actions Build:</strong> The pipeline installs dependencies and runs <code className="bg-gray-200 px-1 rounded">npm run build</code>. If the build fails, deployment stops automatically.
              </li>
              <li>
                <strong>Deploy to EC2:</strong> On successful build, GitHub Actions connects to your EC2 server using SSH, pulls the latest code, installs dependencies, builds again on the server, and reloads your app with <code className="bg-gray-200 px-1 rounded">pm2</code>.
              </li>
              <li>
                <strong>Public Folder Handling:</strong> Your <code className="bg-gray-200 px-1 rounded">public</code> folder contains large assets ignored by Git. These files are uploaded manually once to the EC2 server, ensuring fast git operations.
              </li>
              <li>
                <strong>Automatic Rollback:</strong> If the build or PM2 reload fails, the deployment halts preventing broken production updates.
              </li>
            </ol>
            <p className="mt-6 text-sm text-indigo-600 italic">
              * Developed by Yogesh Sir
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-4 px-6 border-t text-center text-sm text-gray-500 bg-indigo-100">
          © {new Date().getFullYear()} My App. All rights reserved.
        </footer>
      </div>
    </>
  );
}
