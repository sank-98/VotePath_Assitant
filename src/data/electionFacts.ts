export interface ElectionFact {
  id: number;
  text: Record<string, string>;
}

export const ELECTION_FACTS: ElectionFact[] = [
  {
    id: 1,
    text: {
      en: "In the first general election in 1951-52, voters were assigned separate colorful ballot boxes for each candidate.",
      hi: "1951-52 के पहले आम चुनाव में, मतदाताओं को प्रत्येक उम्मीदवार के लिए अलग-अलग रंगीन मतपेटियां सौंपी गई थीं।"
    }
  },
  {
    id: 2,
    text: {
      en: "The Election Commission of India ensures that no voter has to travel more than 2 km to cast their vote.",
      hi: "भारत निर्वाचन आयोग यह सुनिश्चित करता है कि किसी भी मतदाता को वोट डालने के लिए 2 किमी से अधिक की यात्रा न करनी पड़े।"
    }
  },
  {
    id: 3,
    text: {
      en: "For a single voter in Gir Forest, Gujarat, a special polling booth is set up every election.",
      hi: "गुजरात के गिर जंगल में एक अकेले मतदाता के लिए हर चुनाव में एक विशेष मतदान केंद्र बनाया जाता है।"
    }
  },
  {
    id: 4,
    text: {
      en: "India has the world's largest electorate, with over 900 million registered voters currently.",
      hi: "भारत में दुनिया का सबसे बड़ा मतदाता वर्ग है, जिसमें वर्तमान में 90 करोड़ से अधिक पंजीकृत मतदाता हैं।"
    }
  },
  {
    id: 5,
    text: {
      en: "Indelible ink used to prevent multiple voting is manufactured exclusively by Mysore Paints and Varnish Limited.",
      hi: "कई बार मतदान रोकने के लिए इस्तेमाल की जाने वाली अमिट स्याही विशेष रूप से मैसूर पेंट्स एंड वार्निश लिमिटेड द्वारा निर्मित की जाती है।"
    }
  },
  {
    id: 6,
    text: {
      en: "The 2019 General Election was the largest human undertaking in history, involving over 11 million polling officials.",
      hi: "2019 का आम चुनाव इतिहास का सबसे बड़ा मानवीय कार्य था, जिसमें 1.1 करोड़ से अधिक मतदान अधिकारी शामिल थे।"
    }
  }
];
