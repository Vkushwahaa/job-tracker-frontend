// src/services/gmail.ts
import { api } from "./api";

export const getGmailStatus = async () => {
  const res = await api.get("/auth/gmail/status");
  return res.data;
};

export const connectGmail = async () => {
  const res = await api.get("/auth/gmail/connect");
  return res.data; // { url }
};

export const syncGmail = async () => {
  const res = await api.post("/auth/gmail/sync");
  return res.data;
};
