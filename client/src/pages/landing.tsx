import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { 
  Wallet, 
  FileText, 
  Shield, 
  TrendingUp, 
  Zap, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Multi-Chain Support",
    description: "Track wallets across Ethereum, Solana, Bitcoin, and 6+ more blockchains"
  },
  {
    icon: Zap,
    title: "Auto Classification",
    description: "AI-powered transaction classification with intent-aware categorization"
  },
  {
    icon: FileText,
    title: "Tax Reports",
    description: "Generate Form 8949, Schedule D, and comprehensive income reports"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and only accessible to you"
  }
];

const supportedChains = [
  "Ethereum", "Bitcoin", "Solana", "Polygon", 
  "Arbitrum", "Optimism", "Base", "Avalanche", "BSC"
];

const reportTypes = [
  "Form 8949 (Capital Gains)",
  "Schedule D Summary",
  "Income Report",
  "Staking Report",
  "Airdrop Report",
  "NFT Report"
];

export default function LandingPage() {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CryptoTax Pro</span>
          </div>
          <Button onClick={handleLogin} data-testid="button-login-nav">
            Sign In
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </nav>

        <section className="text-center mb-20">
          <Badge variant="secondary" className="mb-4" data-testid="badge-tagline">
            Professional Crypto Tax Software
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-headline">
            Track, Classify & Report
            <br />
            Your Crypto Taxes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="text-subheadline">
            Automatically track transactions across multiple blockchains, 
            classify them with AI, and generate audit-ready tax reports.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleLogin} data-testid="button-get-started">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${index}`}>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <Card data-testid="card-supported-chains">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Supported Blockchains
              </CardTitle>
              <CardDescription>
                Connect wallets from all major networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {supportedChains.map(chain => (
                  <Badge key={chain} variant="outline" data-testid={`badge-chain-${chain.toLowerCase()}`}>
                    {chain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-report-types">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tax Reports
              </CardTitle>
              <CardDescription>
                Generate all required tax documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {reportTypes.map(report => (
                  <li key={report} className="flex items-center gap-2 text-sm" data-testid={`text-report-${report.replace(/\s+/g, '-').toLowerCase()}`}>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {report}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center py-12 border-t">
          <h2 className="text-2xl font-bold mb-4" data-testid="text-cta-heading">
            Ready to simplify your crypto taxes?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of traders who trust CryptoTax Pro for accurate reporting
          </p>
          <Button size="lg" onClick={handleLogin} data-testid="button-cta-login">
            Get Started Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </section>

        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>&copy; {new Date().getFullYear()} CryptoTax Pro. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
