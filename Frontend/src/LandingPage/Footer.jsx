import React from "react";

export default function Footer() {
  return (
    <footer className="text-gray-100 bg-gray-800 mt-20" id="Contact">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* App Logo & Intro */}
        <div>
          <h2 className="text-xl font-semibold text-[#838beb] mb-2">
            NeuroFlow
          </h2>
          <p className="text-sm">
            Your intelligent companion to track, predict and improve mood &
            productivity.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-2">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-indigo-600">
                Home
              </a>
            </li>
            <li>
              <a href="/journal" className="hover:text-indigo-600">
                Journal
              </a>
            </li>
            <li>
              <a href="/productivity" className="hover:text-indigo-600">
                Productivity
              </a>
            </li>
            <li>
              <a href="/how-it-works" className="hover:text-indigo-600">
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">neuroflow@app.com</p>
          <p className="text-sm mt-1">+91-9876543210</p>
        </div>

        {/* Social / Connect */}
        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <div className="flex space-x-4 text-gray-600">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.7v2.3h.1c.7-1.2 2.4-2.5 4.9-2.5 5.2 0 6.2 3.4 6.2 7.9V24h-5v-6.9c0-1.7 0-3.9-2.4-3.9s-2.8 1.8-2.8 3.8V24h-5V8z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.88a.88.88 0 1 1 0 1.75.88.88 0 0 1 0-1.75z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.68 0H1.32C.593 0 0 .593 0 1.32v21.36C0 23.407.593 24 1.32 24h11.49v-9.294H9.692V11.12h3.118V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.586h-3.123V24h6.116c.727 0 1.32-.593 1.32-1.32V1.32C24 .593 23.407 0 22.68 0z" />
              </svg>
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.95 4.57a10 10 0 0 1-2.83.78 4.93 4.93 0 0 0 2.16-2.71c-.94.56-1.98.97-3.07 1.2a4.92 4.92 0 0 0-8.4 4.48A13.94 13.94 0 0 1 1.67 3.15a4.92 4.92 0 0 0 1.52 6.56 4.93 4.93 0 0 1-2.23-.61v.06a4.92 4.92 0 0 0 3.95 4.83 4.93 4.93 0 0 1-2.22.08 4.93 4.93 0 0 0 4.6 3.42A9.87 9.87 0 0 1 0 19.54 13.94 13.94 0 0 0 7.55 21.5c9.06 0 14.01-7.5 14.01-14.01 0-.21 0-.42-.02-.63A10.02 10.02 0 0 0 24 4.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-gray-100 bg-gray-800 text-center text-sm py-4">
        © {new Date().getFullYear()} NeuroFlow. All rights reserved.
      </div>
    </footer>
  );
}
