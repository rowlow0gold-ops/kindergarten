export type Locale = "ko" | "en";

export const locales: Locale[] = ["ko", "en"];
export const defaultLocale: Locale = "ko";

export function getLocale(url: URL): Locale {
  return url.pathname.startsWith("/en") ? "en" : "ko";
}

// Prefix a path for the current locale. ko = root, en = /en/...
export function localizePath(path: string, locale: Locale): string {
  const clean = "/" + path.replace(/^\/+/, "");
  if (locale === "en") return ("/en" + (clean === "/" ? "" : clean)) || "/en";
  return clean;
}

export const strings = {
  ko: {
    "nav.about": "학교 소개",
    "nav.schools": "캠퍼스",
    "nav.learning": "교육과정",
    "nav.admissions": "입학 안내",
    "nav.contact": "문의하기",
    "nav.apply": "지원하기",
    "nav.milestones": "10주년",
    "cta.curriculum": "교육과정 보기",
    "cta.founders": "설립자 메시지",
    "cta.explore": "자세히 보기",
    "cta.seeMap": "지도 보기",
    "cta.visit": "방문 예약",
    "footer.tagline": "탐구. 질문. 혁신. 더 나은 세상을 만드는 미래의 혁신가를 키웁니다.",
    "footer.quicklinks": "바로가기",
    "footer.rights": "All Rights Reserved.",
    "lang.switch": "EN",
  },
  en: {
    "nav.about": "About",
    "nav.schools": "Campuses",
    "nav.learning": "Learning",
    "nav.admissions": "Admissions",
    "nav.contact": "Contact",
    "nav.apply": "Apply",
    "nav.milestones": "10 Years",
    "cta.curriculum": "See the curriculum",
    "cta.founders": "Founder's message",
    "cta.explore": "Explore",
    "cta.seeMap": "See the map",
    "cta.visit": "Schedule a visit",
    "footer.tagline": "Passion. Inquiry. Innovation. Raising future innovators who change the world for the better.",
    "footer.quicklinks": "Quick links",
    "footer.rights": "All Rights Reserved.",
    "lang.switch": "KO",
  },
} as const;

export function useT(locale: Locale) {
  return (key: keyof typeof strings["ko"]): string => strings[locale][key] ?? strings.ko[key] ?? key;
}
