import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Banner from "@/app/components/Banner";
import Section from "@/app/components/section";
import { supabase } from "@/app/api/supabase";
import { getRegion } from "../lib/getRegion";
import ProvidersCards from "../components/Cards/ProvidersCards";
import { regions, defaultSections } from "../constant/main";
import { SectionContent } from "../constant/interfaces";

export default function Home() {
  const [sectionsContent, setSectionsContent] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sections_content")
        .select("*")
        .eq("is_active", true)
        .order("id", { ascending: true });

      if (error || !data || data.length === 0) {
        if (error)
          console.error("Error fetching active section content:", error);
        setSectionsContent(defaultSections);
      } else {
        const { region } = await getRegion();
        const countryName = regions[region || "US"] || "USA";
        setSectionsContent(
          data.map((section) => ({
            ...section,
            title: section.title
              .replace("${countryName}", countryName || "USA")
              .replace("{countryName}", countryName || "USA"),
            endpoint: section.endpoint
              .replace("${region}", region || "US")
              .replace("{region}", region || "US"),
          })),
        );
      }
      setLoading(false);
    };

    fetchSections();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#000", flex: 1 }}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <Banner />
      <ProvidersCards />
      {/* Sections */}

      {loading ? (
        <>
          {defaultSections.map((section) => (
            <Section
              key={`ske-${section.endpoint}`}
              endpoint=""
              title={section.title}
              isPlaceholder
            />
          ))}
        </>
      ) : (
        sectionsContent.map((section) => (
          <Section
            key={section.endpoint}
            endpoint={section.endpoint}
            title={section.title}
            mediaType={section.type as "movie" | "tv" | "person"}
          />
        ))
      )}
    </ScrollView>
  );
}
