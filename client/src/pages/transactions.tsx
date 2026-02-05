import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChainBadge } from "@/components/chain-badge";
import { ClassificationBadge } from "@/components/classification-badge";
import { AddressDisplay } from "@/components/address-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Filter,
  ArrowLeftRight,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import type { Transaction } from "@shared/schema";
import { SUPPORTED_CHAINS, CLASSIFICATION_TYPES } from "@shared/schema";
import { format } from "date-fns";

function formatCurrency(value: string | number | null): string {
  if (!value) return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function formatAmount(value: string | number | null, decimals: number = 4): string {
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

function TransactionRow({ tx }: { tx: Transaction }) {
  const explorerUrl = explorerTxUrls[tx.chain];

  return (
    <TableRow className="hover-elevate">
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {format(new Date(tx.timestamp), "MMM d, yyyy")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(tx.timestamp), "HH:mm:ss")}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <ChainBadge chain={tx.chain} />
      </TableCell>
      <TableCell>
        <ClassificationBadge 
          classification={tx.classification || "unknown"} 
          confidence={tx.classificationConfidence}
          showConfidence
        />
        {tx.needsReview && (
          <Badge variant="outline" className="ml-2 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Review
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {tx.tokenOutSymbol && tx.tokenOutAmount && (
            <div className="text-sm text-loss">
              -{formatAmount(tx.tokenOutAmount)} {tx.tokenOutSymbol}
            </div>
          )}
          {tx.tokenInSymbol && tx.tokenInAmount && (
            <div className="text-sm text-gain">
              +{formatAmount(tx.tokenInAmount)} {tx.tokenInSymbol}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-medium">{formatCurrency(tx.valueUsd)}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-muted-foreground text-sm">
          {tx.gasFeeUsd ? formatCurrency(tx.gasFeeUsd) : "-"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <AddressDisplay 
            address={tx.txHash} 
            chain={tx.chain} 
            showCopy 
            showLink={false}
          />
          {explorerUrl && (
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <a 
                href={`${explorerUrl}${tx.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chainFilter, setChainFilter] = useState<string>("all");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");

  const queryParams = new URLSearchParams();
  if (chainFilter !== "all") queryParams.set("chain", chainFilter);
  if (classificationFilter !== "all") queryParams.set("classification", classificationFilter);
  const queryString = queryParams.toString();
  
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions" + (queryString ? `?${queryString}` : "")],
  });

  const filteredTransactions = transactions?.filter((tx) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTxHash = tx.txHash.toLowerCase().includes(query);
      const matchesToken = 
        tx.tokenInSymbol?.toLowerCase().includes(query) ||
        tx.tokenOutSymbol?.toLowerCase().includes(query);
      if (!matchesTxHash && !matchesToken) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all your cryptocurrency transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash or token..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-transactions"
              />
            </div>
            <div className="flex gap-2">
              <Select value={chainFilter} onValueChange={setChainFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-chain-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <SelectItem key={chain} value={chain}>
                      {chain.charAt(0).toUpperCase() + chain.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={classificationFilter} onValueChange={setClassificationFilter}>
                <SelectTrigger className="w-[160px]" data-testid="select-classification-filter">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {CLASSIFICATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : filteredTransactions && filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[100px]">Chain</TableHead>
                    <TableHead className="w-[180px]">Type</TableHead>
                    <TableHead>Tokens</TableHead>
                    <TableHead className="text-right w-[120px]">Value</TableHead>
                    <TableHead className="text-right w-[100px]">Fee</TableHead>
                    <TableHead className="w-[180px]">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <ArrowLeftRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No transactions found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {searchQuery || chainFilter !== "all" || classificationFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Add a wallet to start importing transaction history."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
