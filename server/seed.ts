import { db } from "./db";
import { wallets, transactions, classificationRules, disposals } from "../shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingWallets = await db.select().from(wallets).limit(1);
    if (existingWallets.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with sample data...");

    // Create sample wallets
    const sampleWallets = await db.insert(wallets).values([
      {
        address: "0x742d35Cc6634C0532925a3b844Bc9e7595f5aA53",
        chain: "ethereum",
        label: "Main Trading Wallet",
        entityType: "personal",
        isActive: true,
      },
      {
        address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
        chain: "arbitrum",
        label: "DeFi Wallet",
        entityType: "personal",
        isActive: true,
      },
      {
        address: "0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097",
        chain: "polygon",
        label: "NFT Collection",
        entityType: "personal",
        isActive: true,
      },
    ]).returning();

    // Create sample transactions
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    await db.insert(transactions).values([
      {
        walletId: sampleWallets[0].id,
        txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
        chain: "ethereum",
        timestamp: new Date(now.getTime() - 1 * oneDay),
        tokenIn: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        tokenInAmount: "5000.00",
        tokenInSymbol: "USDC",
        tokenOut: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        tokenOutAmount: "2.5",
        tokenOutSymbol: "ETH",
        classification: "swap",
        classificationConfidence: "0.95",
        needsReview: false,
        contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        methodName: "swapExactTokensForETH",
        gasFee: "0.0025",
        gasFeeUsd: "5.50",
        valueUsd: "5000.00",
      },
      {
        walletId: sampleWallets[0].id,
        txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
        chain: "ethereum",
        timestamp: new Date(now.getTime() - 2 * oneDay),
        tokenIn: "0x6b175474e89094c44da98b954eedeac495271d0f",
        tokenInAmount: "1500.00",
        tokenInSymbol: "DAI",
        tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        tokenOutAmount: "1498.50",
        tokenOutSymbol: "USDC",
        classification: "swap",
        classificationConfidence: "0.92",
        needsReview: false,
        contractAddress: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
        methodName: "swap",
        gasFee: "0.0018",
        gasFeeUsd: "3.80",
        valueUsd: "1500.00",
      },
      {
        walletId: sampleWallets[1].id,
        txHash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
        chain: "arbitrum",
        timestamp: new Date(now.getTime() - 3 * oneDay),
        tokenIn: null,
        tokenInAmount: null,
        tokenInSymbol: null,
        tokenOut: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        tokenOutAmount: "100.00",
        tokenOutSymbol: "GMX",
        classification: "stake",
        classificationConfidence: "0.88",
        needsReview: false,
        contractAddress: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        methodName: "stake",
        gasFee: "0.0002",
        gasFeeUsd: "0.45",
        valueUsd: "4500.00",
      },
      {
        walletId: sampleWallets[1].id,
        txHash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        chain: "arbitrum",
        timestamp: new Date(now.getTime() - 5 * oneDay),
        tokenIn: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        tokenInAmount: "0.05",
        tokenInSymbol: "WETH",
        tokenOut: null,
        tokenOutAmount: null,
        tokenOutSymbol: null,
        classification: "reward",
        classificationConfidence: "0.75",
        needsReview: true,
        contractAddress: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
        methodName: "claimRewards",
        gasFee: "0.0001",
        gasFeeUsd: "0.25",
        valueUsd: "110.00",
      },
      {
        walletId: sampleWallets[0].id,
        txHash: "0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
        chain: "ethereum",
        timestamp: new Date(now.getTime() - 7 * oneDay),
        tokenIn: null,
        tokenInAmount: null,
        tokenInSymbol: null,
        tokenOut: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        tokenOutAmount: "1.5",
        tokenOutSymbol: "ETH",
        classification: "unknown",
        classificationConfidence: "0.35",
        needsReview: true,
        contractAddress: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
        methodName: "fillOrder",
        gasFee: "0.003",
        gasFeeUsd: "6.50",
        valueUsd: "3000.00",
      },
      {
        walletId: sampleWallets[2].id,
        txHash: "0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234",
        chain: "polygon",
        timestamp: new Date(now.getTime() - 10 * oneDay),
        tokenIn: null,
        tokenInAmount: null,
        tokenInSymbol: null,
        tokenOut: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        tokenOutAmount: "0.1",
        tokenOutSymbol: "WETH",
        classification: "nft_mint",
        classificationConfidence: "0.89",
        needsReview: false,
        contractAddress: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
        methodName: "mint",
        gasFee: "0.005",
        gasFeeUsd: "0.50",
        valueUsd: "200.00",
      },
      {
        walletId: sampleWallets[0].id,
        txHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        chain: "ethereum",
        timestamp: new Date(now.getTime() - 15 * oneDay),
        tokenIn: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        tokenInAmount: "250.00",
        tokenInSymbol: "ENS",
        tokenOut: null,
        tokenOutAmount: null,
        tokenOutSymbol: null,
        classification: "airdrop",
        classificationConfidence: "0.92",
        needsReview: false,
        contractAddress: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        methodName: "claim",
        gasFee: "0.002",
        gasFeeUsd: "4.00",
        valueUsd: "4500.00",
      },
      {
        walletId: sampleWallets[1].id,
        txHash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567",
        chain: "arbitrum",
        timestamp: new Date(now.getTime() - 20 * oneDay),
        tokenIn: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        tokenInAmount: "2000.00",
        tokenInSymbol: "USDC",
        tokenOut: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        tokenOutAmount: "1.0",
        tokenOutSymbol: "WETH",
        classification: "lp_deposit",
        classificationConfidence: "0.45",
        needsReview: true,
        contractAddress: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        methodName: "addLiquidity",
        gasFee: "0.0003",
        gasFeeUsd: "0.65",
        valueUsd: "4000.00",
      },
    ]);

    // Create sample classification rules
    await db.insert(classificationRules).values([
      {
        name: "Uniswap V2 Swaps",
        description: "Classify all Uniswap V2 Router swaps",
        contractAddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        methodSignature: "swap",
        classification: "swap",
        priority: 10,
        isActive: true,
      },
      {
        name: "1inch Aggregator",
        description: "Classify 1inch DEX aggregator transactions",
        contractAddress: "0x1111111254fb6c44bAC0beD2854e76F90643097d",
        classification: "swap",
        priority: 9,
        isActive: true,
      },
      {
        name: "ENS Token Claims",
        description: "ENS airdrop claims",
        contractAddress: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        methodSignature: "claim",
        classification: "airdrop",
        priority: 8,
        isActive: true,
      },
    ]);

    // Create sample disposals for tax reporting
    await db.insert(disposals).values([
      {
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        tokenSymbol: "ETH",
        amount: "1.5",
        proceedsUsd: "3200.00",
        costBasisUsd: "2800.00",
        gainLossUsd: "400.00",
        isShortTerm: true,
        disposedAt: new Date(now.getTime() - 30 * oneDay),
      },
      {
        token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        tokenSymbol: "USDC",
        amount: "5000.00",
        proceedsUsd: "5000.00",
        costBasisUsd: "5000.00",
        gainLossUsd: "0.00",
        isShortTerm: false,
        disposedAt: new Date(now.getTime() - 45 * oneDay),
      },
      {
        token: "0x6b175474e89094c44da98b954eedeac495271d0f",
        tokenSymbol: "DAI",
        amount: "2500.00",
        proceedsUsd: "2480.00",
        costBasisUsd: "2500.00",
        gainLossUsd: "-20.00",
        isShortTerm: true,
        disposedAt: new Date(now.getTime() - 60 * oneDay),
      },
      {
        token: "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
        tokenSymbol: "ENS",
        amount: "50.00",
        proceedsUsd: "1250.00",
        costBasisUsd: "0.00",
        gainLossUsd: "1250.00",
        isShortTerm: true,
        disposedAt: new Date(now.getTime() - 90 * oneDay),
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
