import type { ImageType } from "@artloupe/shared-types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const ImagePanel = ({ image }: { image: ImageType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] h-48 bg-gray-200">
        {image.imageUrl ? (
          <Image
            width={600}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-cover"
            onError={(event) => {
              console.log("Image failed to load:", image.imageUrl);
              const target = event.currentTarget as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+";
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl text-gray-400">
            🖼️
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
          {image.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{image.artist}</p>
        <p className="text-gray-500 text-xs mb-4 line-clamp-2">
          {image.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">ID: {image.id}</span>
          <Link
            href={`/images/analyze/${image.id}?imageUrl=${encodeURIComponent(image.imageUrl || "")}&title=${encodeURIComponent(image.title)}&artist=${encodeURIComponent(image.artist || "")}&description=${encodeURIComponent(image.description || "")}&id=${image.id}`}
          >
            <button
              type="button"
              className="bg-indigo-500 text-white text-xs px-4 py-2 rounded hover:bg-indigo-600 transition-colors duration-200 font-medium"
            >
              Analyze Image
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
