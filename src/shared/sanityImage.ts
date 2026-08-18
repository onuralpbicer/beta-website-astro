const SANITY_IMAGE_HOST = 'cdn.sanity.io';
const DEFAULT_IMAGE_QUALITY = 82;

interface SanityImageOptions {
	widths: number[];
	fallbackWidth?: number;
	quality?: number;
}

interface SanityImageProps {
	src: string;
	srcset?: string;
}

const getSanityImageUrl = (source: string): URL | null => {
	try {
		const url = new URL(source);
		return url.hostname === SANITY_IMAGE_HOST ? url : null;
	} catch {
		return null;
	}
};

const getOriginalWidth = (url: URL): number | null => {
	const dimensions = url.pathname.match(/-(\d+)x\d+\.[^./]+$/);
	return dimensions ? Number(dimensions[1]) : null;
};

const normalizeWidths = (widths: number[], originalWidth: number | null): number[] => {
	const requestedWidths = [...new Set(widths.map(Math.round).filter((width) => width > 0))].sort(
		(a, b) => a - b,
	);

	if (!originalWidth) return requestedWidths;

	const availableWidths = requestedWidths.filter((width) => width < originalWidth);
	const largestRequestedWidth = requestedWidths.at(-1);

	if (largestRequestedWidth && originalWidth <= largestRequestedWidth) {
		availableWidths.push(originalWidth);
	}

	return availableWidths;
};

const transformSanityImageUrl = (url: URL, width: number, quality: number): string => {
	const transformedUrl = new URL(url);
	transformedUrl.searchParams.set('auto', 'format');
	transformedUrl.searchParams.set('fit', 'max');
	transformedUrl.searchParams.set('w', String(width));
	transformedUrl.searchParams.set('q', String(quality));
	return transformedUrl.toString();
};

export const getSanityImageProps = (
	source: string,
	{ widths, fallbackWidth = widths.at(-1), quality = DEFAULT_IMAGE_QUALITY }: SanityImageOptions,
): SanityImageProps => {
	const sanityUrl = getSanityImageUrl(source);
	if (!sanityUrl || !fallbackWidth) return { src: source };

	const originalWidth = getOriginalWidth(sanityUrl);
	const candidateWidths = normalizeWidths(widths, originalWidth);
	const normalizedFallbackWidth = Math.min(Math.round(fallbackWidth), originalWidth ?? Infinity);

	return {
		src: transformSanityImageUrl(sanityUrl, normalizedFallbackWidth, quality),
		srcset: candidateWidths
			.map((width) => `${transformSanityImageUrl(sanityUrl, width, quality)} ${width}w`)
			.join(', '),
	};
};
