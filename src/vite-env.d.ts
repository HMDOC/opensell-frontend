/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT: number;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_JWT_SECRET_KEY: string;
    readonly VITE_IMAGES_SERVER_URL: string;
    readonly VITE_AD_IMAGES_FOLDER: string; 
    readonly VITE_CUSTOMER_PROFILE_FOLDER: string; 
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }