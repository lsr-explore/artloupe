"use client";
import {
  MediaArtContainer,
  MediaSourceProvider,
} from "@artloupe/media-display";
import { Providers } from "data-providers";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const logSearchAction = async (searchType: string, searchQuery: string) => {
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        level: "info",
        message: "User initiated search",
        context: {
          searchType,
          searchQuery,
          page: "search",
          action: "explore_click",
        },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (error) {
    // Silently fail logging to avoid breaking the user experience
    console.error("Failed to log search action:", error);
  }
};

const SearchArtPageContent = () => {
  const searchParameters = useSearchParams();
  const router = useRouter();
  const searchType = searchParameters.get("searchtype");
  const searchQuery = searchParameters.get("search");
  const [selectedSearchQuery, setSelectedSearchQuery] = useState(
    searchQuery || "",
  );
  const [selectedSearchType, setSelectedSearchType] = useState<string>(
    searchType || "",
  );
  const [shouldSearch, setShouldSearch] = useState<boolean>(true);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (shouldSearch) {
      setShouldSearch(false);
    }
    if (
      searchQuery &&
      searchQuery !== "" &&
      searchQuery !== selectedSearchQuery
    ) {
      setSelectedSearchQuery(searchQuery || "");
    }
    if (searchType && searchType !== "" && searchType !== selectedSearchType) {
      setSelectedSearchType(searchType || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchType]);

  const handleSearchTypeChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value || "";
    setShouldUpdate(true);
    setSelectedSearchType(newValue);
  };

  const handleExploreClick = async () => {
    const urlSearchParameters = new URLSearchParams();
    if (selectedSearchQuery)
      urlSearchParameters.set("search", selectedSearchQuery);
    if (selectedSearchType)
      urlSearchParameters.set("searchtype", selectedSearchType);

    // Log the search action
    await logSearchAction(selectedSearchType, selectedSearchQuery);

    router.push(`/images/search?${urlSearchParameters.toString()}`);
    setShouldUpdate(false);
    setShouldSearch(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">artloupe</h1>
      <div className="flex flex-col gap-4 w-1/2 mt-4">
        <h2 className="text-2xl font-bold">Explore</h2>
        <div className="flex space-x-4">
          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paintings"
                value="paintings"
                checked={selectedSearchType === "paintings"}
                onChange={handleSearchTypeChange}
                className="peer hidden" // Hide the native radio button
              />
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center">
                {selectedSearchType === "paintings" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="ml-2 text-gray-700 peer-checked:text-blue-700">
                Paintings from the Metropolitan Museum of Art
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="photos"
                value="photos"
                checked={selectedSearchType === "photos"}
                onChange={handleSearchTypeChange}
                className="peer hidden" // Hide the native radio button
              />
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center">
                {selectedSearchType === "photos" && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="ml-2 text-gray-700 peer-checked:text-blue-700">
                Photos from Pexels
              </span>
            </label>
          </div>
        </div>
        <div className="mt-4 w-full flex items-center gap-2">
          <input
            type="text"
            maxLength={25}
            placeholder="Enter search terms..."
            value={selectedSearchQuery}
            onChange={(event) => {
              setShouldUpdate(true);
              setSelectedSearchQuery(event.target.value);
            }}
            className="flex-grow text-sm px-3 py-2 border-b-2 border-gray-400"
            aria-label="Enter search terms..."
          />
          <button
            type="button"
            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleExploreClick}
          >
            Explore{" "}
            {selectedSearchType === "paintings" ? "Paintings" : "Photos"}
          </button>
        </div>
      </div>
      <Providers>
        <MediaSourceProvider
          searchType={selectedSearchType || ""}
          searchQuery={selectedSearchQuery || ""}
          shouldSearch={shouldSearch}
        >
          {shouldUpdate ? (
            <div>Select explore to continue...</div>
          ) : (
            <MediaArtContainer />
          )}
        </MediaSourceProvider>
      </Providers>
    </main>
  );
};

const SearchArtPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchArtPageContent />
    </Suspense>
  );
};

export default SearchArtPage;
