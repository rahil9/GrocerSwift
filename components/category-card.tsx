import Link from "next/link"
import Image from "next/image"

interface CategoryCardProps {
  name: string
  image: string
  slug: string
}

export function CategoryCard({ name, image, slug }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${slug}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/50">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-3 text-center">
          <h3 className="font-medium">{name}</h3>
        </div>
      </div>
    </Link>
  )
}

