/** biome-ignore-all lint/performance/noImgElement: TBD - Image */
'use client';

import ColorThief from 'colorthief';
import { ColorTreemap } from 'components/ColorTreeMap';
import {
  type ColorCount as BaseColorCount,
  quantizeImageData,
} from 'lib/color';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const HUGGINGFACE_MODELS = [
  'facebook/detr-resnet-50',
  'google/vit-base-patch16-224',
  'microsoft/resnet-50',
];

const getImageDataFromImageElement = (
  img: HTMLImageElement,
): ImageData | undefined => {
  if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
    console.warn('Image not loaded or invalid dimensions.');
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const context = canvas.getContext('2d');
  if (!context) return;

  context.drawImage(img, 0, 0);
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

const getColorPercentages = (element: HTMLImageElement | null) => {
  // 1. Get imageData

  if (!element) return [];
  const imageData = getImageDataFromImageElement(element);

  if (!imageData) return [];

  const topColors = quantizeImageData(imageData, 20, 4); // 16 precision = more grouping
  return topColors;
};

const getRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16_777_215)
    .toString(16)
    .padStart(6, '0')}`;
};

// Extend ColorCount to include rgb if not present
interface ColorCount extends BaseColorCount {
  rgb?: number[];
}

const AnalyzePage = () => {
  const searchParameters = useSearchParams();
  const artwork = {
    imageUrl: searchParameters.get('imageUrl'),
    title: searchParameters.get('title'),
    id: searchParameters.get('id'),
    artist: searchParameters.get('artist'),
    description: searchParameters.get('description'),
  };

  const [selectedModel, setSelectedModel] = useState(HUGGINGFACE_MODELS[0]);
  const [dominantColor, setDominantColor] = useState<number[] | undefined>();
  const [colorPercentages, setColorPercentages] = useState<
    ColorCount[] | undefined
  >();
  const [palette, setPalette] = useState<number[][] | undefined>();
  const imageReference = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Define DetectionObject type inline (or import if available)
  type DetectionObject = {
    label: string;
    score: number;
    box: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    };
    color?: string;
  };

  const [analysisResult, setAnalysisResult] = useState<
    DetectionObject[] | undefined
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const img = imageReference?.current;
    if (!img) return;

    const handleLoad = () => {
      setImageLoaded(true);
    };

    if (img.complete) {
      handleLoad();
    } else {
      setImageLoaded(false);
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;
    const img = imageReference.current;

    const colorThief = new ColorThief();
    if (img?.complete) {
      try {
        const element = document.querySelector(
          '#artwork-image',
        ) as HTMLImageElement;
        if (!element) return;
        const result = colorThief.getPalette(element, 10);
        setPalette(result);
        const color = colorThief.getColor(element, 10);
        setDominantColor(color);
        const colorAmounts = getColorPercentages(element);
        setColorPercentages(colorAmounts);
      } catch (error) {
        console.error('ColorThief failed:', error);
      }
    }
  }, [imageLoaded]);

  const colorMap: Record<string, string> = {};

  const getColorForLabel = (label: string): string => {
    if (!colorMap[label]) {
      colorMap[label] = getRandomColor();
    }
    return colorMap[label];
  };

  const handleAnalyze = async () => {
    if (!artwork.imageUrl) return;
    setLoading(true);
    try {
      const response = await fetch('/api/ai/detect-objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: artwork.imageUrl,
          modelId: selectedModel,
        }),
      });

      const result: DetectionObject[] = await response.json();

      const colorCodedResult = result.map((item: DetectionObject) => {
        const color = getColorForLabel(item.label);
        return {
          ...item,
          color,
        };
      });
      setAnalysisResult(colorCodedResult);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!artwork) return <div className='p-8'>Artwork not found.</div>;

  return (
    <div className='max-w-screen-2xl mx-auto py-10 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Analyze Image</h1>
      <h2 className='text-xl text-gray-600'>{artwork.title}</h2>
      <h3>{artwork.artist && ` by ${artwork.artist}`}</h3>
      <div>{artwork.description && `${artwork.description}`}</div>

      {/* Next.js image for display */}
      <div className='grid md:grid-cols-2 grid-cols-1  gap-8 w-full mt-6'>
        <div className='relative  w-full aspect-[4/3] mx-auto'>
          <img
            id={'artwork-image'}
            ref={imageReference}
            src={`/api/proxy-image?url=${encodeURIComponent(artwork.imageUrl || '')}`}
            alt='Artwork'
            className='w-full max-w-lg rounded mb-4 shadow'
            width={400}
            height={400}
          />
          {analysisResult?.map((objectItem: DetectionObject) => {
            const box = objectItem.box;
            const width = box.xmax - box.xmin;
            const height = box.ymax - box.ymin;
            if (objectItem.score < 0.9) return;
            return (
              <div
                key={`${objectItem.label}-${box.xmin}-${box.ymin}-${box.xmax}-${box.ymax}`}
                className='absolute border-2  text-xs text-white  px-1'
                style={{
                  left: `${box.xmin}px`,
                  top: `${box.ymin}px`,
                  width: `${width}px`,
                  height: `${height}px`,
                  borderColor: objectItem.color,
                }}>
                {objectItem.label}
              </div>
            );
          })}
        </div>
        <div className='relative  w-full aspect-[4/3] mx-auto'>
          {/* <div>
            <h2>Top Colors by percentage</h2>
          </div> */}

          <ColorTreemap
            colors={
              colorPercentages?.filter(
                (c): c is ColorCount & { rgb: number[] } =>
                  Array.isArray(c.rgb),
              ) ?? []
            }
            width={600}
            height={600}
          />
        </div>
      </div>
      <div>
        {analysisResult?.map((objectItem: DetectionObject) => {
          const label = objectItem.label;
          const score = objectItem.score;
          if (objectItem.score < 0.9 || !label) return;
          return (
            <div
              key={`analysis-${label}-${objectItem.box.xmin}-${objectItem.box.ymin}`}>
              <span> {label} </span>
              <span> ({score}) </span>
              <div
                key={`${objectItem.color}`}
                className='w-10 h-10 rounded'
                style={{ backgroundColor: objectItem.color }}
              />
            </div>
          );
        })}
      </div>

      <div className='flex items-center gap-4 mb-6'>
        <select
          value={selectedModel}
          onChange={(event) => setSelectedModel(event.target.value)}
          className='border rounded px-3 py-2 text-sm'>
          {HUGGINGFACE_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <button
          type='button'
          onClick={handleAnalyze}
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'>
          {loading ? 'Analyzing...' : 'Analyze with Hugging Face'}
        </button>
      </div>
    </div>
  );
};

export default AnalyzePage;

// {analysisResult && (
//   <div className='mt-6'>
//     <h3 className='text-lg font-semibold'>Model Output</h3>
//     <pre className='bg-gray-100 p-4 mt-2 rounded'>
//       {JSON.stringify(analysisResult, undefined, 2)}
//     </pre>
//   </div>
// )}

// <div className='flex gap-2 flex-wrap'>
//   <div
//     key={`${dominantColor}`}
//     className='w-20 h-20 rounded'
//     style={{
//       backgroundColor: dominantColor
//         ? `rgb(${dominantColor.join(',')})`
//         : undefined,
//     }}
//     title={dominantColor ? `rgb(${dominantColor.join(',')})` : undefined}
//   />
//   <div>{dominantColor?.join(',')}</div>
//   {/* Palette Chips */}
//   {palette && (
//     <div className='flex space-x-2 mt-4'>
//       {palette.map((color) => (
//         <>
//           <div
//             key={`${color}`}
//             className='w-10 h-10 rounded'
//             style={{ backgroundColor: `rgb(${color.join(',')})` }}
//             title={`rgb(${color.join(',')})`}
//           />
//           <span>{color.join(',')}</span>
//         </>
//       ))}
//     </div>
//   )}
// </div>

// <div className='flex gap-2 flex-wrap'>
// {/* Palette Chips */}
// {colorPercentages && (
//   <div className=' mt-4 flex space-x-2'>
//     {colorPercentages.map((colorItem) => {
//       return (
//         <div key={`${colorItem.color}`}>
//           <div
//             className='w-10 h-10 rounded'
//             style={{ backgroundColor: `${colorItem.color}` }}
//             title={`${colorItem.color}`}
//           />
//           <span>{colorItem.color}</span>
//           <span> | {colorItem.rgb?.join(',')}</span>
//           <span> | {colorItem.percentage}</span>
//         </div>
//       );
//     })}
//   </div>
// )}
// </div>
