"use server";

import { cookies } from "next/headers";

export async function getCurrentTenant(): Promise<string> {
  const cookieStore = cookies();
  return (await cookieStore).get("tenant")?.value || "Dubaieid";
}
