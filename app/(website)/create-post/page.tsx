export default function ResponsivePostEditorClone() {
  const accessOptions = [
    "All Access",
    "The Secret Library",
    "Hidden Chapters",
    "Story Vault",
    "The Reading Realm",
    "Ink Society",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_0.95fr] xl:gap-8">
          {/* Left Panel */}
          <div className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5 lg:p-6 shadow-2xl">
            {/* Top Upload Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { label: "Image", icon: "🖼️" },
                { label: "Audio", icon: "🎙️" },
                { label: "Link", icon: "🔗" },
                { label: "Attachment", icon: "📎" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121212] px-3 py-2 text-sm text-white/90 transition hover:bg-white/5"
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-sm text-white/45">
              Drop a video, audio or image file to upload, browse, or URL
            </p>

            {/* Category */}
            <div className="mt-4">
              <button className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-[#101010] px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/5">
                <span>Category</span>
                <span className="text-white/50">⌄</span>
              </button>
            </div>

            {/* Editor Area */}
            <div className="mt-5 rounded-2xl border border-white/5 bg-[#0f0f0f] p-4 sm:p-6 min-h-[420px] sm:min-h-[500px] lg:min-h-[580px]">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Title
              </h1>
              <p className="mt-8 text-xl text-white/45">Start writing...</p>
            </div>
          </div>

          {/* Right Panel */}
          <aside className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-4 sm:p-5 lg:p-6 shadow-2xl h-fit">
            <h2 className="text-3xl font-semibold tracking-tight">Audience</h2>

            <div className="mt-5 space-y-4">
              {/* Free access */}
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] p-4 transition hover:border-white/20">
                <div>
                  <div className="text-base font-medium text-white">Free access</div>
                  <p className="mt-1 text-sm leading-6 text-white/50">
                    Let everyone access this post and discover your work
                  </p>
                </div>
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#ff5a7d]">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5a7d]" />
                </div>
              </label>

              {/* Paid access */}
              <label className="block cursor-pointer rounded-2xl border border-white/10 bg-[#111111] p-4 transition hover:border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-medium text-white">Paid access</div>
                    <p className="mt-1 text-sm leading-6 text-white/50">
                      Limit access to and people who purchase this post.
                    </p>
                  </div>
                  <div className="mt-1 h-5 w-5 rounded-full border border-white/40" />
                </div>

                <div className="mt-4 space-y-3">
                  {accessOptions.map((item, index) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 text-sm text-white/75"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          index === 0
                            ? "border-[#ff5a7d] bg-[#111111]"
                            : "border-white/25 bg-transparent"
                        }`}
                      >
                        {index === 0 && (
                          <span className="h-2 w-2 rounded-[2px] bg-[#ff5a7d]" />
                        )}
                      </span>
                      <span>{item}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm text-white/65">Price of this post</label>
                  <input
                    type="text"
                    placeholder="eg: $2"
                    className="w-full rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/30"
                  />
                </div>
              </label>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
