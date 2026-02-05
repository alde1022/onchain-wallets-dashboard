import { Badge } from "@/components/ui/badge";
import type { ClassificationType } from "@shared/schema";
import { 
  ArrowLeftRight, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Repeat,
  Gift,
  ImageIcon,
  DollarSign,
  Percent,
  Skull,
  Package,
  ArrowRight,
  HelpCircle,
  Lock,
  Unlock
} from "lucide-react";

const classificationConfig: Record<string, { 
  label: string; 
  icon: React.ElementType;
  color: string;
}> = {
  swap: { label: "Swap", icon: ArrowLeftRight, color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
  lp_deposit: { label: "LP Deposit", icon: TrendingDown, color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  lp_withdraw: { label: "LP Withdraw", icon: TrendingUp, color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
  stake: { label: "Stake", icon: Lock, color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" },
  unstake: { label: "Unstake", icon: Unlock, color: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300" },
  borrow: { label: "Borrow", icon: TrendingDown, color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  repay: { label: "Repay", icon: TrendingUp, color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
  bridge: { label: "Bridge", icon: Repeat, color: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300" },
  airdrop: { label: "Airdrop", icon: Gift, color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  vesting: { label: "Vesting", icon: Coins, color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  nft_mint: { label: "NFT Mint", icon: ImageIcon, color: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
  nft_sale: { label: "NFT Sale", icon: ImageIcon, color: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
  reward: { label: "Reward", icon: Gift, color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  interest: { label: "Interest", icon: Percent, color: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300" },
  liquidation: { label: "Liquidation", icon: Skull, color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  wrap: { label: "Wrap", icon: Package, color: "bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300" },
  unwrap: { label: "Unwrap", icon: Package, color: "bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300" },
  migration: { label: "Migration", icon: ArrowRight, color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
  self_transfer: { label: "Self Transfer", icon: ArrowRight, color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  income: { label: "Income", icon: DollarSign, color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
  expense: { label: "Expense", icon: TrendingDown, color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  unknown: { label: "Unknown", icon: HelpCircle, color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300" },
};

interface ClassificationBadgeProps {
  classification: string;
  confidence?: string | null;
  showConfidence?: boolean;
  className?: string;
}

export function ClassificationBadge({ 
  classification, 
  confidence,
  showConfidence = false,
  className 
}: ClassificationBadgeProps) {
  const config = classificationConfig[classification] || classificationConfig.unknown;
  const Icon = config.icon;
  const confidenceValue = confidence ? parseFloat(confidence) : null;

  return (
    <div className={`flex items-center gap-1.5 ${className || ""}`}>
      <Badge 
        variant="outline" 
        className={`${config.color} border-0 font-medium text-xs flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
      {showConfidence && confidenceValue !== null && (
        <span className={`text-xs ${
          confidenceValue >= 0.8 ? "text-green-600 dark:text-green-400" :
          confidenceValue >= 0.5 ? "text-yellow-600 dark:text-yellow-400" :
          "text-red-600 dark:text-red-400"
        }`}>
          {Math.round(confidenceValue * 100)}%
        </span>
      )}
    </div>
  );
}
