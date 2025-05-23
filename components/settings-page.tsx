"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SettingsPage() {
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: "Delicious Restaurant",
    address: "123 Main Street, City, Country",
    phone: "+1 (555) 123-4567",
    email: "contact@deliciousrestaurant.com",
    description: "A fine dining restaurant serving the best dishes in town.",
    openingHours: "Mon-Fri: 10:00 AM - 10:00 PM\nSat-Sun: 11:00 AM - 11:00 PM",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    stockAlerts: true,
  })

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRestaurantSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const { user, loading } = useAuth()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    try {
      // Here you would typically update the user's profile in your database
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant and account settings</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="general">Restaurant</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'User'} />
                      <AvatarFallback>
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" size="sm" className="w-full">
                      Change
                    </Button>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input id="name" name="name" value={restaurantSettings.name} onChange={handleRestaurantChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={handleRestaurantChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={restaurantSettings.phone} onChange={handleRestaurantChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={restaurantSettings.address}
                    onChange={handleRestaurantChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={restaurantSettings.description}
                  onChange={handleRestaurantChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="openingHours">Opening Hours</Label>
                <Textarea
                  id="openingHours"
                  name="openingHours"
                  value={restaurantSettings.openingHours}
                  onChange={handleRestaurantChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orderNotifications">Order Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("orderNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketingEmails">Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange("marketingEmails", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="stockAlerts">Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts when items are low in stock</p>
                </div>
                <Switch
                  id="stockAlerts"
                  checked={notificationSettings.stockAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("stockAlerts", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how your dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="h-4 w-4 rounded-full bg-background mr-2 border"></span>
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="h-4 w-4 rounded-full bg-slate-950 mr-2"></span>
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="h-4 w-4 rounded-full bg-background mr-2 border border-slate-950/50"></span>
                    System
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-blue-500"></span>
                    <span className="sr-only">Blue</span>
                  </Button>
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-green-500"></span>
                    <span className="sr-only">Green</span>
                  </Button>
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-red-500"></span>
                    <span className="sr-only">Red</span>
                  </Button>
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-purple-500"></span>
                    <span className="sr-only">Purple</span>
                  </Button>
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-orange-500"></span>
                    <span className="sr-only">Orange</span>
                  </Button>
                  <Button variant="outline" className="justify-center h-8 w-8 p-0 rounded-full">
                    <span className="h-4 w-4 rounded-full bg-slate-500"></span>
                    <span className="sr-only">Slate</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
