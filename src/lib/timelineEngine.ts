import { UserFlow } from "./decisionEngine";
import { Language } from "./translations";

export function generateTimeline(flow: UserFlow, language: Language = 'en'): string[] {
  const urgency = {
    en: {
      "NEW_VOTER": "⚠️ URGENT: Submit Form 6 on NVSP. Deadlines usually close weeks before the announcement of polls.",
      "REGISTERED_VOTER": "📅 Action needed: Verify your name in the Electoral Roll annually during the Special Summary Revision.",
      "ISSUE_RESOLUTION": "⚡ Immediate action: Use Form 8 for corrections of entries or change of residence.",
      "NOT_ELIGIBLE": "🌱 Future prep: You can apply for registration in advance if you turn 18 by any of the four qualifying dates.",
      "GENERAL": "🛡️ Stay informed: Check the ECI schedule for national or state elections.",
      "SIMPLIFIED": "💡 Simple path: We'll show you how to get your Voter ID (EPIC) card easily."
    },
    hi: {
      "NEW_VOTER": "⚠️ तत्काल: NVSP पर फॉर्म 6 भरें। चुनाव की घोषणा से कुछ सप्ताह पहले आवेदन बंद हो जाते हैं।",
      "REGISTERED_VOTER": "📅 आवश्यक: 'विशेष संक्षिप्त पुनरीक्षण' के दौरान मतदाता सूची में अपना नाम सत्यापित करें।",
      "ISSUE_RESOLUTION": "⚡ तत्काल कार्रवाई: विवरण में सुधार या निवास परिवर्तन के लिए फॉर्म 8 का उपयोग करें।",
      "NOT_ELIGIBLE": "🌱 भविष्य की तैयारी: यदि आप 18 वर्ष के होने वाले हैं, तो आप पहले से पंजीकरण के लिए आवेदन कर सकते हैं।",
      "GENERAL": "🛡️ सूचित रहें: राष्ट्रीय या राज्य चुनावों के लिए ECI कार्यक्रम की जाँच करें। स्थानीय निकायों की तिथियां राज्य चुनाव आयोग द्वारा तय की जाती हैं।",
      "SIMPLIFIED": "💡 आसान तरीका: हम आपको दिखाएंगे कि अपना वोटर आईडी (EPIC) कार्ड आसानी से कैसे प्राप्त करें।"
    }
  };

  const baseTimelines = {
    en: {
      "NEW_VOTER": [
        "Submit Form 6 (Online via NVSP/Voter Helpline)",
        "Field Verification by Booth Level Officer (BLO)",
        "Approval by ERO (Electoral Registration Officer)",
        "Generation of EPIC (Voter ID) and Name in Roll"
      ],
      "REGISTERED_VOTER": [
        "Check name in Electoral Roll (voterportal.eci.gov.in)",
        "Download Digital Voter ID (e-EPIC)",
        "Locate Polling Booth using Voter Helpline",
        "Cast Vote on Polling Day"
      ]
    },
    hi: {
      "NEW_VOTER": [
        "फॉर्म 6 जमा करें (ऑनलाइन NVSP/वोटर हेल्पलाइन के माध्यम से)",
        "बूथ स्तर के अधिकारी (BLO) द्वारा क्षेत्र सत्यापन",
        "निर्वाचक पंजीकरण अधिकारी (ERO) द्वारा अनुमोदन",
        "EPIC (वोटर आईडी) का निर्माण और मतदाता सूची में नाम आना"
      ],
      "REGISTERED_VOTER": [
        "मतदाता सूची में नाम जाँचें (voterportal.eci.gov.in)",
        "डिजिटल वोटर आईडी (e-EPIC) डाउनलोड करें",
        "वोटर हेल्पलाइन का उपयोग करके मतदान केंद्र का पता लगाएं",
        "मतदान के दिन अपना वोट डालें"
      ]
    }
  };

  // Safe access with fallbacks
  const tUrgency = (urgency[language] || urgency.en)[flow] || (urgency[language] || urgency.en)["GENERAL"];
  const tBase = (baseTimelines[language] || baseTimelines.en)[flow as keyof typeof baseTimelines.en] || 
                (baseTimelines[language] || baseTimelines.en)["REGISTERED_VOTER"];

  return [tUrgency, ...tBase];
}
