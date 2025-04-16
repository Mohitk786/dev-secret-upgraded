
export const QUERY_KEYS = {
  VAULTS: "vaults",
  VAULT: (id: string) => ["vault", id],
  USER: "user",
  SECRETS: "secrets",
  SECRET: (id: string) => ["secret", id],
  VAULT_SECRETS: "vault_secrets",
};
