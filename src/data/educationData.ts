export interface EducationContent {
  id: string;
  topic: Record<string, string>;
  simple: Record<string, string>;
  complex: Record<string, string>;
  icon: string;
}

export const EDUCATION_DATA: EducationContent[] = [
  {
    id: 'why-vote',
    topic: {
      en: 'Why does my vote matter?',
      hi: 'मेरा वोट क्यों मायने रखता है?'
    },
    simple: {
      en: 'Imagine your school is choosing a game to play. If you don\'t speak up, others might choose a game you don\'t like! Your vote is your voice to pick the "game" (rules) for the country.',
      hi: 'कल्पना कीजिए कि आपका स्कूल खेलने के लिए एक खेल चुन रहा है। यदि आप नहीं बोलते हैं, तो दूसरे ऐसा खेल चुन सकते हैं जो आपको पसंद न हो! आपका वोट देश के लिए "खेल" (नियम) चुनने की आपकी आवाज़ है।'
    },
    complex: {
      en: 'In a First-Past-The-Post (FPTP) system like India\'s, even a single vote can decide the winner in a constituency. This affects legislative composition, government formation, and policy outcomes. Historical margins in India have often been as low as 1-100 votes.',
      hi: 'भारत जैसी फर्स्ट-पास्ट-द-पोस्ट (FPTP) प्रणाली में, एक भी वोट निर्वाचन क्षेत्र में विजेता का फैसला कर सकता है। यह विधायी संरचना, सरकार गठन और नीतिगत परिणामों को प्रभावित करता है। भारत में ऐतिहासिक अंतर अक्सर 1-100 वोटों तक कम रहे हैं।'
    },
    icon: 'Target'
  },
  {
    id: 'how-it-works',
    topic: {
      en: 'How do elections work?',
      hi: 'चुनाव कैसे काम करते हैं?'
    },
    simple: {
      en: 'It is like a big contest! People who want to lead the country (candidates) tell us their plans. We go to a special room (polling booth), press a button on a machine (EVM), and the person with the most buttons wins!',
      hi: 'यह एक बड़ी प्रतियोगिता की तरह है! जो लोग देश का नेतृत्व करना चाहते हैं (उम्मीदवार) हमें अपनी योजनाएं बताते हैं। हम एक विशेष कमरे (मतदान केंद्र) में जाते हैं, एक मशीन (ईवीएम) पर एक बटन दबाते हैं, और सबसे अधिक बटन वाला व्यक्ति जीत जाता है!'
    },
    complex: {
      en: 'The Election Commission of India (ECI) manages the process using Article 324. It involves delimitation of constituencies, electoral roll preparation, Model Code of Conduct enforcement, and multi-phase polling using tamper-proof EVMs and VVPATs for auditability.',
      hi: 'भारत निर्वाचन आयोग (ECI) अनुच्छेद 324 का उपयोग करके प्रक्रिया का प्रबंधन करता है। इसमें निर्वाचन क्षेत्रों का परिसीमन, मतदाता सूची तैयार करना, आदर्श आचार संहिता लागू करना और लेखापरीक्षा के लिए छेड़छाड़-मुक्त ईवीएम और वीवीपैट का उपयोग करके बहु-चरणीय मतदान शामिल है।'
    },
    icon: 'Settings'
  },
  {
    id: 'participation',
    topic: {
      en: 'How can I participate?',
      hi: 'मैं कैसे भाग ले सकता हूँ?'
    },
    simple: {
      en: 'If you are 18, get your Voter ID card! Talk to your family about who has the best plans for your future. On election day, go and press the button!',
      hi: 'यदि आप 18 वर्ष के हैं, तो अपना वोटर आईडी कार्ड बनवाएं! अपने परिवार से बात करें कि आपके भविष्य के लिए किसके पास सबसे अच्छी योजनाएं हैं। चुनाव के दिन जाएं और बटन दबाएं!'
    },
    complex: {
      en: 'Participation ranges from active voting to candidate scrutiny via Form 26 affidavits (criminal/financial records), working as polling agents, or even contesting if eligible. Reporting violations via cVIGIL is also a key participatory act.',
      hi: 'भागीदारी सक्रिय मतदान से लेकर फॉर्म 26 शपथ पत्रों (आपराधिक/वित्तीय रिकॉर्ड) के माध्यम से उम्मीदवार की जांच, मतदान एजेंट के रूप में काम करना, या पात्र होने पर चुनाव लड़ना तक होती है। cVIGIL के माध्यम से उल्लंघन की रिपोर्ट करना भी एक प्रमुख भागीदारी कार्य है।'
    },
    icon: 'Users'
  },
  {
    id: 'constituency',
    topic: { en: 'Constituency', hi: 'निर्वाचन क्षेत्र' },
    simple: {
      en: 'A specific area where voters live and choose their own representative for the government.',
      hi: 'एक विशिष्ट क्षेत्र जहाँ मतदाता रहते हैं और सरकार के लिए अपना प्रतिनिधि चुनते हैं।'
    },
    complex: {
      en: 'A territorial area which is mapped out for the purpose of an election. In India, segments are divided into Parliamentary and Assembly constituencies based on population (Delimitation).',
      hi: 'एक क्षेत्रीय क्षेत्र जिसे चुनाव के उद्देश्य से मैप किया गया है। भारत में, जनसंख्या (परिसीमन) के आधार पर क्षेत्रों को संसदीय और विधानसभा निर्वाचन क्षेत्रों में विभाजित किया गया है।'
    },
    icon: 'MapPin'
  },
  {
    id: 'electoral-roll',
    topic: { en: 'Electoral Roll', hi: 'मतदाता सूची' },
    simple: {
      en: 'The official list of everyone who is allowed to vote in an election.',
      hi: 'उन सभी लोगों की आधिकारिक सूची जिन्हें चुनाव में वोट डालने की अनुमति है।'
    },
    complex: {
      en: 'A list maintained by the ECI of all eligible citizens (18+) registered to vote in a specific constituency. Presence in this roll is mandatory to cast a vote (EPIC is just an ID).',
      hi: 'विशिष्ट निर्वाचन क्षेत्र में वोट डालने के लिए पंजीकृत सभी पात्र नागरिकों (18+) की ECI द्वारा बनाए रखी गई सूची। वोट डालने के लिए इस सूची में उपस्थिति अनिवार्य है।'
    },
    icon: 'ListChecks'
  },
  {
    id: 'polling-booth',
    topic: { en: 'Polling Booth', hi: 'मतदान केंद्र' },
    simple: {
      en: 'The specific place where you go to cast your vote on election day.',
      hi: 'वह विशिष्ट स्थान जहाँ आप चुनाव के दिन अपना वोट डालने जाते हैं।'
    },
    complex: {
      en: 'A designated location where voters of a specific segment exercise their franchise. It is managed by a Presiding Officer and Polling Officers under strict ECI protocols.',
      hi: 'एक निर्दिष्ट स्थान जहाँ एक विशिष्ट खंड के मतदाता अपने मताधिकार का प्रयोग करते हैं। यह सख्त ECI प्रोटोकॉल के तहत पीठासीन अधिकारी और मतदान अधिकारियों द्वारा प्रबंधित किया जाता है।'
    },
    icon: 'DoorOpen'
  },
  {
    id: 'blo',
    topic: { en: 'Booth Level Officer (BLO)', hi: 'बूथ स्तर के अधिकारी (BLO)' },
    simple: {
      en: 'A helpful local official who helps you register to vote and find your name in the list.',
      hi: 'एक सहायक स्थानीय अधिकारी जो आपको वोट डालने के लिए पंजीकरण करने और सूची में अपना नाम खोजने में मदद करता है।'
    },
    complex: {
      en: 'A ground-level election official, usually a local government employee, responsible for maintaining the accuracy of the electoral roll for a specific polling station area.',
      hi: 'एक जमीनी स्तर के चुनाव अधिकारी, आमतौर पर एक स्थानीय सरकारी कर्मचारी, जो एक विशिष्ट मतदान केंद्र क्षेत्र के लिए मतदाता सूची की सटीकता बनाए रखने के लिए जिम्मेदार होते हैं।'
    },
    icon: 'UserCog'
  },
  {
    id: 'mcc',
    topic: { en: 'Model Code of Conduct', hi: 'आदर्श आचार संहिता' },
    simple: {
      en: 'The ground rules for political parties and candidates to ensure fair behavior during elections.',
      hi: 'चुनाव के दौरान निष्पक्ष व्यवहार सुनिश्चित करने के लिए राजनीतिक दलों और उम्मीदवारों के लिए बुनियादी नियम।'
    },
    complex: {
      en: 'A set of guidelines issued by the ECI for the conduct of political parties and candidates during elections, covering speeches, polling day, polling booths, and election manifestos.',
      hi: 'चुनाव के दौरान राजनीतिक दलों और उम्मीदवारों के आचरण के लिए ECI द्वारा जारी दिशा-निर्देशों का एक सेट, जिसमें भाषण, मतदान का दिन, मतदान केंद्र और चुनाव घोषणापत्र शामिल हैं।'
    },
    icon: 'Gavel'
  },
  {
    id: 'nota',
    topic: { en: 'NOTA', hi: 'नोटा' },
    simple: {
      en: 'A button you can press if you don\'t want to vote for any of the listed candidates.',
      hi: 'एक बटन जिसे आप दबा सकते हैं यदि आप सूचीबद्ध उम्मीदवारों में से किसी को भी वोट नहीं देना चाहते हैं।'
    },
    complex: {
      en: '"None of the Above" - An option introduced in 2013 allowing voters to register a neutral vote. It measures public dissatisfaction with candidate selection without invalidating the ballot.',
      hi: '"उपरोक्त में से कोई नहीं" - 2013 में पेश किया गया एक विकल्प जो मतदाताओं को तटस्थ वोट दर्ज करने की अनुमति देता है। यह मतपत्र को अमान्य किए बिना उम्मीदवार चयन के साथ सार्वजनिक असंतोष को मापता है।'
    },
    icon: 'Ban'
  },
  {
    id: 'fptp',
    topic: { en: 'FPTP', hi: 'फर्स्ट पास्ट द पोस्ट' },
    simple: {
      en: 'The simplest way to win: the person who gets the most votes in their area wins!',
      hi: 'जीतने का सबसे सरल तरीका: जिसे अपने क्षेत्र में सबसे अधिक वोट मिलते हैं, वह जीत जाता है!'
    },
    complex: {
      en: '"First-Past-The-Post" - An electoral system where the candidate with the highest number of votes in a single-member constituency wins, regardless of whether they have a majority (>50%).',
      hi: '"फर्स्ट-पास्ट-द-पोस्ट" - एक चुनावी प्रणाली जहाँ एक सदस्यीय क्षेत्र में सबसे अधिक वोट पाने वाला उम्मीदवार जीतता है, भले ही उनके पास बहुमत (> 50%) हो या न हो।'
    },
    icon: 'Trophy'
  },
  {
    id: 'evm',
    topic: { en: 'EVM', hi: 'ईवीएम' },
    simple: {
      en: 'Electronic machines used to record votes simply by pressing a button next to a candidate\'s symbol.',
      hi: 'उम्मीदवार के चुनाव चिह्न के बगल में बटन दबाकर वोट रिकॉर्ड करने के लिए उपयोग की जाने वाली इलेक्ट्रॉनिक मशीनें।'
    },
    complex: {
      en: 'Electronic Voting Machines - Standalone, non-networked micro-controller based devices consisting of a Control Unit and a Balloting Unit, used since 1999 to modernize the polling process.',
      hi: 'इलेक्ट्रॉनिक वोटिंग मशीनें - स्टैंडअलोन, नॉन-नेटवर्क्ड माइक्रो-कंट्रोलर आधारित डिवाइस जिसमें एक कंट्रोल यूनिट और एक बैलेटिंग यूनिट होती है, जिसे 1999 से मतदान प्रक्रिया के आधुनिकीकरण के लिए उपयोग किया जाता है।'
    },
    icon: 'Cpu'
  },
  {
    id: 'vvpat',
    topic: { en: 'VVPAT', hi: 'वीवीपैट' },
    simple: {
      en: 'A printer that shows you a slip for 7 seconds to confirm your vote went to the right person.',
      hi: 'एक प्रिंटर जो आपको यह पुष्टि करने के लिए 7 सेकंड के लिए एक पर्ची दिखाता है कि आपका वोट सही व्यक्ति को गया है।'
    },
    complex: {
      en: 'Voter Verifiable Paper Audit Trail - An independent system attached to the EVM that allows voters to verify that their votes are cast as intended, creating a physical paper trail for audits.',
      hi: 'वोटर वेरिफ़िएबल पेपर ऑडिट ट्रेल - ईवीएम से जुड़ा एक स्वतंत्र सिस्टम जो मतदाताओं को यह सत्यापित करने की अनुमति देता है कि उनके वोट इरादे के अनुसार डाले गए हैं, ऑडिट के लिए एक भौतिक पेपर ट्रेल बनाता है।'
    },
    icon: 'FileText'
  }
];
