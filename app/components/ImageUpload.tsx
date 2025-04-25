'use client';

import React, { useState, useRef } from 'react';
import { FaCamera, FaUser } from 'react-icons/fa';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageSelected: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelected }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Enviar o arquivo para o componente pai
    onImageSelected(file);
  };

  return (
    <div className="relative">
      <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mb-4 relative mx-auto overflow-hidden">
        {previewUrl ? (
          <Image 
            src={previewUrl} 
            alt="Imagem de perfil" 
            fill
            className="object-cover"
          />
        ) : (
          <FaUser className="text-gray-400 w-12 h-12" />
        )}
      </div>
      <button
        type="button"
        onClick={handleButtonClick}
        className="absolute bottom-3 right-0 left-0 mx-auto bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 w-8 h-8 flex items-center justify-center"
      >
        <FaCamera size={14} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload; 