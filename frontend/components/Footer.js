import React from 'react'

export default function Footer() {
  return (
      <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p>© 2024 ShopSmart. All rights reserved.</p>
              <div className="flex justify-center space-x-6 mt-4">
                  <a href="#" className="hover:text-cyan-400 transition-colors">About Us</a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
                  <span className="text-gray-600">|</span>
                  <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              </div>
          </div>
      </footer>  )
}
