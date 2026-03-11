import {
  posterUrlHighMovie,
  posterUrlMedium,
  posterUrlMediumMovie,
  posterUrlLow,
  posterUrlLowMovie,
  backdropUrlHighMovie,
  backdropUrlMedium,
  backdropUrlMediumMovie,
  backdropUrlLow,
  backdropUrlLowMovie,
  CastUrlHigh,
  CastUrlMedium,
  CastUrlLow,
} from "../constant/main";

export type ImageQuality = "High" | "Medium" | "Low";

type UseCase = "card" | "detail";

export const getImageUrl = (
  setting: ImageQuality | boolean,
  useCase: UseCase = "card",
) => {
  // Backwards compatibility if user's persisted state is boolean
  let quality: ImageQuality;
  if (typeof setting === "boolean") {
    quality = setting ? "Low" : "High";
  } else {
    quality = setting;
  }

  let posterImage, backdropImage, castImage;

  if (useCase === "detail") {
    // Detail case: High fidelity
    if (quality === "High") {
      posterImage = posterUrlHighMovie;
      backdropImage = backdropUrlHighMovie;
      castImage = CastUrlHigh;
    } else if (quality === "Medium") {
      posterImage = posterUrlMediumMovie;
      backdropImage = backdropUrlMediumMovie;
      castImage = CastUrlMedium;
    } else {
      posterImage = posterUrlLowMovie;
      backdropImage = backdropUrlLowMovie;
      castImage = CastUrlLow;
    }
  } else {
    // Card case: Balanced / Low quality to save data
    // Map: High -> Medium, Medium -> Low, Low -> Low
    const cardQuality: ImageQuality = quality === "High" ? "Medium" : "Low";

    switch (cardQuality) {
      case "Low":
        posterImage = posterUrlLow;
        backdropImage = backdropUrlLow;
        castImage = CastUrlLow;
        break;
      case "Medium":
        posterImage = posterUrlMedium;
        backdropImage = backdropUrlMedium;
        castImage = CastUrlMedium;
        break;
      default:
        posterImage = posterUrlLow;
        backdropImage = backdropUrlLow;
        castImage = CastUrlLow;
        break;
    }
  }

  return {
    posterImage,
    backdropImage,
    castImage,
  };
};
