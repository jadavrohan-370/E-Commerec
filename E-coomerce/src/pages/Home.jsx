import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="mx-auto w-full px-0 sm:px-0 lg:px-0">
        <div className="relative overflow-hidden rounded-none sm:rounded-xl bg-slate-900 aspect-21/9 flex items-center group">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            alt="Modern smartphone promotional banner showcasing latest features"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWshE5NZN2nBV0KlxxZ4SM9_5VHMJKiyoKm0kfJZ_vyFd4OJFCWFGCdJs5IT1589caZSlifpB9UD0iyk8PiB_PVQN_Pd9HmH7Pb8mfuFutmd0vNQQgdPYQBvetH9lwHlB9VQnXgZN3oVHOV6oTqieB6vOGAmzMpBqrdItZAbL4E-QjQTOLfT1UTfWWWXZ1dWiGzAv2kuuay8__syh7Ivpfd6yBy-goDGHSoST_ZIeoJGtyU3LhjiT8Pmb3QspinEQbdEfZWiWj9A"
          />
          <div className="relative z-10 px-12 lg:px-24">
            <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-500">
              New Arrival
            </span>
            <h2 className="mt-4 max-w-md text-4xl font-extrabold text-white lg:text-6xl">
              iPhone 15 Pro
            </h2>
            <p className="mt-4 max-w-sm text-lg text-slate-300">
              Titanium design, A17 Pro chip, and the longest optical zoom on
              iPhone.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="rounded-lg bg-orange-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-orange-600">
                Shop Now
              </button>
              <button className="rounded-lg border border-white/30 bg-white/10 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20">
                Learn More
              </button>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            <div className="h-2 w-8 rounded-full bg-orange-500"></div>
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
            <div className="h-2 w-2 rounded-full bg-white/40"></div>
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold tracking-tight">Top Categories</h3>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Link
            to="/category/mobiles"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              smartphone
            </span>
            <span className="text-sm font-semibold">Mobiles</span>
          </Link>
          <Link
            to="/category/laptops"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              laptop_mac
            </span>
            <span className="text-sm font-semibold">Laptops</span>
          </Link>
          <Link
            to="/category/tvs"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              tv
            </span>
            <span className="text-sm font-semibold">TVs</span>
          </Link>
          <Link
            to="/category/audio"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              headphones
            </span>
            <span className="text-sm font-semibold">Audio</span>
          </Link>
          <Link
            to="/category/cameras"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              camera
            </span>
            <span className="text-sm font-semibold">Cameras</span>
          </Link>
          <Link
            to="/category/home"
            className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <span className="material-symbols-outlined text-4xl text-orange-500">
              kitchen
            </span>
            <span className="text-sm font-semibold">Home</span>
          </Link>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="bg-orange-500/5 py-16 dark:bg-orange-500/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight">
              Featured Deals
            </h3>
            <Link
              className="text-sm font-semibold text-orange-500 hover:underline"
              to="/search?sort=discount"
            >
              View All
            </Link>
          </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Product Card 1 */}
            <div className="group relative flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-lg dark:bg-slate-900">
              <span className="absolute left-4 top-4 z-10 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-tighter">
                20% OFF
              </span>
              <Link to="/products" className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  alt="Premium smart watch with silicon strap"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRGbAe5OFwc0xgIc6TaKsOdYBa_K9bB1bVIl8f2tHwSbebKNhld7bbalpzzHzgIn_uefMIb0YKRzBmtbQa8XanTsacsRejUY2EpqwTqbG0QKTNb5wiYqKTR-Pxb3x4jSIG-fVQJB2T5CMXE1trf79qI0EhQCAk9lV-T1rJ3qeaGn-ZvBR0A2Bb4puokpks_RNv_gZpY8x-dSqIA0aF9y2JEusZE0xsxHseENDzZzPbEpe9LJXisPFR0MGHVsHYYnOicjsr3XO-Uw"
                />
              </Link>
              <h4 className="mt-4 text-sm font-medium line-clamp-2">
                <Link to="/products" className="hover:text-orange-500">
                  Premium Smart Watch Series 8 GPS + Cellular
                </Link>
              </h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold">₹24,999</span>
                <span className="text-xs text-slate-500 line-through">
                  ₹31,249
                </span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>

            {/* Product Card 2 */}
            <div className="group relative flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-lg dark:bg-slate-900">
              <span className="absolute left-4 top-4 z-10 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-tighter">
                15% OFF
              </span>
              <Link to="/products" className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  alt="Professional wireless over-ear noise cancelling headphones"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWcHhWbb_omPEywggt8A8S5rZoAvGe3ZVCE0r4rczmgMfKszR5gPZVMnI1CqmJ_ybVR8J-qAObRjksw5L6FCE_PSRBC3em9wTnTl1nGXKUp4SaAQBX32ZxaGu-sSWga6UCMtGK8HjbX3u3BVWhDwr9ey6IsWBC9YieGUxOPOHh9S9SEQdAQ_ySLQ5R5duuj4urOo8ICbbCMbiJmrsQunGb4-vbnqqDSG6tYphPaZZXdXHjW2HlyjerVoKbN6oTa7esOUvuIH2JFw"
                />
              </Link>
              <h4 className="mt-4 text-sm font-medium line-clamp-2">
                <Link to="/products" className="hover:text-orange-500">
                  Noise Cancelling Wireless Headphones v2
                </Link>
              </h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold">₹12,499</span>
                <span className="text-xs text-slate-500 line-through">
                  ₹14,705
                </span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>

            {/* Product Card 3 */}
            <div className="group relative flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-lg dark:bg-slate-900">
              <span className="absolute left-4 top-4 z-10 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-tighter">
                10% OFF
              </span>
              <Link to="/products" className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  alt="Sleek silver laptop with high resolution screen"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuALYUzeBjlPLmmF3pl0-Ndrbbm7kQ8GCScDdOf6SWMPEyN1unKEPpThdypzul6CrfvP4vwvkZhzrrdBbjFhViaPdK-dojhaokGc7y7emcH7USni8U27Xmkq8pjktws4rd25zL3N1ETpdotUKS9x4FvyjJpxziPAcLleRQKOY9zqWgI5XcyeIE0-rVjPwsLgGH_SpeXPQCOb8hdfLnBMgNelXBf-cLXCsdhB6EXCGju5ZQaLyEI9o9lNxkVPmBfeX3NAiqvwonEaZw"
                />
              </Link>
              <h4 className="mt-4 text-sm font-medium line-clamp-2">
                <Link to="/products" className="hover:text-orange-500">
                  Ultra-Thin 14" Business Laptop M1 Pro
                </Link>
              </h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold">₹89,990</span>
                <span className="text-xs text-slate-500 line-through">
                  ₹99,990
                </span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>

            {/* Product Card 4 */}
            <div className="group relative flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:shadow-lg dark:bg-slate-900">
              <span className="absolute left-4 top-4 z-10 rounded bg-red-500 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-tighter">
                30% OFF
              </span>
              <Link to="/products" className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  alt="Smart OLED TV displaying colorful abstract graphics"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbumMlN_Pwrs1Za0MIxXtFVXvAYkD-NwFwrPuOrwd3TY_M0JI5eKp_y31wPvgKQOK_LreUPT3gqs3PHnrixsY03xXB8_ojVsS3-XyWU9abxElM_-GEfX61urOm3UJuFUlTc3qIjQP4_3wkJrEnkpeb3HD0qoklld9FrUmz6a8OtJOMrwFjNY4sb6HjuaQqTIYLw3y_5CK5ToAgj4fRvixGc_68nGbLrVUrRS2eA_Vv34KPUAwGTgwTV03hc0Uqudu9m_BmVWGQdA"
                />
              </Link>
              <h4 className="mt-4 text-sm font-medium line-clamp-2">
                <Link to="/products" className="hover:text-orange-500">
                  55" Crystal 4K UHD Smart TV (2023 Model)
                </Link>
              </h4>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold">₹44,990</span>
                <span className="text-xs text-slate-500 line-through">
                  ₹64,270
                </span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-orange-500 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Trending Now</h3>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 dark:border-slate-800 dark:bg-slate-900">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
          <div className="no-scrollbar mt-8 flex gap-6 overflow-x-auto pb-4">
          <div className="min-w-[280px] flex-shrink-0 flex flex-col items-center text-center">
            <Link to="/products" className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-slate-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-orange-300 transition-colors">
              <img
                className="h-full w-full object-cover"
                alt="Gaming headphones with RGB lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCM_rfrPl7ry8E4Tjxgcw9KE1HZjvpVzxr7HW2eP7LM_t_ReY4cd1kAIeGexSWHFhqIA_V7a7j7Vt5Ve1E1Um_erEeZr-F0BGV0BBJWT7kid8h5DNVjL9XYtxcFhk4ZBmqmK-Df3b4S4Rdvk8Q_rKBfqQ-SwV5sObpr9zqoxbWExD2Zty2jj7nvRsQfPCQ4BbGrDL2SiiZUSSNbafnhA8JjGDgE0MeoLWOjMRHxp5zzmIkEoIYxeXqfM1RoHpIpjygp4QSMkAbE5g"
              />
            </Link>
            <h4 className="mt-4 font-bold uppercase tracking-widest text-xs text-orange-500">
              Gaming Pro
            </h4>
            <Link to="/products" className="mt-1 font-semibold hover:text-orange-500">Gamer X-200 Headset</Link>
          </div>
          <div className="min-w-[280px] flex-shrink-0 flex flex-col items-center text-center">
            <Link to="/products" className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-slate-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-orange-300 transition-colors">
              <img
                className="h-full w-full object-cover"
                alt="Digital tablet with stylus pen"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU4TCsw9xBLarkawUNIHYvyv1QSFQivbxGqq0L2KKOGqpq1pQyYi-IA_SbVAZ_RFZQ7jwDABGGKfu0WULHTHEEk6FDiBd1WV9q_IBTmKmFtz00BbaTUoar17TCDCa0xdK2nvdcjFJ52KiTxwyapPxSKOTmoJhm-ENZS3a1YHx6-III-gnyh-tASdi-F_rykS0DAClVboAxa_1-pVRM0kVcpCG6Lfj-_9iCYN-oo_jXJ1TtHSFXgnckXQdeEFi_drm1wx3ghtIZ0Q"
              />
            </Link>
            <h4 className="mt-4 font-bold uppercase tracking-widest text-xs text-orange-500">
              Creativity
            </h4>
            <Link to="/products" className="mt-1 font-semibold hover:text-orange-500">Pro Tab 12.9 with Stylus</Link>
          </div>
          <div className="min-w-[280px] flex-shrink-0 flex flex-col items-center text-center">
            <Link to="/products" className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-slate-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-orange-300 transition-colors">
              <img
                className="h-full w-full object-cover"
                alt="Mechanical gaming keyboard with backlit keys"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5bb2wPy8Pg-7YPT2-Rb0lA6Uyw-E9iCQDecdGUn2vSluawQTz36Qlwkf7ZKHId6ltgHKnwFFV-UZHLOThlOgh8CPKObGvJ5Y337YZ00Dmu7SAHApa__dV9J6vSzAHPlruCBW3WmTrCJ29QJGUbXLNBeLcfBIldO6jKUg3Vx_5SsSTE7tbIKnHnvdoyQrI9PyNkVFUbYAaU93g-YcU453OEgyot-dNqcCaF4JyWed4A3_nfAY4paYuKGcYGUAAg0YPU6eBDBm0eQ"
              />
            </Link>
            <h4 className="mt-4 font-bold uppercase tracking-widest text-xs text-orange-500">
              Essentials
            </h4>
            <Link to="/products" className="mt-1 font-semibold hover:text-orange-500">Mechanical Clicky Keyboard</Link>
          </div>
          <div className="min-w-[280px] flex-shrink-0 flex flex-col items-center text-center">
            <Link to="/products" className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-slate-50 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-orange-300 transition-colors">
              <img
                className="h-full w-full object-cover"
                alt="Digital point and shoot camera"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBixtILqOn5bttwEfy1KpZXQA2b2WI8Wc8h4LApkKtVzW3mynpK-W1uLgHQjYt9W3uz3pPYGZnaqPMdd_c2yCtUOJsYN5pTuDM9ENiiqlxEchgTsTcWXxipUeOQ19wMJJN58uwqUAF5PkXDy5ZRN1fs4QMZFSJ0JKL-7aqEWN1TLfMRoPckolYBd6L-s4jQDF6YgnymVObOxkyVhMRdqrKgWj45dNsm52RSSkQUmWO68Nck8_e3jRuqtw9dCPwD68AQEUD4afhXpg"
              />
            </Link>
            <h4 className="mt-4 font-bold uppercase tracking-widest text-xs text-orange-500">
              Photography
            </h4>
            <Link to="/products" className="mt-1 font-semibold hover:text-orange-500">L-Series Mirrorless Camera</Link>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-center text-lg font-bold text-slate-500 uppercase tracking-widest">
          Featured Brands
        </h3>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <Link to="/search?brand=apple" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">ios</span>
            <span className="text-2xl font-bold">Apple</span>
          </Link>
          <Link to="/search?brand=samsung" className="flex items-center gap-2">
            <span className="text-2xl font-bold">SAMSUNG</span>
          </Link>
          <Link to="/search?brand=sony" className="flex items-center gap-2">
            <span className="text-2xl font-bold italic">SONY</span>
          </Link>
          <Link to="/search?brand=bose" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">BOSE</span>
          </Link>
          <Link to="/search?brand=dell" className="flex items-center gap-2">
            <span className="text-2xl font-bold">DELL</span>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-navy-custom p-8 text-center sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white">
              Join our newsletter
            </h3>
            <p className="mt-4 text-slate-400">
              Get the latest deals, reviews, and tech news delivered to your
              inbox.
            </p>
            <form className="mx-auto mt-8 flex max-w-md gap-2">
              <input
                className="w-full rounded-lg border-none bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                required
                type="email"
              />
              <button
                className="rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

