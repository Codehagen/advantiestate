// Vitest stand-in for @/lib/content, which imports the build-generated
// content-collections package. Unit tests only exercise pure mappers, so
// empty content is fine.
export const getActiveListings = () => []
export const getListingPost = (_slug: string) => null
