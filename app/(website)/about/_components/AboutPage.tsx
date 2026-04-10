import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const formats = [
  {
    icon: "✦",
    title: "Blogs & Articles",
    desc: "Short-form thoughts, essays, and commentary.",
  },
  {
    icon: "✦",
    title: "Novels & Fiction",
    desc: "Long-form stories, serialized or complete.",
  },
  {
    icon: "✦",
    title: "Comics",
    desc: "Visual storytelling in any style or format.",
  },
  {
    icon: "✦",
    title: "Video",
    desc: "Narrative video content for every audience.",
  },
];

const earningModels = [
  {
    num: "01",
    title: "One-off pieces",
    desc: "Single posts or standalone stories readers can purchase or tip on.",
  },
  {
    num: "02",
    title: "Ongoing series",
    desc: "Serialized stories with recurring reader support — subscriptions or per-chapter access.",
  },
  {
    num: "03",
    title: "Short-form content",
    desc: "Quick essays, poems, or micro-fiction that still deserve to be valued.",
  },
  {
    num: "04",
    title: "Long-form works",
    desc: "Full novels, extended comics, or documentary-style videos — properly supported.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen  text-[#1a1a1a] font-sans">
      {/* ── Hero ── */}
      <section className="max-w-2xl mx-auto px-6 pt-7 pb-16 text-center">
        <Badge
          variant="outline"
          className="mb-6 text-[0.65rem] tracking-[0.12em] uppercase text-[#9e9b94] border-[#d4d1c8] bg-transparent font-normal"
        >
          About Publypost
        </Badge>
        <h1
          className="text-4xl md:text-5xl font-medium leading-[1.2] tracking-tight text-[#1a1a1a] mb-6"
          style={{ fontFamily: "'Lora', serif" }}
        >
          A place built for{" "}
          <em className="italic text-[#6b6860] not-italic" style={{ fontStyle: "italic" }}>
            stories
          </em>{" "}
          worth telling
        </h1>
        <p className="text-[1.0625rem] text-[#5c5954] leading-[1.75] font-light max-w-lg mx-auto">
          Publypost is a platform where writers share blogs, novels, comics, and
          videos — and readers find the stories they&apos;ve been looking for.
        </p>
      </section>

      <div className="flex justify-center">
        <div className="w-10 h-px bg-[#d4d1c8]" />
      </div>

      {/* ── Main content ── */}
      <main className="max-w-[620px] mx-auto px-6 mt-16 space-y-16">

        {/* What we are */}
        <section>
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#b0ada5] font-medium block mb-3">
            What we are
          </span>
          <h2
            className="text-2xl font-medium text-[#1a1a1a] mb-4 leading-snug"
            style={{ fontFamily: "'Lora', serif" }}
          >
            More than a publishing tool
          </h2>
          <p className="text-base text-[#5c5954] leading-[1.8] font-light mb-8">
            At its core, Publypost is a story monetization platform. We believe
            writers deserve to earn from their craft — whether that&apos;s a single
            standalone piece or an ongoing series that keeps readers coming back.
            Every format, every length, every genre is welcome here.
          </p>

          {/* Format grid */}
          <div className="grid grid-cols-2 border border-[#e0ddd6] rounded-xl overflow-hidden gap-px bg-[#e0ddd6]">
            {formats.map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#faf9f6] p-5">
                <span className="text-lg text-[#1a1a1a] block mb-2">{icon}</span>
                <h3
                  className="text-[0.9375rem] font-medium text-[#1a1a1a] mb-1"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {title}
                </h3>
                <p className="text-[0.8125rem] text-[#9e9b94] leading-[1.6]">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* No ads */}
        <section>
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#b0ada5] font-medium block mb-3">
            Our philosophy
          </span>
          <h2
            className="text-2xl font-medium text-[#1a1a1a] mb-5 leading-snug"
            style={{ fontFamily: "'Lora', serif" }}
          >
            No ads. Ever.
          </h2>

          {/* Blockquote */}
          <blockquote className="border-l-2 border-[#1a1a1a] pl-6 mb-5">
            <p
              className="text-[1.125rem] text-[#3a3836] leading-[1.75] italic"
              style={{ fontFamily: "'Lora', serif" }}
            >
              &quot;I take a small cut of what writers earn on this platform. That
              revenue goes back into keeping Publypost running —{" "}
              <strong className="font-medium not-italic">
                without ever involving advertisers.
              </strong>
              &quot;
            </p>
          </blockquote>

          <p className="text-base text-[#5c5954] leading-[1.8] font-light">
            The model is simple: when writers do well, the platform does well.
            There are no third-party advertisers, no sponsored content, no hidden
            agendas. Just stories and the people who love them.
          </p>
        </section>

        {/* How writers earn */}
        <section>
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#b0ada5] font-medium block mb-3">
            How writers earn
          </span>
          <h2
            className="text-2xl font-medium text-[#1a1a1a] mb-5 leading-snug"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Income for every kind of storyteller
          </h2>
          <p className="text-base text-[#5c5954] leading-[1.8] font-light mb-6">
            Publypost supports multiple ways for writers to earn, regardless of
            how they prefer to publish.
          </p>

          <div>
            {earningModels.map(({ num, title, desc }, i) => (
              <div key={num}>
                {i === 0 && <Separator className="bg-[#e8e5de]" />}
                <div className="flex items-start gap-5 py-5">
                  <span
                    className="text-sm text-[#b0ada5] min-w-[1.5rem] pt-0.5"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {num}
                  </span>
                  <div>
                    <h4 className="text-[0.9375rem] font-medium text-[#1a1a1a] mb-1">
                      {title}
                    </h4>
                    <p className="text-[0.8125rem] text-[#9e9b94] leading-[1.6]">
                      {desc}
                    </p>
                  </div>
                </div>
                <Separator className="bg-[#e8e5de]" />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Sign-off ── */}
      <section className="max-w-sm mx-auto px-6 text-center">
        <p
          className="text-[1.125rem] text-[#5c5954] leading-[1.8] italic mb-8"
          style={{ fontFamily: "'Lora', serif" }}
        >
          &quot;I hope this website brings you the stories — or the fans — you&apos;ve
          been searching for.&quot;
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            asChild
            className="rounded-full bg-[#1a1a1a] text-[#faf9f6] hover:bg-[#333] px-6"
          >
            <Link href="/">Start reading</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#c8c5bc] text-[#5c5954] hover:border-[#1a1a1a] hover:text-[#1a1a1a] bg-transparent px-6"
          >
            <Link href="/signin">Become a writer</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}