import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChainBadge } from "@/components/chain-badge";
import { ClassificationBadge } from "@/components/classification-badge";
import { AddressDisplay } from "@/components/address-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle,
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles
} from "lucide-react";
import type { Transaction, ClassificationType } from "@shared/schema";
import { CLASSIFICATION_TYPES } from "@shared/schema";
import { format } from "date-fns";

const classificationOptions: { value: ClassificationType; label: string; description: string }[] = [
  { value: "swap", label: "Swap", description: "Exchange one token for another" },
  { value: "stake", label: "Stake", description: "Lock tokens for rewards" },
  { value: "unstake", label: "Unstake", description: "Unlock staked tokens" },
  { value: "lp_deposit", label: "Provide Liquidity", description: "Add tokens to a liquidity pool" },
  { value: "lp_withdraw", label: "Withdraw Liquidity", description: "Remove tokens from a pool" },
  { value: "bridge", label: "Bridge", description: "Move tokens between chains" },
  { value: "borrow", label: "Borrow", description: "Take a loan using collateral" },
  { value: "repay", label: "Repay", description: "Pay back a borrowed amount" },
  { value: "airdrop", label: "Airdrop", description: "Received free tokens" },
  { value: "reward", label: "Reward / Income", description: "Staking or other rewards" },
  { value: "nft_mint", label: "NFT Mint", description: "Created or purchased an NFT" },
  { value: "nft_sale", label: "NFT Sale", description: "Sold an NFT" },
  { value: "self_transfer", label: "Self Transfer", description: "Moved between your own wallets" },
];

function formatAmount(value: string | number | null, decimals: number = 6): string {
  if (!value) return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  return num.toFixed(decimals);
}

const explorerTxUrls: Record<string, string> = {
  ethereum: "https://etherscan.io/tx/",
  arbitrum: "https://arbiscan.io/tx/",
  optimism: "https://optimistic.etherscan.io/tx/",
  base: "https://basescan.org/tx/",
  polygon: "https://polygonscan.com/tx/",
  solana: "https://solscan.io/tx/",
  bitcoin: "https://blockchain.com/btc/tx/",
  avalanche: "https://snowtrace.io/tx/",
  bsc: "https://bscscan.com/tx/",
};

function ReviewCard({ tx, onClassify }: { tx: Transaction; onClassify: (classification: string) => void }) {
  const explorerUrl = explorerTxUrls[tx.chain];

  return (
    <Card className="border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-900/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
              <HelpCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <CardTitle className="text-base">Help us classify this transaction</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <ChainBadge chain={tx.chain} />
                <span>{format(new Date(tx.timestamp), "MMM d, yyyy HH:mm")}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tx.classificationConfidence && (
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {Math.round(parseFloat(tx.classificationConfidence) * 100)}% confidence
              </Badge>
            )}
            {explorerUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={`${explorerUrl}${tx.txHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-background p-4 border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block mb-1">Transaction Hash</span>
              <AddressDisplay address={tx.txHash} chain={tx.chain} />
            </div>
            {tx.contractAddress && (
              <div>
                <span className="text-muted-foreground block mb-1">Contract</span>
                <AddressDisplay address={tx.contractAddress} chain={tx.chain} />
              </div>
            )}
            <div>
              <span className="text-muted-foreground block mb-1">Tokens Out</span>
              {tx.tokenOutSymbol ? (
                <span className="font-medium text-loss">
                  -{formatAmount(tx.tokenOutAmount)} {tx.tokenOutSymbol}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">Tokens In</span>
              {tx.tokenInSymbol ? (
                <span className="font-medium text-gain">
                  +{formatAmount(tx.tokenInAmount)} {tx.tokenInSymbol}
                </span>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
          {tx.methodName && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-muted-foreground text-sm">Method: </span>
              <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                {tx.methodName}
              </code>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium mb-3">What best describes this transaction?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {classificationOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className="h-auto py-2 px-3 justify-start hover-elevate"
                onClick={() => onClassify(option.value)}
                data-testid={`button-classify-${option.value}`}
              >
                <div className="text-left">
                  <span className="font-medium text-sm block">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Review() {
  const { toast } = useToast();

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions?needsReview=true"],
  });

  const classifyMutation = useMutation({
    mutationFn: async ({ id, classification }: { id: string; classification: string }) => {
      return await apiRequest("PATCH", `/api/transactions/${id}/classify`, { classification });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Transaction classified",
        description: "The classification has been saved and will be applied to similar transactions.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to classify transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClassify = (txId: string, classification: string) => {
    classifyMutation.mutate({ id: txId, classification });
  };

  const needsReviewTransactions = transactions?.filter((tx) => tx.needsReview);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Needs Review</h1>
          <p className="text-muted-foreground">
            Help classify transactions we couldn't automatically identify
          </p>
        </div>
        {needsReviewTransactions && needsReviewTransactions.length > 0 && (
          <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400">
            <AlertCircle className="h-3 w-3 mr-1" />
            {needsReviewTransactions.length} pending
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : needsReviewTransactions && needsReviewTransactions.length > 0 ? (
        <div className="space-y-4">
          {needsReviewTransactions.map((tx) => (
            <ReviewCard 
              key={tx.id} 
              tx={tx} 
              onClassify={(classification) => handleClassify(tx.id, classification)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">All caught up!</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              All your transactions have been classified. New transactions needing review will appear here.
            </p>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/transactions">
                View All Transactions
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
