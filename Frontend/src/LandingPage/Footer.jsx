import React from "react";
import { Linkedin, Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-20" id="Contact">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">

        {/* App Logo & Intro */}
        <div className="sm:col-span-2 md:col-span-4 lg:col-span-2">
          <h2 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            NeuroFlow
          </h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Your intelligent companion to track, predict and improve your mood & productivity.
          </p>
        </div>

        {/* Features */}
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-2">
          <h3 className="font-semibold text-white mb-4"><pre>            Features</pre></h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-400">
            <a href="/journal" className="hover:text-indigo-400 transition-colors">Journal</a>
            <a href="/productivity" className="hover:text-indigo-400 transition-colors">Productivity</a>
            <a href="/analysis" className="hover:text-indigo-400 transition-colors">Analytics</a>
            <a href="/community" className="hover:text-indigo-400 transition-colors">Community</a>
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
             <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:neuroflow@app.com" className="hover:text-indigo-400 transition-colors block truncate">neuroflow@app.com</a>
            </li>
            <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+919876543210" className="hover:text-indigo-400 transition-colors">+91-9876543210</a>
            </li>
          </ul>
        </div>

        {/* Social / Connect */}
        <div className="md:col-span-1">
          <h3 className="font-semibold text-white mb-4">Connect</h3>
          <div className="flex space-x-4 text-gray-400">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 py-4">
            © {new Date().getFullYear()} NeuroFlow. All rights reserved.
          </div>
      </div>
    </footer>
  );
}