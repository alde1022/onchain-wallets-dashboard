import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AddressDisplayProps {
  address: string;
  chain?: string;
  truncate?: boolean;
  showCopy?: boolean;
  showLink?: boolean;
  className?: string;
}

const explorerUrls: Record<string, string> = {
  ethereum: "https://etherscan.io/address/",
  arbitrum: "https://arbiscan.io/address/",
  optimism: "https://optimistic.etherscan.io/address/",
  base: "https://basescan.org/address/",
  polygon: "https://polygonscan.com/address/",
  solana: "https://solscan.io/account/",
  bitcoin: "https://blockchain.com/btc/address/",
  avalanche: "https://snowtrace.io/address/",
  bsc: "https://bscscan.com/address/",
};

export function AddressDisplay({ 
  address, 
  chain,
  truncate = true,
  showCopy = true,
  showLink = true,
  className 
}: AddressDisplayProps) {
  const { toast } = useToast();

  const displayAddress = truncate 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  const explorerUrl = chain ? explorerUrls[chain] : null;

  return (
    <div className={`flex items-center gap-1 ${className || ""}`}>
      <code className="font-address bg-muted px-1.5 py-0.5 rounded text-foreground">
        {displayAddress}
      </code>
      {showCopy && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleCopy}
          data-testid="button-copy-address"
        >
          <Copy className="h-3 w-3" />
        </Button>
      )}
      {showLink && explorerUrl && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          asChild
        >
          <a 
            href={`${explorerUrl}${address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            data-testid="link-explorer"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      )}
    </div>
  );
}
