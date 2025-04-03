import { Suspense } from "react"
import { ProductGrid } from "@/components/ProductGrid"
import { SearchResultsContent } from "./SearchResultsContent"

export const metadata = {
  title: "Search Results | KickVerse",
  description: "Find the perfect shoes for your collection",
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q: string }
}) {
  const query = searchParams?.q || ""
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchResultsContent query={query} />
      </Suspense>
    </div>
  )
}
