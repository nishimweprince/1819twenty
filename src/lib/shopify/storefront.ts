import "server-only";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { env } from "../env";

export const SHOPIFY_API_VERSION = env.SHOPIFY_API_VERSION;

export function getStorefrontClient() {
  if (!env.SHOPIFY_STORE_DOMAIN || !env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) return null;
  return createStorefrontApiClient({
    storeDomain: env.SHOPIFY_STORE_DOMAIN,
    apiVersion: SHOPIFY_API_VERSION,
    publicAccessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    clientName: "eighteen-nineteen-twenty-nextjs",
  });
}

export async function storefrontRequest<TData, TVariables extends Record<string, unknown> = Record<string, never>>(query: string, variables?: TVariables) {
  const client = getStorefrontClient();
  if (!client) throw new Error("Shopify Storefront API is not configured.");
  const response = await client.request<TData>(query, { variables });
  if (response.errors) throw new Error("Shopify returned an error for the storefront request.");
  return response.data;
}
