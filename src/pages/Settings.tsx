import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, Building2, Plug, Bell, Shield, Database, 
  Camera, Globe, Clock, DollarSign, Plus, Trash2, 
  Copy, ExternalLink, Key, Webhook,
  Smartphone, Monitor, LogOut, Download
} from 'lucide-react';

const webhookEvents = [
  'transaction.created',
  'transaction.updated',
  'report.generated',
  'alert.triggered',
  'sync.completed',
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User },
    { id: 'business', label: 'Business Information', icon: Building2 },
    { id: 'integrations', label: 'Custom Integrations', icon: Plug },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="card-glass overflow-x-auto">
          <CardContent className="p-2">
            <TabsList className="w-full justify-start bg-transparent gap-1 flex-wrap h-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary px-4 py-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </CardContent>
        </Card>

        {/* Profile & Account */}
        <TabsContent value="profile">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Profile & Account</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo Upload */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-2xl bg-primary/20 text-primary">JD</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Change Photo
                </Button>
              </div>

              {/* Personal Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@magollafarm.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+254 712 345 678" className="mt-1" />
                </div>
              </div>

              {/* Password Change */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">Change Password</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">Preferences</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger className="mt-1">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select defaultValue="eat">
                      <SelectTrigger className="mt-1">
                        <Clock className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select defaultValue="kes">
                      <SelectTrigger className="mt-1">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kes">KES - Kenyan Shilling</SelectItem>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Information */}
        <TabsContent value="business">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Configure your farm's business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="Magolla Farm" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select defaultValue="poultry">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poultry">Poultry Farm</SelectItem>
                      <SelectItem value="dairy">Dairy Farm</SelectItem>
                      <SelectItem value="mixed">Mixed Farm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="Kiambu County, Kenya" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID / PIN</Label>
                  <Input id="taxId" placeholder="Enter Tax ID" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
                  <Select defaultValue="jan">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">January</SelectItem>
                      <SelectItem value="apr">April</SelectItem>
                      <SelectItem value="jul">July</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="border-t border-border pt-4">
                <Label>Business Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <Button className="mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Webhook Management */}
            <Card className="card-glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Webhook className="w-4 h-4" />
                      Webhook Management
                    </CardTitle>
                    <CardDescription>Configure webhooks to receive real-time updates from external services</CardDescription>
                  </div>
                  <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Webhook
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Webhook</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="webhookName">Webhook Name</Label>
                          <Input id="webhookName" placeholder="e.g., Payment Notifications" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="webhookUrl">Webhook URL</Label>
                          <Input id="webhookUrl" placeholder="https://your-server.com/webhook" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="secretKey">Secret Key (Optional)</Label>
                          <Input id="secretKey" type="password" placeholder="For signature verification" className="mt-1" />
                        </div>
                        <div>
                          <Label>Events to Subscribe</Label>
                          <div className="mt-2 space-y-2">
                            {webhookEvents.map((event) => (
                              <label key={event} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox />
                                <span className="text-sm">{event}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="retryAttempts">Retry Attempts</Label>
                            <Input id="retryAttempts" type="number" defaultValue="3" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="timeout">Timeout (seconds)</Label>
                            <Input id="timeout" type="number" defaultValue="30" className="mt-1" />
                          </div>
                        </div>
                        <Button className="w-full">Create Webhook</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Webhook className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">No webhooks configured yet</p>
                  <p className="text-xs text-muted-foreground">Add a webhook to receive real-time notifications when events occur</p>
                </div>
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="card-glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Keys
                    </CardTitle>
                    <CardDescription>Generate API keys for programmatic access to your data</CardDescription>
                  </div>
                  <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Generate Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Generate API Key</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="keyName">Key Name</Label>
                          <Input id="keyName" placeholder="e.g., Production API Key" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="keyDescription">Description (Optional)</Label>
                          <Input id="keyDescription" placeholder="What will this key be used for?" className="mt-1" />
                        </div>
                        <div>
                          <Label>Permissions</Label>
                          <div className="mt-2 space-y-2">
                            {['Read transactions', 'Write transactions', 'Generate reports', 'Manage webhooks'].map((perm) => (
                              <label key={perm} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox />
                                <span className="text-sm">{perm}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Expiration</Label>
                          <Select defaultValue="never">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="never">Never expires</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Generate Key</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-center py-8 flex-1">
                    <Key className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">No API keys created yet</p>
                    <p className="text-xs text-muted-foreground">Generate a key to access your data programmatically</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button variant="link" size="sm" className="gap-1">
                    <ExternalLink className="w-3 h-3" />
                    View API Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="font-medium mb-4">Email Notifications</h4>
                <div className="space-y-3">
                  {['Daily summary', 'Weekly reports', 'Payment received', 'Payment overdue', 'Low inventory alerts'].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <Switch defaultChecked={item !== 'Weekly reports'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">Push Notifications</h4>
                <div className="space-y-3">
                  {['New transactions', 'Payment reminders', 'Security alerts'].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">SMS Notifications</h4>
                <div className="space-y-3">
                  {['Critical alerts only', 'Large transactions (>KES 50,000)'].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <span className="text-sm">{item}</span>
                      <Switch />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">Quiet Hours</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <Label>From</Label>
                    <Input type="time" defaultValue="22:00" className="mt-1 w-32" />
                  </div>
                  <div>
                    <Label>To</Label>
                    <Input type="time" defaultValue="07:00" className="mt-1 w-32" />
                  </div>
                </div>
              </div>

              <Button className="mt-4">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Two-Factor Auth */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>

                {/* Active Sessions */}
                <div>
                  <h4 className="font-medium mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Chrome on MacOS</p>
                          <p className="text-xs text-muted-foreground">Nairobi, Kenya • Current session</p>
                        </div>
                      </div>
                      <span className="text-xs text-success">Active now</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Safari on iPhone</p>
                          <p className="text-xs text-muted-foreground">Nairobi, Kenya • 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Trusted Devices */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium mb-4">Trusted Devices</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Devices that won't require two-factor authentication
                  </p>
                  <Button variant="outline" size="sm">Manage Devices</Button>
                </div>

                {/* Account Deletion */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data & Backup */}
        <TabsContent value="data">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Data & Backup</CardTitle>
              <CardDescription>Export your data and manage backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Data */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-medium">Export All Data</p>
                  <p className="text-sm text-muted-foreground">Download all your data in a portable format</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Manual Backup */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div>
                  <p className="font-medium">Create Backup</p>
                  <p className="text-sm text-muted-foreground">Create a manual backup of your data</p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Database className="w-4 h-4" />
                  Backup Now
                </Button>
              </div>

              {/* Backup History */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium mb-4">Backup History</h4>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-15', size: '2.4 MB', status: 'success' },
                    { date: '2024-01-08', size: '2.3 MB', status: 'success' },
                    { date: '2024-01-01', size: '2.1 MB', status: 'success' },
                  ].map((backup) => (
                    <div key={backup.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{backup.date}</p>
                          <p className="text-xs text-muted-foreground">{backup.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-success capitalize">{backup.status}</span>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
