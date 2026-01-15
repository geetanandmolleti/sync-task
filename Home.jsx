import Navbar from "../components/Navbar";
function Home({ isAuthenticated }) {
    return (
        <>
            <Navbar />

      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-center px-4">
                
      <h1 className="text-5xl font-bold mb-4">
        Manage Projects <span className="text-yellow-600">Smarter</span>
      </h1>

      <p className="text-gray-600 max-w-xl mb-8">
        SyncTask is a collaborative project management tool with real-time updates,
        drag-and-drop tasks, and team workflows.<br/>
      </p>

      {!isAuthenticated ? (
        <div className="flex gap-4">
          <a
            href="/login"
// Removed size-6 and fixed the hover syntax
className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-amber-950 transition-colors duration-200 hover:scale-120"          >
            Get Started    
          </a>
          <a
            href="/signup"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold hover:bg-amber-900 hover:text-amber-50 hover:scale-120"
          >
             Create Account
          </a>
        </div>
      ) :  (
        <a
          href="/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          Go to Dashboard
        </a>
      )}
            </div>
            </>
  );
}

export default Home;
