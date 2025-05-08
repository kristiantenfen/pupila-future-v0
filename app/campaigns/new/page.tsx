"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { platformOptions } from "@/lib/platform-config"

export default function NewCampaignPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    platforms: [] as string[],
  })

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform]
      return { ...prev, platforms }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the campaign to your backend
    console.log("Creating campaign:", formData)
    // Redirect to the campaign editor
    router.push("/campaigns/new-campaign/editor")
  }

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <h1 className="mb-8 text-3xl font-bold">Create New Campaign</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Enter the basic information about your marketing campaign.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Summer Sale 2025"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the purpose and goals of this campaign"
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <Label>Platforms</Label>
              <p className="text-sm text-gray-500">Select the platforms you want to create assets for.</p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {platformOptions.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={formData.platforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="font-normal cursor-pointer">
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || formData.platforms.length === 0}>
              Create Campaign
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
