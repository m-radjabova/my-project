
export type FlagQuestion = {
  id: string;
  country: string;
  flag: string;
  options: string[];
  continent: string;
  difficulty: "easy" | "medium" | "hard";
};

export const FLAG_QUESTIONS: FlagQuestion[] = [
  { id: "uz", country: "O'zbekiston", flag: "https://flagcdn.com/w320/uz.png", options: ["O'zbekiston", "Qozog'iston", "Turkmaniston", "Tojikiston"], continent: "Osiyo", difficulty: "easy" },
  { id: "jp", country: "Yaponiya", flag: "https://flagcdn.com/w320/jp.png", options: ["Yaponiya", "Xitoy", "Koreya", "Tailand"], continent: "Osiyo", difficulty: "easy" },
  { id: "cn", country: "Xitoy", flag: "https://flagcdn.com/w320/cn.png", options: ["Xitoy", "Yaponiya", "Koreya", "Vyetnam"], continent: "Osiyo", difficulty: "easy" },
  { id: "in", country: "Hindiston", flag: "https://flagcdn.com/w320/in.png", options: ["Hindiston", "Pokiston", "Bangladesh", "Nepal"], continent: "Osiyo", difficulty: "medium" },

  { id: "de", country: "Germaniya", flag: "https://flagcdn.com/w320/de.png", options: ["Germaniya", "Fransiya", "Italiya", "Ispaniya"], continent: "Yevropa", difficulty: "easy" },
  { id: "fr", country: "Fransiya", flag: "https://flagcdn.com/w320/fr.png", options: ["Fransiya", "Germaniya", "Italiya", "Ispaniya"], continent: "Yevropa", difficulty: "easy" },
  { id: "it", country: "Italiya", flag: "https://flagcdn.com/w320/it.png", options: ["Italiya", "Fransiya", "Ispaniya", "Gretsiya"], continent: "Yevropa", difficulty: "easy" },
  { id: "gb", country: "Buyuk Britaniya", flag: "https://flagcdn.com/w320/gb.png", options: ["Buyuk Britaniya", "Irlandiya", "Shotlandiya", "Uels"], continent: "Yevropa", difficulty: "medium" },

  { id: "us", country: "AQSH", flag: "https://flagcdn.com/w320/us.png", options: ["AQSH", "Kanada", "Meksika", "Kuba"], continent: "Shimoliy Amerika", difficulty: "easy" },
  { id: "ca", country: "Kanada", flag: "https://flagcdn.com/w320/ca.png", options: ["Kanada", "AQSH", "Meksika", "Grenlandiya"], continent: "Shimoliy Amerika", difficulty: "easy" },
  { id: "mx", country: "Meksika", flag: "https://flagcdn.com/w320/mx.png", options: ["Meksika", "Ispaniya", "Argentina", "Kolumbiya"], continent: "Shimoliy Amerika", difficulty: "medium" },

  { id: "br", country: "Braziliya", flag: "https://flagcdn.com/w320/br.png", options: ["Braziliya", "Argentina", "Kolumbiya", "Peru"], continent: "Janubiy Amerika", difficulty: "easy" },
  { id: "ar", country: "Argentina", flag: "https://flagcdn.com/w320/ar.png", options: ["Argentina", "Braziliya", "Urugvay", "Chili"], continent: "Janubiy Amerika", difficulty: "medium" },

  { id: "eg", country: "Misr", flag: "https://flagcdn.com/w320/eg.png", options: ["Misr", "Liviya", "Sudan", "Jazoir"], continent: "Afrika", difficulty: "medium" },
  { id: "za", country: "Janubiy Afrika", flag: "https://flagcdn.com/w320/za.png", options: ["Janubiy Afrika", "Namibiya", "Zimbabve", "Mozambik"], continent: "Afrika", difficulty: "hard" },
  { id: "ng", country: "Nigeriya", flag: "https://flagcdn.com/w320/ng.png", options: ["Nigeriya", "Gana", "Kot-d'Ivuar", "Kamerun"], continent: "Afrika", difficulty: "hard" },

  { id: "au", country: "Avstraliya", flag: "https://flagcdn.com/w320/au.png", options: ["Avstraliya", "Yangi Zelandiya", "Fiji", "Papua Yangi Gvineya"], continent: "Okeaniya", difficulty: "easy" },
  { id: "nz", country: "Yangi Zelandiya", flag: "https://flagcdn.com/w320/nz.png", options: ["Yangi Zelandiya", "Avstraliya", "Fiji", "Samoa"], continent: "Okeaniya", difficulty: "medium" },

  // вњ… QoвЂshimcha (jami 60)

  // Yevropa
  { id: "es", country: "Ispaniya", flag: "https://flagcdn.com/w320/es.png", options: ["Ispaniya", "Portugaliya", "Italiya", "Fransiya"], continent: "Yevropa", difficulty: "easy" },
  { id: "pt", country: "Portugaliya", flag: "https://flagcdn.com/w320/pt.png", options: ["Portugaliya", "Ispaniya", "Italiya", "Gretsiya"], continent: "Yevropa", difficulty: "medium" },
  { id: "nl", country: "Niderlandiya", flag: "https://flagcdn.com/w320/nl.png", options: ["Niderlandiya", "Belgiya", "Fransiya", "Daniya"], continent: "Yevropa", difficulty: "medium" },
  { id: "be", country: "Belgiya", flag: "https://flagcdn.com/w320/be.png", options: ["Belgiya", "Niderlandiya", "Germaniya", "Fransiya"], continent: "Yevropa", difficulty: "medium" },
  { id: "se", country: "Shvetsiya", flag: "https://flagcdn.com/w320/se.png", options: ["Shvetsiya", "Norvegiya", "Finlandiya", "Daniya"], continent: "Yevropa", difficulty: "medium" },
  { id: "no", country: "Norvegiya", flag: "https://flagcdn.com/w320/no.png", options: ["Norvegiya", "Shvetsiya", "Finlandiya", "Islandiya"], continent: "Yevropa", difficulty: "medium" },
  { id: "fi", country: "Finlandiya", flag: "https://flagcdn.com/w320/fi.png", options: ["Finlandiya", "Shvetsiya", "Norvegiya", "Daniya"], continent: "Yevropa", difficulty: "medium" },
  { id: "dk", country: "Daniya", flag: "https://flagcdn.com/w320/dk.png", options: ["Daniya", "Norvegiya", "Shvetsiya", "Finlandiya"], continent: "Yevropa", difficulty: "medium" },
  { id: "pl", country: "Polsha", flag: "https://flagcdn.com/w320/pl.png", options: ["Polsha", "Chexiya", "Slovakiya", "Vengriya"], continent: "Yevropa", difficulty: "easy" },
  { id: "cz", country: "Chexiya", flag: "https://flagcdn.com/w320/cz.png", options: ["Chexiya", "Polsha", "Slovakiya", "Avstriya"], continent: "Yevropa", difficulty: "medium" },
  { id: "sk", country: "Slovakiya", flag: "https://flagcdn.com/w320/sk.png", options: ["Slovakiya", "Chexiya", "Vengriya", "Polsha"], continent: "Yevropa", difficulty: "medium" },
  { id: "hu", country: "Vengriya", flag: "https://flagcdn.com/w320/hu.png", options: ["Vengriya", "Polsha", "Ruminiya", "Slovakiya"], continent: "Yevropa", difficulty: "medium" },
  { id: "ro", country: "Ruminiya", flag: "https://flagcdn.com/w320/ro.png", options: ["Ruminiya", "Bolgariya", "Serbiya", "Vengriya"], continent: "Yevropa", difficulty: "medium" },
  { id: "bg", country: "Bolgariya", flag: "https://flagcdn.com/w320/bg.png", options: ["Bolgariya", "Ruminiya", "Serbiya", "Gretsiya"], continent: "Yevropa", difficulty: "hard" },
  { id: "gr", country: "Gretsiya", flag: "https://flagcdn.com/w320/gr.png", options: ["Gretsiya", "Turkiya", "Italiya", "Ispaniya"], continent: "Yevropa", difficulty: "medium" },
  { id: "tr", country: "Turkiya", flag: "https://flagcdn.com/w320/tr.png", options: ["Turkiya", "Gretsiya", "Ruminiya", "Bolgariya"], continent: "Yevropa", difficulty: "easy" },
  { id: "ua", country: "Ukraina", flag: "https://flagcdn.com/w320/ua.png", options: ["Ukraina", "Rossiya", "Belarus", "Polsha"], continent: "Yevropa", difficulty: "easy" },
  { id: "by", country: "Belarus", flag: "https://flagcdn.com/w320/by.png", options: ["Belarus", "Ukraina", "Rossiya", "Polsha"], continent: "Yevropa", difficulty: "hard" },
  { id: "ru", country: "Rossiya", flag: "https://flagcdn.com/w320/ru.png", options: ["Rossiya", "Ukraina", "Polsha", "Serbiya"], continent: "Yevropa", difficulty: "easy" },

  // Osiyo
  { id: "kr", country: "Janubiy Koreya", flag: "https://flagcdn.com/w320/kr.png", options: ["Janubiy Koreya", "Shimoliy Koreya", "Yaponiya", "Xitoy"], continent: "Osiyo", difficulty: "medium" },
  { id: "kp", country: "Shimoliy Koreya", flag: "https://flagcdn.com/w320/kp.png", options: ["Shimoliy Koreya", "Janubiy Koreya", "Xitoy", "Vyetnam"], continent: "Osiyo", difficulty: "hard" },
  { id: "th", country: "Tailand", flag: "https://flagcdn.com/w320/th.png", options: ["Tailand", "Vyetnam", "Kambodja", "Laos"], continent: "Osiyo", difficulty: "medium" },
  { id: "vn", country: "Vyetnam", flag: "https://flagcdn.com/w320/vn.png", options: ["Vyetnam", "Tailand", "Malayziya", "Filippin"], continent: "Osiyo", difficulty: "medium" },
  { id: "ph", country: "Filippin", flag: "https://flagcdn.com/w320/ph.png", options: ["Filippin", "Malayziya", "Indoneziya", "Tailand"], continent: "Osiyo", difficulty: "hard" },
  { id: "my", country: "Malayziya", flag: "https://flagcdn.com/w320/my.png", options: ["Malayziya", "Indoneziya", "Filippin", "Singapur"], continent: "Osiyo", difficulty: "hard" },
  { id: "id", country: "Indoneziya", flag: "https://flagcdn.com/w320/id.png", options: ["Indoneziya", "Malayziya", "Singapur", "Filippin"], continent: "Osiyo", difficulty: "medium" },
  { id: "sg", country: "Singapur", flag: "https://flagcdn.com/w320/sg.png", options: ["Singapur", "Malayziya", "Indoneziya", "Filippin"], continent: "Osiyo", difficulty: "hard" },
  { id: "pk", country: "Pokiston", flag: "https://flagcdn.com/w320/pk.png", options: ["Pokiston", "Hindiston", "Bangladesh", "Nepal"], continent: "Osiyo", difficulty: "medium" },
  { id: "bd", country: "Bangladesh", flag: "https://flagcdn.com/w320/bd.png", options: ["Bangladesh", "Pokiston", "Hindiston", "Nepal"], continent: "Osiyo", difficulty: "hard" },
  { id: "np", country: "Nepal", flag: "https://flagcdn.com/w320/np.png", options: ["Nepal", "Bhutan", "Hindiston", "Bangladesh"], continent: "Osiyo", difficulty: "hard" },
  { id: "sa", country: "Saudiya Arabistoni", flag: "https://flagcdn.com/w320/sa.png", options: ["Saudiya Arabistoni", "BAA", "Qatar", "Ummon"], continent: "Osiyo", difficulty: "hard" },
  { id: "ae", country: "BAA", flag: "https://flagcdn.com/w320/ae.png", options: ["BAA", "Saudiya Arabistoni", "Qatar", "Bahrayn"], continent: "Osiyo", difficulty: "medium" },
  { id: "qa", country: "Qatar", flag: "https://flagcdn.com/w320/qa.png", options: ["Qatar", "BAA", "Bahrayn", "Kuvayt"], continent: "Osiyo", difficulty: "hard" },
  { id: "il", country: "Isroil", flag: "https://flagcdn.com/w320/il.png", options: ["Isroil", "Gretsiya", "Finlandiya", "Serbiya"], continent: "Osiyo", difficulty: "easy" },

  // Afrika
  { id: "dz", country: "Jazoir", flag: "https://flagcdn.com/w320/dz.png", options: ["Jazoir", "Marokash", "Tunis", "Liviya"], continent: "Afrika", difficulty: "medium" },
  { id: "ma", country: "Marokash", flag: "https://flagcdn.com/w320/ma.png", options: ["Marokash", "Tunis", "Jazoir", "Misr"], continent: "Afrika", difficulty: "medium" },
  { id: "tn", country: "Tunis", flag: "https://flagcdn.com/w320/tn.png", options: ["Tunis", "Marokash", "Jazoir", "Misr"], continent: "Afrika", difficulty: "medium" },
  { id: "ly", country: "Liviya", flag: "https://flagcdn.com/w320/ly.png", options: ["Liviya", "Sudan", "Misr", "Jazoir"], continent: "Afrika", difficulty: "hard" },
  { id: "sd", country: "Sudan", flag: "https://flagcdn.com/w320/sd.png", options: ["Sudan", "Misr", "Efiopiya", "Liviya"], continent: "Afrika", difficulty: "hard" },
  { id: "ke", country: "Keniya", flag: "https://flagcdn.com/w320/ke.png", options: ["Keniya", "Tanzaniya", "Uganda", "Efiopiya"], continent: "Afrika", difficulty: "hard" },
  { id: "tz", country: "Tanzaniya", flag: "https://flagcdn.com/w320/tz.png", options: ["Tanzaniya", "Keniya", "Uganda", "Kongo"], continent: "Afrika", difficulty: "hard" },
  { id: "ug", country: "Uganda", flag: "https://flagcdn.com/w320/ug.png", options: ["Uganda", "Keniya", "Tanzaniya", "Ruanda"], continent: "Afrika", difficulty: "hard" },
  { id: "et", country: "Efiopiya", flag: "https://flagcdn.com/w320/et.png", options: ["Efiopiya", "Keniya", "Somali", "Sudan"], continent: "Afrika", difficulty: "hard" },

  // Shimoliy Amerika
  { id: "cu", country: "Kuba", flag: "https://flagcdn.com/w320/cu.png", options: ["Kuba", "Dominikan Respublikasi", "Gaiti", "Meksika"], continent: "Shimoliy Amerika", difficulty: "medium" },
  { id: "ht", country: "Gaiti", flag: "https://flagcdn.com/w320/ht.png", options: ["Gaiti", "Dominikan Respublikasi", "Kuba", "Yamayka"], continent: "Shimoliy Amerika", difficulty: "hard" },
  { id: "do", country: "Dominikan Respublikasi", flag: "https://flagcdn.com/w320/do.png", options: ["Dominikan Respublikasi", "Gaiti", "Kuba", "Yamayka"], continent: "Shimoliy Amerika", difficulty: "hard" },
  { id: "jm", country: "Yamayka", flag: "https://flagcdn.com/w320/jm.png", options: ["Yamayka", "Kuba", "Gaiti", "Dominikan Respublikasi"], continent: "Shimoliy Amerika", difficulty: "hard" },

  // Janubiy Amerika
  { id: "cl", country: "Chili", flag: "https://flagcdn.com/w320/cl.png", options: ["Chili", "Argentina", "Peru", "Boliviya"], continent: "Janubiy Amerika", difficulty: "medium" },
  { id: "co", country: "Kolumbiya", flag: "https://flagcdn.com/w320/co.png", options: ["Kolumbiya", "Venesuela", "Peru", "Ekvador"], continent: "Janubiy Amerika", difficulty: "medium" },
  { id: "pe", country: "Peru", flag: "https://flagcdn.com/w320/pe.png", options: ["Peru", "Boliviya", "Chili", "Kolumbiya"], continent: "Janubiy Amerika", difficulty: "medium" },
  { id: "ve", country: "Venesuela", flag: "https://flagcdn.com/w320/ve.png", options: ["Venesuela", "Kolumbiya", "Ekvador", "Braziliya"], continent: "Janubiy Amerika", difficulty: "hard" },
  { id: "ec", country: "Ekvador", flag: "https://flagcdn.com/w320/ec.png", options: ["Ekvador", "Kolumbiya", "Peru", "Venesuela"], continent: "Janubiy Amerika", difficulty: "hard" },
  { id: "bo", country: "Boliviya", flag: "https://flagcdn.com/w320/bo.png", options: ["Boliviya", "Peru", "Paragvay", "Chili"], continent: "Janubiy Amerika", difficulty: "hard" },
  { id: "uy", country: "Urugvay", flag: "https://flagcdn.com/w320/uy.png", options: ["Urugvay", "Argentina", "Paragvay", "Chili"], continent: "Janubiy Amerika", difficulty: "medium" },
  { id: "py", country: "Paragvay", flag: "https://flagcdn.com/w320/py.png", options: ["Paragvay", "Urugvay", "Boliviya", "Peru"], continent: "Janubiy Amerika", difficulty: "hard" },

  // Okeaniya
  { id: "fj", country: "Fiji", flag: "https://flagcdn.com/w320/fj.png", options: ["Fiji", "Samoa", "Tonga", "Vanuatu"], continent: "Okeaniya", difficulty: "hard" },
  { id: "pg", country: "Papua Yangi Gvineya", flag: "https://flagcdn.com/w320/pg.png", options: ["Papua Yangi Gvineya", "Fiji", "Samoa", "Tonga"], continent: "Okeaniya", difficulty: "hard" },
  { id: "ws", country: "Samoa", flag: "https://flagcdn.com/w320/ws.png", options: ["Samoa", "Tonga", "Fiji", "Vanuatu"], continent: "Okeaniya", difficulty: "hard" },
  { id: "to", country: "Tonga", flag: "https://flagcdn.com/w320/to.png", options: ["Tonga", "Samoa", "Fiji", "Papua Yangi Gvineya"], continent: "Okeaniya", difficulty: "hard" },
];