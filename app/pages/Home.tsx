import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Banner from "@/app/components/Banner";
import Section from "@/app/components/section";
import { supabase } from "@/app/api/supabase";
import { getRegion } from "../lib/getRegion";

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  vote_average?: number;
};

type SectionContent = {
  id?: number;
  title: string;
  endpoint: string;
  type: string;
  is_active?: boolean;
};

const defaultSections: SectionContent[] = [
  { endpoint: "/movie/popular", title: "Popular Movies", type: "movie" },
  { endpoint: "/tv/popular", title: "Popular TV Shows", type: "tv" },
  { endpoint: "/movie/top_rated", title: "Top Rated Movies", type: "movie" },
  { endpoint: "/tv/top_rated", title: "Top Rated TV Shows", type: "tv" },
  {
    endpoint: "/movie/now_playing",
    title: "Now Playing Movies",
    type: "movie",
  },
  { endpoint: "/tv/now_playing", title: "Now Playing TV Shows", type: "tv" },
  { endpoint: "/tv/airing_today", title: "Airing Today TV Shows", type: "tv" },
  { endpoint: "/movie/upcoming", title: "Coming Soon Movies", type: "movie" },
  { endpoint: "/tv/on_the_air", title: "Coming Soon TV Shows", type: "tv" },
  {
    endpoint: "/discover/movie?vote_average.gte=7.5&vote_count.gte=1000",
    title: "Critically Acclaimed Movies",
    type: "movie",
  },
  {
    endpoint: "/discover/movie?with_genres=28",
    title: "Action Movies",
    type: "movie",
  },
  {
    endpoint: "/discover/movie?with_genres=35",
    title: "Comedy Movies",
    type: "movie",
  },
];

export default function Home() {
  const [sectionsContent, setSectionsContent] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(true);
  const regions: Record<string, string> = {
    EG: "Egypt",
    US: "USA",
    GB: "UK",
    SA: "Saudi Arabia",
    AE: "UAE",
    FR: "France",
    DE: "Germany",
    CA: "Canada",
    AU: "Australia",
    IT: "Italy",
    ES: "Spain",
  };
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
    <ScrollView style={{ backgroundColor: "#000", flex: 1 }}>
      <Banner />
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
