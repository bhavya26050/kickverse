import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-4">KickVerse</h3>
            <p className="text-white/70 mb-4">
              Premium sneakers with style, comfort, and performance. Express yourself with every step.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              {["Men", "Women", "Kids", "New Arrivals", "Sale"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              {["Contact Us", "FAQs", "Shipping & Returns", "Size Guide", "Track Order"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-white/70 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Subscribe</h4>
            <p className="text-white/70 mb-4">Sign up for our newsletter to receive updates and exclusive offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-neon-purple"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-neon-purple to-neon-blue text-white px-4 py-2 rounded-r-lg"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} KickVerse. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Accessibility"].map((item) => (
              <Link key={item} href="#" className="text-white/50 hover:text-white text-sm transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

