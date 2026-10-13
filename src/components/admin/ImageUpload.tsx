"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  error?: string;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  folder = "uploads",
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      const blob = await upload(`${folder}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      onChange(blob.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="aspect-video w-full rounded-lg border border-foreground/15 object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-foreground/20 text-sm text-foreground/50">
          No image
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-foreground/20 px-4 py-1.5 text-sm transition hover:bg-foreground/10 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : value ? "Replace" : "Upload image"}
        </button>

        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full px-4 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={handleFile}
      />

      {(uploadError || error) && (
        <span className="text-sm text-red-400">{uploadError ?? error}</span>
      )}
    </div>
  );
}