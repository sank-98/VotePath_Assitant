export type ElectionType = 'Lok Sabha' | 'Vidhan Sabha' | 'Local Bodies';

export interface StateElectionData {
  id: string;
  name: string;
  hindiName: string;
  nextElection: Record<string, string>;
  lastElection: string;
  status: Record<string, string>;
  timeline: Record<string, string[]>;
  pastResults: Record<string, string>;
  types: ElectionType[];
  nextElectionYear: number;
}

export const INDIA_ELECTION_DATA: Record<string, StateElectionData> = {
  "AP": {
    id: "AP",
    name: "Andhra Pradesh",
    hindiName: "आंध्र प्रदेश",
    nextElection: { en: "May 2029", hi: "मई 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Revision 2028"], hi: ["संशोधन 2028"] },
    pastResults: { en: "TDP+ Alliance", hi: "टीडीपी+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "AR": {
    id: "AR",
    name: "Arunachal Pradesh",
    hindiName: "अरुणाचल प्रदेश",
    nextElection: { en: "Apr 2029", hi: "अप्रैल 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Revision 2028"], hi: ["संशोधन 2028"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "AS": {
    id: "AS",
    name: "Assam",
    hindiName: "असम",
    nextElection: { en: "Apr-May 2026", hi: "अप्रैल-मई 2026" },
    nextElectionYear: 2026,
    lastElection: "2021",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Notification: Jan 2026"], hi: ["अधिसूचना: जनवरी 2026"] },
    pastResults: { en: "BJP+ Alliance", hi: "भाजपा+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "BR": {
    id: "BR",
    name: "Bihar",
    hindiName: "बिहार",
    nextElection: { en: "Oct-Nov 2030", hi: "अक्टूबर-नवंबर 2030" },
    nextElectionYear: 2030,
    lastElection: "2025",
    status: { en: "New Government", hi: "नई सरकार" },
    timeline: { en: ["Next: 2030"], hi: ["अगला: 2030"] },
    pastResults: { en: "NDA Majority", hi: "एनडीए (NDA) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "CG": {
    id: "CG",
    name: "Chhattisgarh",
    hindiName: "छत्तीसगढ़",
    nextElection: { en: "Nov 2028", hi: "नवंबर 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "GA": {
    id: "GA",
    name: "Goa",
    hindiName: "गोवा",
    nextElection: { en: "Feb 2027", hi: "फरवरी 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Revision 2026"], hi: ["संशोधन 2026"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "GJ": {
    id: "GJ",
    name: "Gujarat",
    hindiName: "गुजरात",
    nextElection: { en: "Dec 2027", hi: "दिसंबर 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2026"], hi: ["संशोधन 2026"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "HR": {
    id: "HR",
    name: "Haryana",
    hindiName: "हरियाणा",
    nextElection: { en: "Oct 2029", hi: "अक्टूबर 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Newly Formed", hi: "नवनिर्मित" },
    timeline: { en: ["Next: 2029"], hi: ["अगला: 2029"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "HP": {
    id: "HP",
    name: "Himachal Pradesh",
    hindiName: "हिमाचल प्रदेश",
    nextElection: { en: "Nov 2027", hi: "नवंबर 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2026"], hi: ["संशोधन 2026"] },
    pastResults: { en: "INC Majority", hi: "कांग्रेस बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "JH": {
    id: "JH",
    name: "Jharkhand",
    hindiName: "झारखंड",
    nextElection: { en: "Nov 2029", hi: "नवंबर 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Revision 2028"], hi: ["संशोधन 2028"] },
    pastResults: { en: "JMM+ Alliance", hi: "झामुमो+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "KA": {
    id: "KA",
    name: "Karnataka",
    hindiName: "कर्नाटक",
    nextElection: { en: "May 2028", hi: "मई 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "INC Majority", hi: "कांग्रेस बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "KL": {
    id: "KL",
    name: "Kerala",
    hindiName: "केरल",
    nextElection: { en: "Apr-May 2026", hi: "अप्रैल-मई 2026" },
    nextElectionYear: 2026,
    lastElection: "2021",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Notification: Mar 2026"], hi: ["अधिसूचना: मार्च 2026"] },
    pastResults: { en: "LDF Majority", hi: "एलडीएफ (LDF) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "MP": {
    id: "MP",
    name: "Madhya Pradesh",
    hindiName: "मध्य प्रदेश",
    nextElection: { en: "Nov 2028", hi: "नवंबर 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "MAH": {
    id: "MAH",
    name: "Maharashtra",
    hindiName: "महाराष्ट्र",
    nextElection: { en: "Oct 2029", hi: "अक्टूबर 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Newly Formed", hi: "नवनिर्मित" },
    timeline: { en: ["Next: 2029"], hi: ["अगला: 2029"] },
    pastResults: { en: "Mahayuti Alliance", hi: "महायुति गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "MN": {
    id: "MN",
    name: "Manipur",
    hindiName: "मणिपुर",
    nextElection: { en: "Mar 2027", hi: "मार्च 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Civil Revision 2026"], hi: ["नागरिक संशोधन 2026"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "ML": {
    id: "ML",
    name: "Meghalaya",
    hindiName: "मेघालय",
    nextElection: { en: "Feb 2028", hi: "फरवरी 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "NPP+ Alliance", hi: "एनपीपी+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "MZ": {
    id: "MZ",
    name: "Mizoram",
    hindiName: "मिज़ोरम",
    nextElection: { en: "Nov 2028", hi: "नवंबर 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "ZPM Majority", hi: "ज़ेडपीएम (ZPM) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "NL": {
    id: "NL",
    name: "Nagaland",
    hindiName: "नागालैंड",
    nextElection: { en: "Feb 2028", hi: "फरवरी 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "NDPP+ Alliance", hi: "एनडीपीपी+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "OR": {
    id: "OR",
    name: "Odisha",
    hindiName: "ओडिशा",
    nextElection: { en: "May 2029", hi: "मई 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Revision 2028"], hi: ["संशोधन 2028"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "PB": {
    id: "PB",
    name: "Punjab",
    hindiName: "पंजाब",
    nextElection: { en: "Mar 2027", hi: "मार्च 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2026"], hi: ["संशोधन 2026"] },
    pastResults: { en: "AAP Majority", hi: "आप (AAP) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "RJ": {
    id: "RJ",
    name: "Rajasthan",
    hindiName: "राजस्थान",
    nextElection: { en: "Nov 2028", hi: "नवंबर 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "SK": {
    id: "SK",
    name: "Sikkim",
    hindiName: "सिक्किम",
    nextElection: { en: "Apr 2029", hi: "अप्रैल 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Revision 2028"], hi: ["संशोधन 2028"] },
    pastResults: { en: "SKM Majority", hi: "एसकेएम (SKM) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "TN": {
    id: "TN",
    name: "Tamil Nadu",
    hindiName: "तमिलनाडु",
    nextElection: { en: "Apr-May 2026", hi: "अप्रैल-मई 2026" },
    nextElectionYear: 2026,
    lastElection: "2021",
    status: { en: "LIVE: Polling Phase", hi: "लाइव: मतदान चरण" },
    timeline: { en: ["Counting: May 19, 2026"], hi: ["गणना: 19 मई 2026"] },
    pastResults: { en: "DMK+ Alliance", hi: "द्रमुक+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "TG": {
    id: "TG",
    name: "Telangana",
    hindiName: "तेलंगाना",
    nextElection: { en: "Nov 2028", hi: "नवंबर 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "INC Majority", hi: "कांग्रेस बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "TR": {
    id: "TR",
    name: "Tripura",
    hindiName: "त्रिपुरा",
    nextElection: { en: "Feb 2028", hi: "फरवरी 2028" },
    nextElectionYear: 2028,
    lastElection: "2023",
    status: { en: "Mid-Term", hi: "मध्य-अवधि" },
    timeline: { en: ["Revision 2027"], hi: ["संशोधन 2027"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "UP": {
    id: "UP",
    name: "Uttar Pradesh",
    hindiName: "उत्तर प्रदेश",
    nextElection: { en: "Feb-Mar 2027", hi: "फरवरी-मार्च 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Notification: Jan 2027"], hi: ["अधिसूचना: जनवरी 2027"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "UK": {
    id: "UK",
    name: "Uttarakhand",
    hindiName: "उत्तराखंड",
    nextElection: { en: "Feb 2027", hi: "फरवरी 2027" },
    nextElectionYear: 2027,
    lastElection: "2022",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Revision 2026"], hi: ["संशोधन 2026"] },
    pastResults: { en: "BJP Majority", hi: "भाजपा बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "WB": {
    id: "WB",
    name: "West Bengal",
    hindiName: "पश्चिम बंगाल",
    nextElection: { en: "Apr-May 2026", hi: "अप्रैल-मई 2026" },
    nextElectionYear: 2026,
    lastElection: "2021",
    status: { en: "LIVE: Polling", hi: "लाइव: मतदान" },
    timeline: { en: ["Counting: May 19, 2026"], hi: ["गणना: 19 मई 2026"] },
    pastResults: { en: "AITC Majority", hi: "तृणमूल कांग्रेस बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "DN": {
    id: "DN",
    name: "Delhi (NCT)",
    hindiName: "दिल्ली (NCT)",
    nextElection: { en: "Feb 2025 (Completed)", hi: "फरवरी 2025 (पूर्ण)" },
    nextElectionYear: 2030,
    lastElection: "2025",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Next: 2030"], hi: ["अगला: 2030"] },
    pastResults: { en: "AAP Majority", hi: "आप (AAP) बहुमत" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "JK": {
    id: "JK",
    name: "Jammu & Kashmir",
    hindiName: "जम्मू और कश्मीर",
    nextElection: { en: "Oct 2029", hi: "अक्टूबर 2029" },
    nextElectionYear: 2029,
    lastElection: "2024",
    status: { en: "Stable", hi: "स्थिर" },
    timeline: { en: ["Next: 2029"], hi: ["अगला: 2029"] },
    pastResults: { en: "NC+ Alliance", hi: "नेकां+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  },
  "PY": {
    id: "PY",
    name: "Puducherry",
    hindiName: "पुदुचेरी",
    nextElection: { en: "Apr-May 2026", hi: "अप्रैल-मई 2026" },
    nextElectionYear: 2026,
    lastElection: "2021",
    status: { en: "Pre-Election Phase", hi: "चुनाव-पूर्व चरण" },
    timeline: { en: ["Notification: Mar 2026"], hi: ["अधिसूचना: मार्च 2026"] },
    pastResults: { en: "AINRC+ Alliance", hi: "एआईएनआरसी+ गठबंधन" },
    types: ["Vidhan Sabha", "Lok Sabha"]
  }
};
