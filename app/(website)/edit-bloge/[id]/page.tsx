"use client";

import dynamic from "next/dynamic";
import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type MediaItem = { file: File; url: string };

type BlogDetails = {
  _id: string;
  image?: string[];
  audio?: string[];
  attachment?: string[];
  category?: string;
  title?: string;
  content?: string;
  audienceType?: "free" | "paid";
  price?: number;
  link?: string;
};

const categoryOptions = [
  "Fantasy",
  "Romance",
  "Sci-Fi",
  "Mystery",
  "Thriller",
  "Horror",
  "Adventure",
  "Drama",
  "Historical",
  "Young Adult",
];

const getPlainText = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export default function EditBlogePage({ params }: { params: { id: string } }) {
  const blogId = params?.id;
  const { data: session, status } = useSession();
  const token = session?.user?.accessToken;
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [link, setLink] = useState("");
  const [audienceType, setAudienceType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<MediaItem[]>([]);
  const [audios, setAudios] = useState<MediaItem[]>([]);
  const [attachments, setAttachments] = useState<MediaItem[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingAudios, setExistingAudios] = useState<string[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<MediaItem[]>([]);
  const audiosRef = useRef<MediaItem[]>([]);
  const attachmentsRef = useRef<MediaItem[]>([]);

  const handleOpenLink = () => {
    setIsLinkOpen(true);
    setTimeout(() => linkInputRef.current?.focus(), 0);
  };

  const uploadActions = [
    { label: "Image", icon: "🖼️", onClick: () => imageInputRef.current?.click() },
    { label: "Audio", icon: "🎙️", onClick: () => audioInputRef.current?.click() },
    { label: "Link", icon: "🔗", onClick: handleOpenLink },
    { label: "Video", icon: "🎥", onClick: () => attachmentInputRef.current?.click() },
  ];

  const { data: blogData, isLoading, isError, error } = useQuery({
    queryKey: ["blog", blogId],
    enabled: status !== "loading" && Boolean(blogId && token),
    queryFn: async (): Promise<BlogDetails> => {
      const response = await fetch(`${baseURL}/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to load blog");
      }
      return (payload?.data ?? payload) as BlogDetails;
    },
  });

  useEffect(() => {
    if (!blogData || isInitialized) return;
    setSelectedCategory(blogData.category ?? null);
    setBody(blogData.content ?? "");
    setAudienceType(blogData.audienceType ?? "free");
    setPrice(blogData.price ? String(blogData.price) : "");
    setLink(blogData.link ?? "");
    setIsLinkOpen(Boolean(blogData.link));
    setExistingImages(Array.isArray(blogData.image) ? blogData.image : []);
    setExistingAudios(Array.isArray(blogData.audio) ? blogData.audio : []);
    setExistingAttachments(
      Array.isArray(blogData.attachment) ? blogData.attachment : []
    );
    setIsInitialized(true);
  }, [blogData, isInitialized]);

  const hasImage =
    /<img\s/i.test(body) || images.length > 0 || existingImages.length > 0;

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  const editorStyle = {
    "--editor-min-height": hasImage ? "300px" : "520px",
  } as CSSProperties;

  const createMediaItems = (files: FileList | null): MediaItem[] => {
    if (!files || files.length === 0) return [];
    return Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  };

  const revokeMediaItems = useCallback((items: MediaItem[]) => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const handleFileSelect = (
    files: FileList | null,
    setter: Dispatch<SetStateAction<MediaItem[]>>
  ) => {
    const newItems = createMediaItems(files);
    if (!newItems.length) return;
    setter((prev) => [...prev, ...newItems]);
  };

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    audiosRef.current = audios;
  }, [audios]);

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      revokeMediaItems(imagesRef.current);
      revokeMediaItems(audiosRef.current);
      revokeMediaItems(attachmentsRef.current);
    };
  }, [revokeMediaItems]);

  const handleSubmit = async () => {
    const plainText = getPlainText(body);

    if (!token) {
      toast.error("Missing auth token");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (audienceType === "paid" && !price.trim()) {
      toast.error("Please add a price");
      return;
    }

    const hasPayload =
      plainText.length > 0 ||
      images.length > 0 ||
      audios.length > 0 ||
      attachments.length > 0 ||
      link.trim().length > 0;

    if (!hasPayload) {
      toast.error("Please add content or media");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      images.forEach((item) => formData.append("image", item.file));
      audios.forEach((item) => formData.append("audio", item.file));
      attachments.forEach((item) => formData.append("attachment", item.file));

      if (link.trim()) formData.append("link", link.trim());
      formData.append("category", selectedCategory);
      formData.append(
        "title",
        plainText.slice(0, 80) || blogData?.title || "Untitled"
      );
      formData.append("content", body);
      formData.append("audienceType", audienceType);
      if (audienceType === "paid" && price.trim()) {
        formData.append("price", price.trim());
      }

      const response = await fetch(`${baseURL}/blog/${blogId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Failed to update post");
      }

      toast.success(data?.message || "Post updated successfully");
      router.push(`/dashboard?tab=${encodeURIComponent("My blogs")}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== "loading" && !token) {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-[#2c2c2c] dark:text-white">
        Please login to edit your blog.
      </div>
    );
  }

  if (!blogId) {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-red-500">
        Invalid blog id.
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-red-500">
        {error instanceof Error ? error.message : "Failed to load blog"}
      </div>
    );
  }

  if (isLoading || status === "loading" || !isInitialized) {
    return (
      <div className="min-h-screen px-4 py-10 text-center text-[#2c2c2c] dark:text-white">
        Loading blog...
      </div>
    );
  }

  const isVideoAttachment = (url: string) =>
    /\.(mp4|webm|ogg)(\?|$)/i.test(url);

  return (
    <div className="min-h-screen  dark:text-white">
      <div className="container mx-auto px-4 py-10 md:px-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.8fr_0.95fr] xl:gap-8">
          {/* Left Panel */}
          <div className="rounded-[10px] ng-white dark:bg-[#FFFFFF0D] p-4  sm:p-5 lg:p-6">
            {/* Top Upload Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {uploadActions.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white dark:bg-[#FFFFFF0D] px-3 py-2 text-sm dark:text-white/90 transition hover:bg-white/5"
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <p className="mt-3 text-sm dark:text-white/45">
              Drop a video, audio or image file to upload, browse, or URL
            </p>

            <div className="mt-4 grid gap-3">
              {existingImages.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {existingImages.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="group relative overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      <Image
                        src={url}
                        alt={`Existing image ${index + 1}`}
                        width={1000}
                        height={1000}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {images.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {images.map((item, index) => (
                    <div
                      key={`${item.file.name}-${item.file.size}-${index}`}
                      className="group relative overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      <Image
                        src={item.url}
                        alt={item.file.name}
                        width={1000}
                        height={1000}
                        className="h-32 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((prev) => {
                            const next = [...prev];
                            const removed = next.splice(index, 1)[0];
                            if (removed) URL.revokeObjectURL(removed.url);
                            return next;
                          })
                        }
                        className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {existingAudios.length ? (
                <div className="space-y-2">
                  {existingAudios.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      <audio controls src={url} className="w-full" />
                    </div>
                  ))}
                </div>
              ) : null}

              {audios.length ? (
                <div className="space-y-2">
                  {audios.map((item, index) => (
                    <div
                      key={`${item.file.name}-${item.file.size}-${index}`}
                      className="flex flex-wrap items-center gap-3 rounded-lg border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      <audio controls src={item.url} className="w-full" />
                      <button
                        type="button"
                        onClick={() =>
                          setAudios((prev) => {
                            const next = [...prev];
                            const removed = next.splice(index, 1)[0];
                            if (removed) URL.revokeObjectURL(removed.url);
                            return next;
                          })
                        }
                        className="rounded bg-black/70 px-2 py-1 text-[11px] text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {existingAttachments.length ? (
                <div className="space-y-3">
                  {existingAttachments.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="rounded-lg border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      {isVideoAttachment(url) ? (
                        <video
                          controls
                          src={url}
                          className="h-44 w-full rounded-md object-cover"
                        />
                      ) : (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-black/70 underline dark:text-white/70"
                        >
                          Attachment {index + 1}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {attachments.length ? (
                <div className="space-y-3">
                  {attachments.map((item, index) => (
                    <div
                      key={`${item.file.name}-${item.file.size}-${index}`}
                      className="rounded-lg border border-black/10 bg-white p-2 dark:border-white/10 dark:bg-[#0F0F12]"
                    >
                      {item.file.type.startsWith("video/") ? (
                        <video
                          controls
                          src={item.url}
                          className="h-44 w-full rounded-md object-cover"
                        />
                      ) : (
                        <p className="text-sm text-black/70 dark:text-white/70">
                          {item.file.name}
                        </p>
                      )}
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments((prev) => {
                              const next = [...prev];
                              const removed = next.splice(index, 1)[0];
                              if (removed) URL.revokeObjectURL(removed.url);
                              return next;
                            })
                          }
                          className="rounded bg-black/70 px-2 py-1 text-[11px] text-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFileSelect(event.target.files, setImages);
                event.target.value = "";
              }}
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFileSelect(event.target.files, setAudios);
                event.target.value = "";
              }}
            />
            <input
              ref={attachmentInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(event) => {
                handleFileSelect(event.target.files, setAttachments);
                event.target.value = "";
              }}
            />

            {isLinkOpen ? (
              <div className="mt-4">
                <label className="mb-2 block text-sm text-black/60 dark:text-white/60">
                  Link
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={linkInputRef}
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="https://example.com"
                    className="w-full flex-1 rounded-[8px] border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/30 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/30"
                  />
                  {link ? (
                    <button
                      type="button"
                      onClick={() => setLink("")}
                      className="rounded-lg border border-black/10 px-3 py-2 text-xs text-black transition hover:bg-black/5 dark:border-white/10 dark:text-white"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {link.trim() ? (
                  <div className="mt-2 rounded-[8px] border border-black/10 bg-white px-3 py-2 text-xs text-black/70 dark:border-white/10 dark:bg-[#0F0F12] dark:text-white/70">
                    <p className="text-[10px] uppercase tracking-wide text-black/40 dark:text-white/40">
                      Link preview
                    </p>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm text-black underline underline-offset-2 dark:text-white"
                    >
                      {link}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Category */}
            <div className="relative mt-4">
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                aria-expanded={isCategoryOpen}
                className="flex w-full items-center justify-between rounded-[8px] border border-black/10 bg-white px-4 py-3 text-left text-sm text-[#121212] transition hover:bg-white/80 dark:border-white/15 dark:bg-transparent dark:text-white/70"
              >
                <span>{selectedCategory ?? "Category"}</span>
                <span className="text-black/40 dark:text-white/50">⌄</span>
              </button>

              {isCategoryOpen ? (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[8px] border border-white/10 bg-[#1f1f1f] text-white ">
                  <div className="max-h-72 overflow-y-auto">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryOpen(false);
                        }}
                        className="flex w-full items-center justify-between border-b border-white/10 px-5 py-3 text-left text-sm transition hover:bg-white/5"
                      >
                        <span>{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Editor Shell */}
            <div className="mt-5" style={editorStyle}>
              <div className="rounded-[8px] bg-white dark:bg-[#0F0F12]">
                <ReactQuill
                  theme="snow"
                  value={body}
                  onChange={setBody}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing..."
                  className="quill-editor-dark"
                />
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <aside className="h-fit rounded-[10px]  p-4  sm:p-5 lg:p-6">
            <h2 className="text-3xl font-semibold tracking-tight dark:text-white">
              Audience
            </h2>

            <div className="mt-5 space-y-4">
              {/* Free access */}
              <div
                className={`flex items-start justify-between gap-4 rounded-[8px] border p-4 transition ${
                  audienceType === "free"
                    ? "border-[#ff5a7d] bg-white dark:bg-[#FFFFFF0D]"
                    : "border-black/10 bg-white dark:border-white/10 dark:bg-[#FFFFFF0D]"
                }`}
              >
                <div>
                  <div className="text-base font-medium text-[#121212] dark:text-white">
                    Free access
                  </div>
                  <p className="mt-1 text-sm leading-6 dark:text-white/50">
                    Let everyone access this post and discover your work
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={audienceType === "free"}
                  onChange={() => setAudienceType("free")}
                  className="mt-1 h-4 w-4 cursor-pointer accent-[#ff5a7d]"
                />
              </div>

              {/* Paid access */}
              <div
                className={`block rounded-[8px] border p-4 transition ${
                  audienceType === "paid"
                    ? "border-[#ff5a7d] bg-white dark:bg-[#FFFFFF0D]"
                    : "border-black/10 bg-white dark:border-white/10 dark:bg-[#FFFFFF0D]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-medium dark:text-white">
                      Paid access
                    </div>
                    <p className="mt-1 text-sm leading-6 dark:text-white/50">
                      Limit access to and people who purchase this post.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={audienceType === "paid"}
                    onChange={() => setAudienceType("paid")}
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#ff5a7d]"
                  />
                </div>

                {audienceType === "paid" ? (
                  <div className="mt-5">
                    <label className="mb-2 block text-sm text-black/60 dark:text-white/65">
                      Price of this post
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      placeholder="eg: 2"
                      className="w-full rounded-xl border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black/40 dark:border-[#FFFFFF0D] dark:bg-[#FFFFFF0D] dark:text-white dark:placeholder:text-white/25 dark:focus:border-white/30"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-[#ff5a7d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff476f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </button>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .quill-editor-dark .ql-toolbar.ql-snow {
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-bottom: none;
          background: #ffffff;
          border-radius: 8px 8px 0 0;
        }

        .quill-editor-dark .ql-container.ql-snow {
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-top: none;
          font-size: 16px;
          min-height: var(--editor-min-height, 520px);
          height: var(--editor-min-height, 520px);
          border-radius: 0 0 8px 8px;
          background: #ffffff;
          color: #0b0b0c;
        }

        .quill-editor-dark .ql-editor {
          padding: 18px 20px 28px;
        }

        .quill-editor-dark .ql-editor.ql-blank::before {
          color: rgba(2, 6, 23, 0.45);
          font-style: normal;
        }

        .quill-editor-dark .ql-toolbar.ql-snow .ql-picker-label,
        .quill-editor-dark .ql-toolbar.ql-snow .ql-picker-item,
        .quill-editor-dark .ql-toolbar.ql-snow .ql-stroke,
        .quill-editor-dark .ql-toolbar.ql-snow .ql-fill,
        .quill-editor-dark .ql-toolbar.ql-snow .ql-picker {
          color: #0f172a;
          stroke: #0f172a;
        }

        .quill-editor-dark .ql-toolbar.ql-snow .ql-active,
        .quill-editor-dark .ql-toolbar.ql-snow button:hover {
          color: #ff5a7d;
        }

        .quill-editor-dark .ql-toolbar.ql-snow button:hover .ql-stroke,
        .quill-editor-dark .ql-toolbar.ql-snow .ql-active .ql-stroke {
          stroke: #ff5a7d;
        }

        .dark .quill-editor-dark .ql-toolbar.ql-snow {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: none;
          background: rgba(255, 255, 255, 0.06);
        }

        .dark .quill-editor-dark .ql-container.ql-snow {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top: none;
          background: #0f0f12;
          color: #f1f5f9;
        }

        .dark .quill-editor-dark .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.35);
        }

        .dark .quill-editor-dark .ql-toolbar.ql-snow .ql-picker-label,
        .dark .quill-editor-dark .ql-toolbar.ql-snow .ql-picker-item,
        .dark .quill-editor-dark .ql-toolbar.ql-snow .ql-stroke,
        .dark .quill-editor-dark .ql-toolbar.ql-snow .ql-fill,
        .dark .quill-editor-dark .ql-toolbar.ql-snow .ql-picker {
          color: #e2e8f0;
          stroke: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
