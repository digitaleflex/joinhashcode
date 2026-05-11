"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { countries } from "@/lib/countries"

interface CountrySelectorProps {
  value: string
  onChange: (value: string) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-card/30 border-border/40 h-14 rounded-2xl text-left font-normal hover:bg-card/50 hover:border-primary/30 transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
              {value
                ? countries.find((country) => country.value === value)?.label
                : "Choisir mon pays..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-30" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-1 border-border/40 bg-background/80 backdrop-blur-xl shadow-2xl rounded-2xl"
        align="start"
      >
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-border/10 px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground/50 mr-2" />
            <CommandInput 
              placeholder="Rechercher..." 
              className="h-9 border-none focus:ring-0 bg-transparent text-sm placeholder:text-muted-foreground/50" 
            />
          </div>
          <CommandList className="max-h-[280px] overflow-y-auto scrollbar-none custom-scrollbar">
            <CommandEmpty className="py-6 text-xs text-muted-foreground font-mono uppercase text-center">Aucun résultat</CommandEmpty>
            <CommandGroup className="p-1">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="relative flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 
                             data-[selected=true]:bg-primary/5 data-[selected=true]:text-primary
                             hover:bg-primary/5 hover:text-primary group"
                >
                  <div className="flex items-center w-full gap-3">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300",
                      value === country.value ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    )} />
                    <span className="flex-1 text-sm font-medium tracking-tight">{country.label}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-primary transition-all duration-300",
                        value === country.value ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
