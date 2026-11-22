/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend address for the production build, e.g. https://tv-shows-explorer-api.onrender.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
