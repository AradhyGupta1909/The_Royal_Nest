import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-gold-500/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 border border-gold-500 rotate-45 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-gold-500" />
              </div>
              <span className="font-display text-xl tracking-widest text-gold-400">HOTEL ARADHYA</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{color:"rgba(232,224,208,0.5)"}}>
              A haven of luxury nestled in the heart of Jaipur. Where timeless elegance meets contemporary comfort. 
              Every stay is crafted to become a cherished memory.
            </p>
            <p className="text-xs tracking-widest uppercase" style={{color:"rgba(212,160,23,0.6)"}}>
              Created by <span className="text-gold-400 font-semibold">Aradhy</span>
            </p>
            <div className="flex gap-4 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-9 h-9 glass rounded-full flex items-center justify-center hover:border-gold-500/40 transition-colors" style={{color:"rgba(232,224,208,0.5)"}}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-500 mb-5">Navigate</h4>
            <ul className="space-y-3">
              {[["Home", "/"], ["Rooms & Suites", "/rooms"], ["About Us", "/about"], ["Contact", "/contact"], ["My Bookings", "/my-bookings"]].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm hover:text-gold-400 transition-colors" style={{color:"rgba(232,224,208,0.5)"}}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold-500 mb-5">Find Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm" style={{color:"rgba(232,224,208,0.5)"}}>
                <MapPin size={15} className="text-gold-500 mt-0.5 flex-shrink-0" />
                14 Royal Palace Road, Amer, Jaipur, Rajasthan 302028
              </li>
              <li className="flex items-center gap-3 text-sm" style={{color:"rgba(232,224,208,0.5)"}}>
                <Phone size={15} className="text-gold-500 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-sm" style={{color:"rgba(232,224,208,0.5)"}}>
                <Mail size={15} className="text-gold-500 flex-shrink-0" />
                hello@hotelaradhya.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-500/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{color:"rgba(232,224,208,0.3)"}}>© 2024 Hotel Aradhya. All rights reserved.</p>
          <p className="text-xs" style={{color:"rgba(232,224,208,0.3)"}}>Built with ❤️ by <span className="text-gold-500">Aradhy</span> · MERN Stack</p>
        </div>
      </div>
    </footer>
  );
}
