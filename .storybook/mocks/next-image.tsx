import React from "react";

interface ImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	sizes?: string;
	className?: string;
	onError?: (event: { currentTarget: { src: string } }) => void;
}

const MockNextImage: React.FC<ImageProps> = ({
	src,
	alt,
	width,
	height,
	className,
	onError,
}) => {
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			onError={onError}
		/>
	);
};

export default MockNextImage;
