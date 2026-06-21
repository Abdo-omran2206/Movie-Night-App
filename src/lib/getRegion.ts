import { useStore } from "../store/store";

export async function getRegion() {
  // 1️⃣ Check if region is already set in store (persisted in AsyncStorage)
  const storedRegion = useStore.getState().region;
  if (storedRegion && storedRegion !== "US") {
    return {
      region: storedRegion,
      language: "en",
    };
  }

  const providers = [
    {
      url: "https://ipwho.is/",
      parse: (d: any) => d.country_code,
    },
    {
      url: "https://ipapi.co/json/",
      parse: (d: any) => d.country_code,
    },
    {
      url: "https://extreme-ip-lookup.com/json/",
      parse: (d: any) => d.countryCode,
    },
    {
      url: "https://cloudflare.com/cdn-cgi/trace",
      parse: (d: string) => {
        const lines = d.split("\n");
        const loc = lines.find((line) => line.startsWith("loc="));
        return loc ? loc.split("=")[1] : null;
      },
      isText: true,
    }
  ];

  for (const provider of providers) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(provider.url, { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) continue;

      const data = (provider as any).isText ? await response.text() : await response.json();
      const code = provider.parse(data as any);

      if (code && typeof code === "string") {
        const finalRegion = code.toUpperCase();
        
        // 2️⃣ Set fetched region in store for future use
        useStore.getState().setRegion(finalRegion);

        return {
          region: finalRegion,
          language: "en",
        };
      }
    } catch (err) {
      console.warn(`Region fetcher ${provider.url} failed:`, err);
    }
  }

  // Final fallback if everything fails
  console.error("All region fetchers failed, using default (US)");
  return {
    region: "US",
    language: "en",
  };
}