import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function CampaignsPage() {
  // Mock data for campaigns
  const campaigns = [
    {
      id: "1",
      name: "Summer Sale 2025",
      description: "Promotional assets for the summer sale campaign",
      platforms: ["Instagram", "Facebook", "Twitter", "Web"],
      createdAt: "2025-05-01",
      assetCount: 12,
    },
    {
      id: "2",
      name: "Product Launch: XYZ",
      description: "Marketing materials for the new product launch",
      platforms: ["Instagram", "LinkedIn", "Print", "Email"],
      createdAt: "2025-04-15",
      assetCount: 8,
    },
    {
      id: "3",
      name: "Holiday Campaign",
      description: "End of year holiday promotional materials",
      platforms: ["Facebook", "Instagram", "Web", "Print"],
      createdAt: "2025-03-20",
      assetCount: 15,
    },
  ]

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Link href="/campaigns/new">
          <Button>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Platforms:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {campaign.platforms.map((platform) => (
                    <span key={platform} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Created: {campaign.createdAt}</span>
                <span>{campaign.assetCount} assets</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/campaigns/${campaign.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Link href={`/campaigns/${campaign.id}/editor`}>
                <Button>Edit Assets</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
