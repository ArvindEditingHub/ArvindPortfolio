import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Mail, Phone, Send, Loader2 } from "lucide-react";
import Magnetic from "./Magnetic";
import { Reveal, LineMask } from "./Reveal";

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success("Message sent — Arvind will get back to you soon!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Could not send right now — please email directly instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative bg-acid text-ink py-28 md:py-40 overflow-hidden" data-testid="contact-section">
      <div
        className="absolute -left-10 bottom-0 font-display font-extrabold uppercase text-[20vw] leading-none text-ink/[0.05] select-none pointer-events-none"
        aria-hidden
      >
        Hello
      </div>
      <div className="relative max-w-[90rem] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-xs tracking-[0.35em] uppercase text-ink/60 mb-6">— Contact</p>
            </Reveal>
            <LineMask
              as="h2"
              className="font-display font-extrabold uppercase tracking-tight leading-[0.92] text-5xl sm:text-6xl lg:text-8xl"
              lines={[<>Have a project</>, <>in <span className="font-serif italic font-medium normal-case">mind?</span></>]}
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-lg text-base md:text-lg text-ink/70 leading-relaxed">
                Let's create something visually powerful. Tell me about your
                brand, your idea, or your deadline — I'll take it from there.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Magnetic>
                  <a
                    href="mailto:arvindbrandsaffair@gmail.com"
                    className="group inline-flex items-center gap-3 rounded-full bg-ink text-acid font-display font-bold px-8 py-4 text-sm md:text-base hover:bg-forest hover:text-bone transition-colors duration-300"
                    data-testid="contact-start-project-btn"
                  >
                    Start a Project
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href="tel:+917234887468"
                    className="inline-flex items-center gap-3 rounded-full border-2 border-ink/30 text-ink font-display font-bold px-8 py-4 text-sm md:text-base hover:border-ink transition-colors duration-300"
                    data-testid="contact-call-btn"
                  >
                    <Phone className="w-4 h-4" /> +91 72348 87468
                  </a>
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <a
                href="mailto:arvindbrandsaffair@gmail.com"
                className="mt-10 inline-flex items-center gap-3 text-ink/70 hover:text-ink transition-colors"
                data-testid="contact-email-link"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm md:text-base font-medium">arvindbrandsaffair@gmail.com</span>
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <form
                onSubmit={submit}
                className="bg-ink text-bone rounded-3xl p-8 md:p-10 shadow-2xl shadow-ink/30 -rotate-1 hover:rotate-0 transition-transform duration-500"
                data-testid="contact-form"
              >
                <h3 className="font-display font-extrabold text-2xl tracking-tight mb-8">
                  Drop a <span className="font-serif italic font-medium text-acid">line</span>
                </h3>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="cf-name" className="text-[10px] tracking-[0.25em] uppercase text-bone/50">Your Name</label>
                    <input
                      id="cf-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Appleseed"
                      className="mt-2 w-full bg-transparent border-b border-white/20 focus:border-acid outline-none py-3 text-base placeholder:text-bone/25 transition-colors"
                      data-testid="contact-name-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-email" className="text-[10px] tracking-[0.25em] uppercase text-bone/50">Email</label>
                    <input
                      id="cf-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@brand.com"
                      className="mt-2 w-full bg-transparent border-b border-white/20 focus:border-acid outline-none py-3 text-base placeholder:text-bone/25 transition-colors"
                      data-testid="contact-email-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-message" className="text-[10px] tracking-[0.25em] uppercase text-bone/50">Project Details</label>
                    <textarea
                      id="cf-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="I need a poster series / video edit / brand kit..."
                      className="mt-2 w-full bg-transparent border-b border-white/20 focus:border-acid outline-none py-3 text-base placeholder:text-bone/25 resize-none transition-colors"
                      data-testid="contact-message-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="group w-full inline-flex items-center justify-center gap-3 rounded-full bg-acid text-ink font-display font-bold px-8 py-4 text-sm md:text-base hover:bg-bone transition-colors duration-300 disabled:opacity-60"
                    data-testid="contact-submit-btn"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
