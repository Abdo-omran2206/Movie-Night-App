import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export default function generateMovieAvatar(title: string, size = 150): string {
  const avatar = createAvatar(initials, {
    seed: title, // يخلي كل فيلم له أفاتار فريد
    size: size, // حجم الصورة بالبكسل
    radius: 5, // الزوايا rounded
    fontWeight: 700, // سمك الحروف
    backgroundColor: ["transparent"], // dark vibe
    textColor: ["e5e7eb"], // لون الحروف
    fontSize: 50, // حجم الحروف داخل poster
  });

  // لو React Native
  return avatar.toString(); // SVG string
  // لو Web Data URI: return avatar.toDataUri();
}
