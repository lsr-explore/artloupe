import { useContext } from "react";
import { MediaSourceContext } from "./media-source-context";

export function useMediaSource() {
	const context = useContext(MediaSourceContext);
	if (!context)
		throw new Error("useMediaSource must be used within MediaSourceProvider");
	return context;
}
