import { NavLink } from 'react-router-dom';
import { Leaf, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' },
];

export function DesktopNavbar() {
  return (
    <header className="hidden sm:block bg-card/80 border-b border-border sticky top-0 z-40 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Profile */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="/placeholder.svg" alt="John Doe" />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">John Doe</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <NavLink to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Account Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right whitespace-nowrap">
              <p className="text-sm font-semibold text-foreground">Magolla Farm</p>
              <p className="text-micro text-muted-foreground">Financial Dashboard</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
