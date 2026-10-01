"use client";
import { useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/data/gallery";

export function VideoPreview({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
    });
    const onVisibility = () => {
      if (document.hidden) video.pause();
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, []);
  const validId = item.videoId && /^[a-zA-Z0-9_-]+$/.test(item.videoId);
  if (item.videoProvider !== "file" && validId) {
    const embed =
      item.videoProvider === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=0&mute=1`
        : `https://player.vimeo.com/video/${item.videoId}?autoplay=0&muted=1&dnt=1`;
    return <EmbeddedVideo src={embed} title={item.title} />;
  }
  if (!item.source) return null;
  return (
    <video
      ref={videoRef}
      className="video-player"
      src={item.source}
      poster={item.thumbnail ?? undefined}
      controls
      muted
      playsInline
      preload="metadata"
    >
      {item.captionsSource && (
        <track
          kind="captions"
          src={item.captionsSource}
          srcLang="en"
          label="English"
          default
        />
      )}
      Your browser does not support this video.{" "}
      <a href={item.source}>Open the video</a>.
    </video>
  );
}

function EmbeddedVideo({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Unload a hosted player when hidden: this stops audio as well as playback.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setActive(false);
    });
    const onVisibility = () => {
      if (document.hidden) setActive(false);
    };
    observer.observe(container);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return (
    <div ref={containerRef}>
      {active ? (
        <iframe
          className="video-player"
          src={src}
          title={title}
          allow="fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="video-paused">
          <p>Video paused while out of view.</p>
          <button
            className="button button-dark"
            onClick={() => setActive(true)}
          >
            Load video again
          </button>
        </div>
      )}
    </div>
  );
}
