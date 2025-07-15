import { useEffect, useRef } from "react";

const useChimes = () => {
  const startChimeRef = useRef(null);
  const successChimeRef = useRef(null);
  const errorChimeRef = useRef(null);
  const endChimeRef = useRef(null);

  useEffect(() => {
    const loadChime = async (url, ref) => {
      try {
        const { Howl } = await import("howler");
        const res = await fetch(url);
        const data = await res.json();
        if (data.url) {
          ref.current = new Howl({
            src: [data.url],
            volume: 0.5,
            format: ["mp3"],
          });
        }
      } catch (err) {
        console.warn("Failed to load chime:", url, err);
      }
    };

    loadChime('http://localhost:8000/music/api/chime/success_chime/', endChimeRef);
    loadChime("http://localhost:8000/music/api/chime/start_chime/", startChimeRef);
    loadChime("http://localhost:8000/music/api/chime/success_chime/", successChimeRef);
    loadChime("http://localhost:8000/music/api/chime/error_chime/", errorChimeRef);
  }, []);

  return { startChimeRef, successChimeRef, errorChimeRef };
};

export default useChimes;
