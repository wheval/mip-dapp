import { Badge } from "@/src/components/ui/badge"
import type { Property } from "@/src/lib/types"

interface AssetPropertiesProps {
  properties: Property[]
}

export default function AssetProperties({ properties }: AssetPropertiesProps) {
  if (!properties || properties.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No properties found for this asset</div>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {properties.map((property) => (
        <div key={property.trait} className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground uppercase mb-1">{property.trait}</p>
          <p className="font-medium truncate">{property.value}</p>
          <Badge variant="outline" className="mt-1 text-xs">
            {property.rarity}% have this
          </Badge>
        </div>
      ))}
    </div>
  )
}
