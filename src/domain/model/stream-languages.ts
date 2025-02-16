// prettier-ignore
export const streamLanguages = [
  // 1–10
  { label: "🇺🇸 English", value: "en" },      // ~1.5 billion
  { label: "🇨🇳 Chinese", value: "zh" },      // ~1.1–1.2 billion
  { label: "🇮🇳 Hindi", value: "hi" },        // ~600 million
  { label: "🇪🇸 Spanish", value: "es" },      // ~550 million
  { label: "🇸🇦 Arabic", value: "ar" },       // ~350–400 million
  { label: "🇫🇷 French", value: "fr" },       // ~280–300 million
  { label: "🇧🇩 Bengali", value: "bn" },      // ~280 million
  { label: "🇷🇺 Russian", value: "ru" },      // ~260 million
  { label: "🇵🇹 Portuguese", value: "pt" },   // ~260 million
  { label: "🇵🇰 Urdu", value: "ur" },         // ~230 million

  // 11–20
  { label: "🇮🇩 Indonesian", value: "id" },   // ~200 million
  { label: "🇹🇿 Swahili", value: "sw" },      // ~150–200 million
  { label: "🇩🇪 German", value: "de" },       // ~130 million
  { label: "🇯🇵 Japanese", value: "ja" },     // ~125–130 million
  { label: "🇮🇳 Marathi", value: "mr" },      // ~90–100 million
  { label: "🇮🇳 Telugu", value: "te" },       // ~90 million
  { label: "🇮🇳 Punjabi", value: "pa" },      // ~90 million
  { label: "🇮🇳 Tamil", value: "ta" },        // ~80 million
  { label: "🇹🇷 Turkish", value: "tr" },      // ~80 million
  { label: "🇮🇩 Javanese", value: "jw" },     // ~80 million

  // 21–30
  { label: "🇰🇷 Korean", value: "ko" },       // ~75–80 million
  { label: "🇻🇳 Vietnamese", value: "vi" },   // ~75 million
  { label: "🇮🇷 Persian", value: "fa" },      // ~70 million (some estimates up to 100m)
  { label: "🇮🇹 Italian", value: "it" },      // ~65 million
  { label: "🇹🇭 Thai", value: "th" },         // ~60 million
  { label: "🇮🇳 Gujarati", value: "gu" },     // ~55 million
  { label: "🇳🇬 Hausa", value: "ha" },        // ~50 million
  { label: "🇲🇾 Malay", value: "ms" },        // If combined with Indonesian, over 200 million
  { label: "🇵🇱 Polish", value: "pl" },       // ~40 million
  { label: "🇮🇳 Malayalam", value: "ml" },    // ~35 million

  // 31–40
  { label: "🇦🇫 Pashto", value: "ps" },       // ~40 million (approx.)
  { label: "🇮🇳 Odia (Oriya)", value: "or" }, // ~35 million (approx.)
  { label: "🇮🇩 Sundanese", value: "su" },    // ~35 million (approx.)
  { label: "🇺🇿 Uzbek", value: "uz" },        // ~35 million (approx.)
  { label: "🇲🇲 Myanmar (Burmese)", value: "my" }, // ~30–35 million (approx.)
  { label: "🇺🇦 Ukrainian", value: "uk" },    // ~30 million
  { label: "🇪🇹 Amharic", value: "am" },      // ~25–30 million
  { label: "🇵🇰 Sindhi", value: "sd" },       // ~25 million (approx.)
  { label: "🇮🇶 Kurdish", value: "ku" },      // ~20–30 million
  { label: "🇳🇵 Nepali", value: "ne" },       // ~17–20 million

  // 41–50
  { label: "🇷🇴 Romanian", value: "ro" },     // ~24 million
  { label: "🇵🇭 Tagalog (Filipino)", value: "tl" }, // ~28 million (combined w/ second-language speakers)
  { label: "🇳🇬 Yoruba", value: "yo" },       // ~28 million
  { label: "🇿🇦 Zulu", value: "zu" },         // ~12 million (L1), ~27 million total
  { label: "🇵🇭 Cebuano", value: "ceb" },     // ~20+ million
  { label: "🇳🇬 Igbo", value: "ig" },         // ~27 million
  { label: "🇲🇬 Malagasy", value: "mg" },     // ~25 million
  { label: "🇳🇱 Dutch", value: "nl" },        // ~24 million
  { label: "🇦🇿 Azerbaijani", value: "az" },  // ~23 million
  { label: "🇸🇴 Somali", value: "so" },       // ~20 million

  // 51–60
  { label: "🇿🇦 Xhosa", value: "xh" },        // ~8–10 million
  { label: "🇿🇦 Afrikaans", value: "af" },    // ~17 million (L1+L2)
  { label: "🇱🇰 Sinhala", value: "si" },      // ~17 million
  { label: "🇰🇭 Khmer", value: "km" },        // ~16 million
  { label: "🇬🇷 Greek", value: "el" },        // ~13 million
  { label: "🇭🇺 Hungarian", value: "hu" },    // ~13 million
  { label: "🇰🇿 Kazakh", value: "kk" },       // ~13 million
  { label: "🇲🇼 Nyanja (Chichewa)", value: "ny" }, // ~12–15 million
  { label: "🇿🇼 Shona", value: "sn" },        // ~10–15 million
  { label: "🇨🇿 Czech", value: "cs" },        // ~10 million

  // 61–70
  { label: "🇭🇹 Haitian Creole", value: "ht" }, // ~10–12 million
  { label: "🇸🇪 Swedish", value: "sv" },      // ~10 million
  { label: "🇨🇳 Uyghur", value: "ug" },       // ~10 million
  { label: "🇪🇸 Catalan", value: "ca" },      // ~10 million
  { label: "🇮🇱 Hebrew", value: "he" },       // ~9 million
  { label: "🇹🇲 Turkmen", value: "tk" },      // ~7–9 million
  { label: "🇷🇸 Serbian", value: "sr" },      // ~7–8 million
  { label: "🇹🇯 Tajik", value: "tg" },        // ~7–8 million
  { label: "🇧🇬 Bulgarian", value: "bg" },    // ~7 million
  { label: "🇱🇸 Sesotho", value: "st" },      // ~6 million

  // 71–80
  { label: "🇧🇾 Belarusian", value: "be" },   // ~6 million
  { label: "🇦🇱 Albanian", value: "sq" },     // ~5–7 million
  { label: "🇦🇲 Armenian", value: "hy" },     // ~6–7 million
  { label: "🇭🇷 Croatian", value: "hr" },     // ~5–6 million
  { label: "🇩🇰 Danish", value: "da" },       // ~5–6 million
  { label: "🇲🇳 Mongolian", value: "mn" },    // ~5–6 million
  { label: "🇸🇰 Slovak", value: "sk" },       // ~5 million
  { label: "🇰🇬 Kyrgyz", value: "ky" },       // ~4–5 million
  { label: "🇳🇴 Norwegian", value: "no" },    // ~5 million
  { label: "🇧🇦 Bosnian", value: "bs" },      // ~3–4 million

  // 81–90
  { label: "🇱🇦 Lao", value: "lo" },          // ~3–7 million (varies)
  { label: "🇱🇹 Lithuanian", value: "lt" },   // ~3 million
  { label: "🇪🇸 Galician", value: "gl" },     // ~2–3 million
  { label: "🇸🇮 Slovenian", value: "sl" },    // ~2–2.5 million
  { label: "🇱🇻 Latvian", value: "lv" },      // ~2 million
  { label: "🇲🇰 Macedonian", value: "mk" },   // ~2 million
  { label: "🇮🇪 Irish", value: "ga" },        // ~1.8 million (L2 mostly)
  { label: "🇮🇱 Yiddish", value: "yi" },      // ~1.5 million
  { label: "🇪🇪 Estonian", value: "et" },     // ~1.1 million
  { label: "🏴 Welsh", value: "cy" },        // ~700k–1 million

  // 91+
  { label: "🇱🇺 Luxembourgish", value: "lb" }, // ~600k
  { label: "🇲🇹 Maltese", value: "mt" },       // ~500k
  { label: "🇳🇱 Frisian", value: "fy" },       // ~500k
  { label: "🇼🇸 Samoan", value: "sm" },        // ~500k
  { label: "🇮🇸 Icelandic", value: "is" },     // ~370k
  { label: "🇫🇷 Corsican", value: "co" },      // ~150k–200k
  { label: "🇳🇿 Maori", value: "mi" },         // ~150k–200k
  { label: "🏴 Scots Gaelic", value: "gd" },  // ~60k–100k
  { label: "🇺🇸 Hawaiian", value: "haw" },     // ~25k–30k
  { label: "🇫🇮 Finnish", value: "fi" },       // ~5.5 million
  { label: "🇬🇪 Georgian", value: "ka" },      // ~4 million
  { label: "🇮🇳 Kannada", value: "kn" },       // ~45 million
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unsortedStreamLanguages = [
  { label: "🇿🇦 Afrikaans", value: "af" },
  { label: "🇦🇱 Albanian", value: "sq" },
  { label: "🇪🇹 Amharic", value: "am" },
  { label: "🇸🇦 Arabic", value: "ar" },
  { label: "🇦🇲 Armenian", value: "hy" },
  { label: "🇦🇿 Azerbaijani", value: "az" },
  { label: "🇪🇸 Basque", value: "eu" },
  { label: "🇧🇾 Belarusian", value: "be" },
  { label: "🇧🇩 Bengali", value: "bn" },
  { label: "🇧🇦 Bosnian", value: "bs" },
  { label: "🇧🇬 Bulgarian", value: "bg" },
  { label: "🇪🇸 Catalan", value: "ca" },
  { label: "🇵🇭 Cebuano", value: "ceb" },
  { label: "🇨🇳 Chinese", value: "zh" },
  { label: "🇫🇷 Corsican", value: "co" },
  { label: "🇭🇷 Croatian", value: "hr" },
  { label: "🇨🇿 Czech", value: "cs" },
  { label: "🇩🇰 Danish", value: "da" },
  { label: "🇳🇱 Dutch", value: "nl" },
  { label: "🇺🇸 English", value: "en" },
  // { label: "Esperanto", value: "eo" },
  { label: "🇪🇪 Estonian", value: "et" },
  { label: "🇫🇮 Finnish", value: "fi" },
  { label: "🇫🇷 French", value: "fr" },
  { label: "🇳🇱 Frisian", value: "fy" },
  { label: "🇪🇸 Galician", value: "gl" },
  { label: "🇬🇪 Georgian", value: "ka" },
  { label: "🇩🇪 German", value: "de" },
  { label: "🇬🇷 Greek", value: "el" },
  { label: "🇮🇳 Gujarati", value: "gu" },
  { label: "🇭🇹 Haitian Creole", value: "ht" },
  { label: "🇳🇬 Hausa", value: "ha" },
  { label: "🇺🇸 Hawaiian", value: "haw" },
  { label: "🇮🇱 Hebrew", value: "he" },
  { label: "🇮🇳 Hindi", value: "hi" },
  // { label: "Hmong", value: "hmn" },
  { label: "🇭🇺 Hungarian", value: "hu" },
  { label: "🇮🇸 Icelandic", value: "is" },
  { label: "🇳🇬 Igbo", value: "ig" },
  { label: "🇮🇩 Indonesian", value: "id" },
  { label: "🇮🇪 Irish", value: "ga" },
  { label: "🇮🇹 Italian", value: "it" },
  { label: "🇯🇵 Japanese", value: "ja" },
  { label: "🇮🇩 Javanese", value: "jw" },
  { label: "🇮🇳 Kannada", value: "kn" },
  { label: "🇰🇿 Kazakh", value: "kk" },
  { label: "🇰🇭 Khmer", value: "km" },
  { label: "🇰🇷 Korean", value: "ko" },
  { label: "🇮🇶 Kurdish", value: "ku" },
  { label: "🇰🇬 Kyrgyz", value: "ky" },
  { label: "🇱🇦 Lao", value: "lo" },
  // { label: "Latin", value: "la" },
  { label: "🇱🇻 Latvian", value: "lv" },
  { label: "🇱🇹 Lithuanian", value: "lt" },
  { label: "🇱🇺 Luxembourgish", value: "lb" },
  { label: "🇲🇰 Macedonian", value: "mk" },
  { label: "🇲🇬 Malagasy", value: "mg" },
  { label: "🇲🇾 Malay", value: "ms" },
  { label: "🇮🇳 Malayalam", value: "ml" },
  { label: "🇲🇹 Maltese", value: "mt" },
  { label: "🇳🇿 Maori", value: "mi" },
  { label: "🇮🇳 Marathi", value: "mr" },
  { label: "🇲🇳 Mongolian", value: "mn" },
  { label: "🇲🇲 Myanmar (Burmese)", value: "my" },
  { label: "🇳🇵 Nepali", value: "ne" },
  { label: "🇳🇴 Norwegian", value: "no" },
  { label: "🇲🇼 Nyanja (Chichewa)", value: "ny" },
  { label: "🇮🇳 Odia (Oriya)", value: "or" },
  { label: "🇦🇫 Pashto", value: "ps" },
  { label: "🇮🇷 Persian", value: "fa" },
  { label: "🇵🇱 Polish", value: "pl" },
  { label: "🇵🇹 Portuguese", value: "pt" },
  { label: "🇮🇳 Punjabi", value: "pa" },
  { label: "🇷🇴 Romanian", value: "ro" },
  { label: "🇷🇺 Russian", value: "ru" },
  { label: "🇼🇸 Samoan", value: "sm" },
  { label: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scots Gaelic", value: "gd" },
  { label: "🇷🇸 Serbian", value: "sr" },
  { label: "🇱🇸 Sesotho", value: "st" },
  { label: "🇿🇼 Shona", value: "sn" },
  { label: "🇵🇰 Sindhi", value: "sd" },
  { label: "🇱🇰 Sinhala", value: "si" },
  { label: "🇸🇰 Slovak", value: "sk" },
  { label: "🇸🇮 Slovenian", value: "sl" },
  { label: "🇸🇴 Somali", value: "so" },
  { label: "🇪🇸 Spanish", value: "es" },
  { label: "🇮🇩 Sundanese", value: "su" },
  { label: "🇹🇿 Swahili", value: "sw" },
  { label: "🇸🇪 Swedish", value: "sv" },
  { label: "🇵🇭 Tagalog (Filipino)", value: "tl" },
  { label: "🇹🇯 Tajik", value: "tg" },
  { label: "🇮🇳 Tamil", value: "ta" },
  { label: "🇮🇳 Telugu", value: "te" },
  { label: "🇹🇭 Thai", value: "th" },
  { label: "🇹🇷 Turkish", value: "tr" },
  { label: "🇹🇲 Turkmen", value: "tk" },
  { label: "🇺🇦 Ukrainian", value: "uk" },
  { label: "🇵🇰 Urdu", value: "ur" },
  { label: "🇨🇳 Uyghur", value: "ug" },
  { label: "🇺🇿 Uzbek", value: "uz" },
  { label: "🇻🇳 Vietnamese", value: "vi" },
  { label: "🏴󠁧󠁢󠁷󠁬󠁳󠁿 Welsh", value: "cy" },
  { label: "🇿🇦 Xhosa", value: "xh" },
  { label: "🇮🇱 Yiddish", value: "yi" },
  { label: "🇳🇬 Yoruba", value: "yo" },
  { label: "🇿🇦 Zulu", value: "zu" },
];
