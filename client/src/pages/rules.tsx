import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChainBadge } from "@/components/chain-badge";
import { ClassificationBadge } from "@/components/classification-badge";
import { AddressDisplay } from "@/components/address-display";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { 
  PlusCircle, 
  Settings2,
  MoreVertical,
  Trash2,
  Zap,
  CheckCircle2
} from "lucide-react";
import type { ClassificationRule } from "@shared/schema";
import { SUPPORTED_CHAINS, CLASSIFICATION_TYPES } from "@shared/schema";

const addRuleSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  description: z.string().optional(),
  contractAddress: z.string().optional(),
  methodSignature: z.string().optional(),
  tokenPattern: z.string().optional(),
  chain: z.string().optional(),
  direction: z.string().optional(),
  classification: z.string().min(1, "Classification is required"),
  priority: z.coerce.number().default(0),
});

type AddRuleFormValues = z.infer<typeof addRuleSchema>;

function RuleRow({ rule }: { rule: ClassificationRule }) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/rules/${rule.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
      toast({
        title: "Rule deleted",
        description: "The classification rule has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/rules/${rule.id}`, { isActive: !rule.isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <TableRow className={!rule.isActive ? "opacity-50" : ""}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Switch
            checked={rule.isActive ?? true}
            onCheckedChange={() => toggleMutation.mutate()}
            data-testid={`switch-rule-${rule.id}`}
          />
          <div>
            <span className="font-medium">{rule.name}</span>
            {rule.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        {rule.chain ? <ChainBadge chain={rule.chain} /> : <span className="text-muted-foreground">Any</span>}
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs">
          {rule.contractAddress && (
            <div>
              <span className="text-muted-foreground">Contract: </span>
              <code className="font-mono bg-muted px-1 rounded">
                {rule.contractAddress.slice(0, 10)}...
              </code>
            </div>
          )}
          {rule.methodSignature && (
            <div>
              <span className="text-muted-foreground">Method: </span>
              <code className="font-mono bg-muted px-1 rounded">{rule.methodSignature}</code>
            </div>
          )}
          {rule.tokenPattern && (
            <div>
              <span className="text-muted-foreground">Token: </span>
              <code className="font-mono bg-muted px-1 rounded">{rule.tokenPattern}</code>
            </div>
          )}
          {!rule.contractAddress && !rule.methodSignature && !rule.tokenPattern && (
            <span className="text-muted-foreground">No conditions</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <ClassificationBadge classification={rule.classification} />
      </TableCell>
      <TableCell>
        <Badge variant="outline">{rule.priority ?? 0}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-rule-menu-${rule.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => deleteMutation.mutate()}
              className="text-destructive"
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Rule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function Rules() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: rules, isLoading } = useQuery<ClassificationRule[]>({
    queryKey: ["/api/rules"],
  });

  const form = useForm<AddRuleFormValues>({
    resolver: zodResolver(addRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      contractAddress: "",
      methodSignature: "",
      tokenPattern: "",
      chain: "",
      direction: "",
      classification: "",
      priority: 0,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: AddRuleFormValues) => {
      return await apiRequest("POST", "/api/rules", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rules"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Rule created",
        description: "Your classification rule has been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create rule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddRuleFormValues) => {
    addMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Classification Rules</h1>
          <p className="text-muted-foreground">
            Create custom rules to automatically classify transactions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-rule">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Classification Rule</DialogTitle>
              <DialogDescription>
                Define conditions to automatically classify matching transactions.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Uniswap Swaps" 
                          data-testid="input-rule-name"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What this rule matches" 
                          data-testid="input-rule-description"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="chain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain (optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-rule-chain">
                              <SelectValue placeholder="Any chain" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SUPPORTED_CHAINS.map((chain) => (
                              <SelectItem key={chain} value={chain}>
                                {chain.charAt(0).toUpperCase() + chain.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="classification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classification</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-rule-classification">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CLASSIFICATION_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Address (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0x..." 
                          className="font-mono"
                          data-testid="input-rule-contract"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Match transactions to this contract</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="methodSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method Signature (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., swap, addLiquidity" 
                          className="font-mono"
                          data-testid="input-rule-method"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tokenPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Pattern (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., WETH, USDC" 
                          data-testid="input-rule-token"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          data-testid="input-rule-priority"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Higher priority rules are applied first</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addMutation.isPending}
                    data-testid="button-submit-rule"
                  >
                    {addMutation.isPending ? "Creating..." : "Create Rule"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : rules && rules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead className="w-[100px]">Chain</TableHead>
                  <TableHead className="w-[200px]">Conditions</TableHead>
                  <TableHead className="w-[140px]">Classification</TableHead>
                  <TableHead className="w-[80px]">Priority</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <RuleRow key={rule.id} rule={rule} />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Settings2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No rules yet</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                Create custom rules to automatically classify transactions based on contract, method, or token patterns.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-first-rule">
                <Zap className="h-4 w-4 mr-2" />
                Create Your First Rule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
