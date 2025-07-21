import { describe, expect, it } from "vitest";
import {
  ImageType,
  MetObjectResponse,
  mapMetObjectsToImageType,
  mapPexelsPhotosToImageType,
  PexelsPhoto,
} from "../types/image-type";

describe("ImageType", () => {
  it("should allow minimal valid fields", () => {
    const image: ImageType = {
      id: "1",
      title: "Test",
      imageUrl: "http://example.com/image.jpg",
      source: "met",
    };
    expect(image.id).toBe("1");
    expect(image.title).toBe("Test");
    expect(image.imageUrl).toBe("http://example.com/image.jpg");
    expect(image.source).toBe("met");
  });
});

describe("mapMetObjectsToImageType", () => {
  it("maps valid MetObjectResponse array to ImageType[]", () => {
    const metObjects: MetObjectResponse[] = [
      {
        objectID: 123,
        title: "Mona Lisa",
        artistDisplayName: "Leonardo da Vinci",
        primaryImageSmall: "http://example.com/monalisa.jpg",
        objectDate: "1503",
      },
      {
        objectID: 456,
        title: undefined,
        artistDisplayName: undefined,
        primaryImageSmall: "http://example.com/untitled.jpg",
        objectDate: undefined,
      },
      {
        objectID: 789,
        title: "No Image",
        artistDisplayName: "Unknown",
        primaryImageSmall: undefined,
        objectDate: "2020",
      },
    ];
    const result = mapMetObjectsToImageType(metObjects);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "123",
      title: "Mona Lisa",
      artist: "Leonardo da Vinci",
      imageUrl: "http://example.com/monalisa.jpg",
      description: "1503",
      source: "met",
      metId: "123",
    });
    expect(result[1]).toMatchObject({
      id: "456",
      title: "Untitled",
      artist: "Unknown Artist",
      imageUrl: "http://example.com/untitled.jpg",
      description: "",
      source: "met",
      metId: "456",
    });
  });

  it("returns an empty array if no objects have images", () => {
    const metObjects: MetObjectResponse[] = [
      { objectID: 1, primaryImageSmall: undefined },
      { objectID: 2, primaryImageSmall: undefined },
    ];
    expect(mapMetObjectsToImageType(metObjects)).toEqual([]);
  });

  it("returns an empty array for empty input", () => {
    expect(mapMetObjectsToImageType([])).toEqual([]);
  });
});

describe("mapPexelsPhotosToImageType", () => {
  it("maps valid PexelsPhoto array to ImageType[]", () => {
    const pexelsPhotos: PexelsPhoto[] = [
      {
        id: 101,
        alt: "A nice photo",
        photographer: "Jane Doe",
        src: { medium: "http://example.com/photo1.jpg" },
      },
      {
        id: 102,
        alt: "",
        photographer: "",
        src: { medium: "http://example.com/photo2.jpg" },
      },
      {
        id: 103,
        alt: "No image",
        photographer: "John Smith",
        src: { medium: "" },
      },
    ];
    const result = mapPexelsPhotosToImageType(pexelsPhotos);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "101",
      title: "A nice photo",
      artist: "Jane Doe",
      imageUrl: "http://example.com/photo1.jpg",
      description: "",
      source: "pexels",
    });
    expect(result[1]).toMatchObject({
      id: "102",
      title: "Untitled",
      artist: "Unknown Photographer",
      imageUrl: "http://example.com/photo2.jpg",
      description: "",
      source: "pexels",
    });
  });

  it("returns an empty array if no photos have images", () => {
    const pexelsPhotos: PexelsPhoto[] = [
      { id: 1, alt: "No image", photographer: "Nobody", src: { medium: "" } },
    ];
    expect(mapPexelsPhotosToImageType(pexelsPhotos)).toEqual([]);
  });

  it("returns an empty array for empty input", () => {
    expect(mapPexelsPhotosToImageType([])).toEqual([]);
  });
});
