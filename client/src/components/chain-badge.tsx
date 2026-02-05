import { Badge } from "@/components/ui/badge";
import type { Chain } from "@shared/schema";

const chainColors: Record<string, { bg: string; text: string }> = {
  ethereum: { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300" },
  arbitrum: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  optimism: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300" },
  base: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  polygon: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
  solana: { bg: "bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/40 dark:to-cyan-900/40", text: "text-purple-700 dark:text-purple-300" },
  bitcoin: { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300" },
  avalanche: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-300" },
  bsc: { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-300" },
};

const chainLabels: Record<string, string> = {
  ethereum: "Ethereum",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
  base: "Base",
  polygon: "Polygon",
  solana: "Solana",
  bitcoin: "Bitcoin",
  avalanche: "Avalanche",
  bsc: "BSC",
};

interface ChainBadgeProps {
  chain: string;
  className?: string;
}

export function ChainBadge({ chain, className }: ChainBadgeProps) {
  const colors = chainColors[chain] || { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" };
  const label = chainLabels[chain] || chain;

  return (
    <Badge 
      variant="outline" 
      className={`${colors.bg} ${colors.text} border-0 font-medium text-xs ${className || ""}`}
    >
      {label}
    </Badge>
  );
}
