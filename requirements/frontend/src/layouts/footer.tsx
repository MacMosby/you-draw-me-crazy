/*

just a random generated place holder! 

to be changed and styled later with custom components 

*/

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <p className="text-sm text-textMuted">
          © {new Date().getFullYear()} Transcendence. All rights reserved.
        </p>

        {/* Right */}
        <nav className="flex gap-4 text-sm text-textMuted">
          <a
            href="/privacy"
            className="hover:text-textPrimary transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-textPrimary transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/about"
            className="hover:text-textPrimary transition-colors"
          >
            About
          </a>
        </nav>
      </div>
    </footer>
  );
}
