import { useEffect, useRef } from 'react';
import { ImagePlus } from 'lucide-react';

export default function ImageUpload({ onUpload, currentUrl }) {
    const widgetRef = useRef(null);

    useEffect(() => {
        // Load Cloudinary's upload widget script
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            widgetRef.current = window.cloudinary.createUploadWidget(
                {
                    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,  // create this in Cloudinary dashboard
                    sources: ['local', 'camera'],
                    cropping: true,
                    croppingAspectRatio: 4 / 3,
                    maxImageFileSize: 5000000,  // 5MB max
                    styles: { palette: { action: '#f97316' } }  // brand orange
                },
                (error, result) => {
                    if (!error && result.event === 'success') {
                        onUpload(result.info.secure_url);
                    }
                }
            );
        };

        return () => document.body.removeChild(script);
    }, []);

    return (
        <div>
            {currentUrl ? (
                <div className="relative">
                    <img src={currentUrl} alt="Recipe" className="w-full aspect-[4/3] object-cover rounded-xl" />
                    <button type="button" onClick={() => widgetRef.current?.open()}
                        className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow text-sm font-medium hover:bg-gray-50">
                        Change photo
                    </button>
                </div>
            ) : (
                <button type="button" onClick={() => widgetRef.current?.open()}
                    className="w-full aspect-[4/3] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-brand-500 hover:bg-orange-50 transition-colors group">
                    <ImagePlus size={40} className="text-gray-300 group-hover:text-brand-400" />
                    <span className="text-gray-400 group-hover:text-brand-500 font-medium">Click to upload photo</span>
                    <span className="text-gray-300 text-sm">Max 5MB · JPG, PNG, WebP</span>
                </button>
            )}
        </div>
    );
}