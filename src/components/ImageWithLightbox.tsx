import React, { useState } from 'react';
import { FaExpand } from 'react-icons/fa';

interface ImageWithLightboxProps {
  src: string;
  alt: string;
  openLightbox: (imageUrl: string) => void;
}

const ImageWithLightbox: React.FC<ImageWithLightboxProps> = ({ src, alt, openLightbox }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <img 
        src={src}
        alt={alt}
        style={{ maxWidth: '280px', display: isLoading ? 'none' : 'block' }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError('Failed to load image');
        }}
      />
      <FaExpand 
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          cursor: 'pointer',
          color: 'white',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px',
          borderRadius: '5px'
        }}
        onClick={() => openLightbox(src)}
      />
    </div>
  );
};

export default ImageWithLightbox;
