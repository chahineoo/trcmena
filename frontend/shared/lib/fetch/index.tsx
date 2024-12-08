import axios from "axios";

import {backendGuardarianUrl} from "@/shared/lib/config";
import {backendBaseUrl} from "@/shared/lib/config/backend";

export const apiClientGuardarian = axios.create({
  baseURL: backendGuardarianUrl,
});

export const apiClientBase = axios.create({
  baseURL: backendBaseUrl,
  headers: {
    'User-Agent': 'TRC-edu',
    'ngrok-skip-browser-warning': '1'
  }
});
