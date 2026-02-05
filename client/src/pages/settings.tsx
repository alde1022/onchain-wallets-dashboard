import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Link2, 
  Unlink, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Bell
} from "lucide-react";
import { useState } from "react";

interface TelegramStatus {
  configured: boolean;
  linked: boolean;
  verified: boolean;
  username: string | null;
}

interface LinkResponse {
  verificationCode: string;
  instructions: string;
}

export default function Settings() {
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const { data: telegramStatus, isLoading } = useQuery<TelegramStatus>({
    queryKey: ["/api/telegram/status"],
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/telegram/link");
      return response.json() as Promise<LinkResponse>;
    },
    onSuccess: (data) => {
      setVerificationCode(data.verificationCode);
      queryClient.invalidateQueries({ queryKey: ["/api/telegram/status"] });
    },
    onError: async (error: Error & { response?: Response }) => {
      let message = "Failed to generate verification code.";
      try {
        if (error.response) {
          const data = await error.response.json();
          message = data.message || data.error || message;
        }
      } catch {}
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/telegram/link");
    },
    onSuccess: () => {
      setVerificationCode(null);
      queryClient.invalidateQueries({ queryKey: ["/api/telegram/status"] });
      toast({
        title: "Telegram unlinked",
        description: "You will no longer receive notifications on Telegram.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unlink Telegram. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyCode = () => {
    if (verificationCode) {
      navigator.clipboard.writeText(verificationCode);
      toast({
        title: "Copied!",
        description: "Verification code copied to clipboard.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and integrations
        </p>
      </div>

      <Card data-testid="card-telegram-settings">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10">
              <MessageCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Telegram Notifications
                {telegramStatus?.verified && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Get instant notifications when transactions need classification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : !telegramStatus?.configured ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-600 dark:text-amber-400">Telegram Bot Not Configured</p>
                <p className="text-sm text-muted-foreground mt-1">
                  To enable Telegram notifications, add TELEGRAM_BOT_TOKEN to your secrets.
                  Create a bot via @BotFather on Telegram to get your token.
                </p>
              </div>
            </div>
          ) : telegramStatus?.verified ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Connected to Telegram
                    </p>
                    {telegramStatus.username && (
                      <p className="text-sm text-muted-foreground">
                        @{telegramStatus.username}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => unlinkMutation.mutate()}
                  disabled={unlinkMutation.isPending}
                  data-testid="button-unlink-telegram"
                >
                  <Unlink className="h-4 w-4 mr-2" />
                  Unlink
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  You'll receive notifications for:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                  <li>New transactions that need classification</li>
                  <li>Transactions flagged for review</li>
                </ul>
              </div>
            </div>
          ) : verificationCode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground mb-3">
                  Send this code to your Telegram bot to verify your account:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-3 rounded-md bg-background font-mono text-2xl tracking-widest text-center border" data-testid="text-verification-code">
                    {verificationCode}
                  </code>
                  <Button variant="outline" size="icon" onClick={copyCode} data-testid="button-copy-code">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => linkMutation.mutate()}
                  disabled={linkMutation.isPending}
                  data-testid="button-regenerate-code"
                >
                  Generate New Code
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/telegram/status"] })}
                >
                  I've sent the code
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Link your Telegram account to receive instant notifications when:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                <li>New transactions are synced that need classification</li>
                <li>You can classify transactions directly from Telegram</li>
              </ul>
              
              <Button 
                onClick={() => linkMutation.mutate()}
                disabled={linkMutation.isPending}
                data-testid="button-link-telegram"
              >
                <Link2 className="h-4 w-4 mr-2" />
                {linkMutation.isPending ? "Generating code..." : "Link Telegram Account"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
