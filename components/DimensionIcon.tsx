import {
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const ICON_MAP = {
  Sparkles,
  ShieldCheck,
  Rocket,
  HeartHandshake,
  Users,
} as const;

type DimensionIconProps = {
  name: keyof typeof ICON_MAP;
  className?: string;
};

export function DimensionIcon({ name, className }: DimensionIconProps) {
  const Icon = ICON_MAP[name] ?? Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
