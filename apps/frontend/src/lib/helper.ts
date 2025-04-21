export const getToken = () => {
      if (typeof window !== "undefined") {
         const token = localStorage.getItem("DEV_SECRET_VAULT_AUTH_TOKEN");
         return token ? token : null;
      }
      return null;
   }
   


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