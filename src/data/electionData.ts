export interface Step {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  icon: string;
  status: 'pending' | 'current' | 'completed';
  dateRange: Record<string, string>;
  checklist: Record<string, string[]>;
}

export const ELECTION_STEPS: Step[] = [
  {
    id: 'registration',
    title: {
      en: 'Voter Registration',
      hi: 'मतदाता पंजीकरण'
    },
    description: {
      en: 'The first and most important step to participate in democracy.',
      hi: 'लोकतंत्र में भाग लेने का पहला और सबसे महत्वपूर्ण चरण।'
    },
    longDescription: {
      en: 'To vote in an election, you must first register in the Electoral Roll. You can register online via the NVSP portal or through the BLO at your polling station.',
      hi: 'चुनाव में मतदान करने के लिए, आपको सबसे पहले मतदाता सूची (Electoral Roll) में पंजीकरण करना होगा। आप फॉर्म 6 भरकर ऑनलाइन या अपने मतदान केंद्र के बीएलओ के माध्यम से पंजीकरण कर सकते हैं।'
    },
    icon: 'UserCheck',
    status: 'completed',
    dateRange: {
      en: 'Continuous (Check your area deadlines)',
      hi: 'निरंतर (अपने क्षेत्र की समय सीमा जांचें)'
    },
    checklist: {
      en: [
        'Check eligibility (18+ years, Indian Citizen)',
        'Log into NVSP or Voter Helpline App',
        'Fill Form 6 and verify details',
        'Receive your Voter ID (EPIC)'
      ],
      hi: [
        'पात्रता जांचें (18+ वर्ष, भारतीय नागरिक)',
        'NVSP या वोटर हेल्पलाइन ऐप पर लॉग इन करें',
        'फॉर्म 6 भरकर विवरण सत्यापित करें',
        'अपना मतदाता पहचान पत्र (EPIC) प्राप्त करें'
      ]
    }
  },
  {
    id: 'notification',
    title: {
      en: 'Election Notification',
      hi: 'निर्वाचन अधिसूचना'
    },
    description: {
      en: 'Official announcement by the Election Commission of India.',
      hi: 'भारत निर्वाचन आयोग द्वारा आधिकारिक घोषणा।'
    },
    longDescription: {
      en: 'The ECI announces the election dates and the Model Code of Conduct (MCC) comes into effect immediately to ensure fair elections.',
      hi: 'भारत निर्वाचन आयोग (ECI) तारीखों की घोषणा करता है और आदर्श आचार संहिता लागू हो जाती है।'
    },
    icon: 'Radio',
    status: 'current',
    dateRange: {
      en: 'Cycle Begins',
      hi: 'चक्र शुरू'
    },
    checklist: {
      en: [
        'Understand the Notification and MCC',
        'Check your constituency polling date',
        'Note appointment of Observers'
      ],
      hi: [
        'अधिसूचना और आदर्श आचार संहिता को समझें',
        'अपने निर्वाचन क्षेत्र की मतदान तिथि जांचें',
        'पर्यवेक्षकों की नियुक्ति पर ध्यान दें'
      ]
    }
  },
  {
    id: 'campaign',
    title: {
      en: 'Campaigning Phase',
      hi: 'चुनाव प्रचार चरण'
    },
    description: {
      en: 'Candidates present their agendas to the voters.',
      hi: 'उम्मीदवार मतदाताओं के सामने अपना एजेंडा रखते हैं।'
    },
    longDescription: {
      en: 'Candidates and parties campaign via rallies, manifestos, and media. Campaigning must stop 48 hours before the end of polling (Silence Period).',
      hi: 'उम्मीदवार और दल रैलियों और घोषणापत्रों के माध्यम से प्रचार करते हैं। मतदान समाप्त होने के 48 घंटे पहले प्रचार बंद होना अनिवार्य है (शांति काल)।'
    },
    icon: 'Megaphone',
    status: 'pending',
    dateRange: {
      en: 'Ends 48h before Voting',
      hi: 'मतदान से 48 घंटे पहले समाप्त'
    },
    checklist: {
      en: [
        'Read Party Manifestos',
        'Analyze Candidate background (MyNeta)',
        'Report MCC violations via cVIGIL app'
      ],
      hi: [
        'पार्टी के घोषणापत्र पढ़ें',
        'उम्मीदवार की पृष्ठभूमि का विश्लेषण करें (MyNeta)',
        'cVIGIL ऐप के माध्यम से उल्लंघन की रिपोर्ट करें'
      ]
    }
  },
  {
    id: 'polling',
    title: {
      en: 'Polling Day (EVM/VVPAT)',
      hi: 'मतदान दिवस (ईवीएम/वीवीपैट)'
    },
    description: {
      en: 'The day to cast your valuable vote at the polling booth.',
      hi: 'मतदान केंद्र पर अपना बहुमूल्य वोट डालने का दिन।'
    },
    longDescription: {
      en: 'Voting is conducted using Electronic Voting Machines (EVM) and VVPAT. You will see a 7-second slip in the VVPAT window verifying your vote. EVMs are stand-alone and non-networked.',
      hi: 'मतदान ईवीएम और वीवीपैट का उपयोग करके किया जाता है। आप वीवीपैट विंडो में 7 सेकंड के लिए एक पर्ची देखेंगे जो आपके वोट को सत्यापित करती है। ईवीएम स्टैंड-अलोन और गैर-नेटवर्किंग मशीनें हैं।'
    },
    icon: 'Vote',
    status: 'pending',
    dateRange: {
      en: 'Scheduled Date',
      hi: 'निर्धारित तिथि'
    },
    checklist: {
      en: [
        'Locate your Polling Booth',
        'Carry Voter ID or valid Alternate ID',
        'Verify your vote on the VVPAT slip',
        'Get inked as a proud voter'
      ],
      hi: [
        'अपना मतदान केंद्र खोजें',
        'वोटर आईडी या मान्य वैकल्पिक आईडी साथ रखें',
        'वीवीपैट पर्ची पर अपने वोट को सत्यापित करें',
        'गर्व से स्याही लगवाएं'
      ]
    }
  },
  {
    id: 'counting',
    title: {
      en: 'Counting & Results',
      hi: 'गणना और परिणाम'
    },
    description: {
      en: 'The culmination of the democratic process.',
      hi: 'लोकतांत्रिक प्रक्रिया का समापन।'
    },
    longDescription: {
      en: 'Votes are counted under strict supervision. VVPAT slips from 5 randomly selected polling stations per assembly constituency are also matched with EVM counts.',
      hi: 'सख्त निगरानी में वोटों की गिनती की जाती है। प्रत्येक निर्वाचन क्षेत्र के 5 यादृच्छिक मतदान केंद्रों की वीवीपैट पर्चियों का भी ईवीएम गणना से मिलान किया जाता है।'
    },
    icon: 'BarChart3',
    status: 'pending',
    dateRange: {
      en: 'Declaration Day',
      hi: 'घोषणा दिवस'
    },
    checklist: {
      en: [
        'Follow official results on ECI portal',
        'Understand Majority and Coalition rules',
        'Accept the democratic mandate'
      ],
      hi: [
        'ECI पोर्टल पर आधिकारिक परिणाम देखें',
        'बहुमत और गठबंधन के नियमों को समझें',
        'लोकतांत्रिक जनादेश को स्वीकार करें'
      ]
    }
  }
];
