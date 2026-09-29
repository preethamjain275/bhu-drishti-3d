import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { navGroups } from "@/lib/navigation";
import { Map, AlertTriangle, Database, LayoutDashboard } from "lucide-react";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search parcels, entities, conflicts, sources..." />
      <CommandList>
        <CommandEmpty>No matches in this workspace.</CommandEmpty>
        
        <CommandGroup heading="PARCELS (Demo)">
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/data-sources" }); }}>
              <Map className="mr-2 h-4 w-4 text-primary" />
              <span>PARCEL-DEMO-001</span>
           </CommandItem>
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/data-sources" }); }}>
              <Map className="mr-2 h-4 w-4 text-primary" />
              <span>PARCEL-DEMO-002</span>
           </CommandItem>
        </CommandGroup>

        <CommandGroup heading="CONFLICTS (Demo)">
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/conflicts" }); }}>
              <AlertTriangle className="mr-2 h-4 w-4 text-conflict" />
              <span>CONFLICT-001</span>
           </CommandItem>
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/conflicts" }); }}>
              <AlertTriangle className="mr-2 h-4 w-4 text-conflict" />
              <span>CONFLICT-002</span>
           </CommandItem>
        </CommandGroup>

        <CommandGroup heading="SOURCES (Demo)">
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/data-sources" }); }}>
              <Database className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Municipal GIS</span>
           </CommandItem>
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/data-sources" }); }}>
              <Database className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Property Registry</span>
           </CommandItem>
        </CommandGroup>

        <CommandGroup heading="ACTIONS">
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/conflicts" }); }}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-ivory" />
              <span>Open Conflict Explorer</span>
           </CommandItem>
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/intelligence-3d" }); }}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-ivory" />
              <span>Open 3D Intelligence</span>
           </CommandItem>
           <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/verification" }); }}>
              <LayoutDashboard className="mr-2 h-4 w-4 text-ivory" />
              <span>Open Verification Queue</span>
           </CommandItem>
        </CommandGroup>
        
        {navGroups.map((group) => (
          <CommandGroup key={group.title} heading={`MODULES - ${group.title}`}>
            {group.items.map((item) => (
              <CommandItem
                key={item.to}
                value={`${item.label} ${item.hint}`}
                onSelect={() => {
                  onOpenChange(false);
                  navigate({ to: item.to });
                }}
              >
                <item.icon className="mr-2 h-4 w-4 text-primary" />
                <span>{item.label}</span>
                <span className="ml-auto truncate text-xs text-muted-foreground">{item.hint}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
