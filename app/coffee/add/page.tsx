"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Coffee } from "@/schema/coffee";
import type { CoffeeCrawl } from "@/schema/coffee-crawl";

export default function AddCoffeePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coffee, setCoffee] = useState<Partial<Coffee>>({
    name_kr: "",
    name_en: "",
    origin: "",
    processing: "",
    farm: "",
    notes: [],
    variety: "",
    altitude: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCoffee((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCoffee((prev) => ({ ...prev, notes: value.split(",").map(n => n.trim()) }));
  };

  const handleFetch = async () => {
    if (!url) {
      setError("Please enter a URL.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, pageType: "product" }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
      }
      const data: { object: CoffeeCrawl } = await res.json();
      const fetchedData = data.object;

      setCoffee((prev) => ({
        ...prev,
        name_kr: fetchedData.name_kr || prev.name_kr,
        name_en: fetchedData.name_en || prev.name_en,
        origin: fetchedData.origin || prev.origin,
        notes: fetchedData.notes || prev.notes,
        description: fetchedData.description || prev.description,
        source_origin_url: fetchedData.source_url,
        // Other fields from coffeeSchema like processing, farm, etc., are not
        // typically available in the crawl data, so they retain their previous values.
      }));

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch data.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save logic
    console.log("Saving coffee data:", coffee);
    alert("Save functionality is not implemented yet.");
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Coffee</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Auto-fill from URL</CardTitle>
          <CardDescription>Enter a URL of a coffee product page to automatically fill in the details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              id="url"
              placeholder="https://example.com/coffee-product"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleFetch} disabled={isLoading}>
              {isLoading ? "Fetching..." : "Fetch Data"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Coffee Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name_kr">Korean Name</Label>
              <Input id="name_kr" name="name_kr" value={coffee.name_kr ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_en">English Name</Label>
              <Input id="name_en" name="name_en" value={coffee.name_en ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" name="origin" value={coffee.origin ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processing">Processing</Label>
              <Input id="processing" name="processing" value={coffee.processing ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm">Farm</Label>
              <Input id="farm" name="farm" value={coffee.farm ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variety">Variety</Label>
              <Input id="variety" name="variety" value={coffee.variety ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altitude">Altitude</Label>
              <Input id="altitude" name="altitude" value={coffee.altitude ?? ""} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Tasting Notes (comma-separated)</Label>
              <Textarea id="notes" name="notes" value={coffee.notes?.join(", ") ?? ""} onChange={handleNotesChange} placeholder="e.g., Apple, Chocolate, Toffee" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={coffee.description ?? ""} onChange={handleInputChange} placeholder="A description of the coffee..." />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save Coffee</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
