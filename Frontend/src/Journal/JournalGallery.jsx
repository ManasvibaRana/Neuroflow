import styled from "styled-components";
import { useState, useRef } from "react";

export default function JournalGallery() {
  const [images, setImages] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const fileRef = useRef();
 const openImage = (src) => {
  console.log("Enlarging:", src); // ✅ Should show image path
  setEnlargedImage(src);
};

  const closeImage = () => setEnlargedImage(null);

  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, index) => index !== i));
  };

  return (
    <>
    <Gallery>
      <h3>📷 Memories</h3>
      {images.map((src, i) => {
        const rotation = (Math.random() * 6 - 3).toFixed(2); // -3° to +3°
        return (
          <Polaroid key={i} $rotate={rotation} onClick={() => openImage(src)}>
            <img src={src} alt={`m-${i}`}/>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeImage(i);
              }}
            >
              ✕
            </button>
          </Polaroid>
        );
      })}

      <button onClick={() => fileRef.current.click()}>📸 Add Photo</button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImage}
      />
    </Gallery>
    {enlargedImage && (
      <Overlay onClick={closeImage}>
        <CloseButton onClick={closeImage}>✕</CloseButton>
        <ModalImage
          src={enlargedImage}
          alt="Enlarged memory"
          onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking the image itself
        />
      </Overlay>
    )}
    </>
  );
}

const Gallery = styled.div`
  padding: 20px;
  background: #ffffffcc;
  border-radius: 12px;
  margin-bottom: 20px;

  h3 {
    text-align: center;
    margin-bottom: 10px;
  }

  button {
    margin-top: 10px;
    padding: 6px 12px;
    border: none;
    background: #87cefa;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }
`;

const Polaroid = styled.div`
  position: relative;
  margin-bottom: 16px;
  background: #fff;
  padding: 8px;
  border: 2px dashed red; /* ✅ RED BORDER VISIBLE */
  border-radius: 8px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  transform: rotate(${(props) => props.$rotate}deg); /* ✅ USE $rotate NOT rotate */

  img {
    width: 100%;
    border-radius: 4px;
  }

  button {
    position: absolute;
    top: 4px;
    right: 6px;
    background: #f66;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #fff;
    cursor: pointer;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  border: 4px solid red; // TEMP: helps see if overlay is showing
  align-items: center;
  z-index: 999;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 30px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
  z-index: 1000;
`;
