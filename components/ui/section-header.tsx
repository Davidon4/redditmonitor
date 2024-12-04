import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({ 
  title, 
  description, 
  className,
  align = "center" 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      "max-w-3xl mb-12",
      align === "center" ? "mx-auto text-center" : "",
      className
    )}>
      <h2 className="text-3xl font-bold tracking-tight mb-4 text-slate-900">
        {title}
      </h2>
      <p className="text-lg text-slate-600">
        {description}
      </p>
    </div>
  );
}