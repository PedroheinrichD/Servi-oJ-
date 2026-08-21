import { useEffect, useRef, useState } from "react";

type ImageCarouselProps = {
  images: string[];
  alt?: string;
  intervalMs?: number; // tempo entre cada troca automática
};

export default function ImageCarousel({
  images,
  alt = "",
  intervalMs = 3000,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // roda o carrossel sozinho
  useEffect(() => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className="relative h-44 w-full overflow-hidden">
      {/* trilho que desliza */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((url, i) => (
          <img
            key={i}
            src={url.trim()}
            alt={`${alt} ${i + 1}`}
            className="h-44 w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>

      {/* bolinhas indicadoras, só aparece se tiver mais de 1 foto */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
