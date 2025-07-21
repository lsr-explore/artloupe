export const fetchAdminArtworks = async () => {
  const response = await fetch('/api/artworks');
  if (!response.ok) throw new Error('Failed to load artworks');
  return response.json();
};
