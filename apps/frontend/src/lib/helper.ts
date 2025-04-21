export const getToken = () => {
      return localStorage.getItem("DEV_SECRET_VAULT_AUTH_TOKEN");
   
};

export const setToken = (token: string) => {
   if (typeof window !== "undefined") {
      localStorage.setItem("DEV_SECRET_VAULT_AUTH_TOKEN", token);
   }
};

export const removeToken = () => {
   if (typeof window !== "undefined") {
      localStorage.removeItem("DEV_SECRET_VAULT_AUTH_TOKEN");
   }
};