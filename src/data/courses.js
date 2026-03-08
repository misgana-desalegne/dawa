import { expressionsByLevel, levelSectionTitles } from "./vocabulary/commonExpressions";
import { germanById } from "./vocabulary/germanTranslations";

const levelOrder = ["A1", "A2", "B1", "B2"];

const nativeNames = {
  am: "Amharic",
  ti: "Tigrigna",
  "fa-af": "Dari"
};

const targetNames = {
  en: "English",
  fr: "French",
  de: "German"
};

function pickTargetText(entry, targetCode) {
  if (targetCode === "fr") {
    return entry.fr;
  }

  if (targetCode === "de") {
    return germanById[entry.id] || entry.en;
  }

  return entry.en;
}

function pickNativeText(entry, nativeCode) {
  if (nativeCode === "ti") {
    return entry.ti;
  }

  if (nativeCode === "fa-af") {
    return entry.fa;
  }

  return entry.am;
}

function buildExampleSentence(word, targetCode) {
  if (targetCode === "fr") {
    return `J'utilise le mot "${word}" dans une phrase complete.`;
  }

  if (targetCode === "de") {
    return `Ich benutze das Wort "${word}" in einem vollstaendigen Satz.`;
  }

  return `I use the word "${word}" in a complete sentence.`;
}

function buildChoices(entries, index, targetCode) {
  const answer = pickTargetText(entries[index], targetCode);
  const firstDistractor = pickTargetText(entries[(index + 3) % entries.length], targetCode);
  const secondDistractor = pickTargetText(entries[(index + 7) % entries.length], targetCode);

  return [answer, firstDistractor, secondDistractor];
}

function buildLessonsForLevel(nativeCode, targetCode, level) {
  const entries = expressionsByLevel[level] || [];
  const sectionTitles = levelSectionTitles[level] || [];
  const chunkSize = 5;

  const seenEntryIds = new Set();
  const uniqueEntries = entries.filter((entry) => {
    const key = entry.id || `${entry.en}-${entry.am}-${entry.ti}-${entry.fa}`;
    if (seenEntryIds.has(key)) {
      return false;
    }
    seenEntryIds.add(key);
    return true;
  });

  return uniqueEntries.reduce((acc, entry, index) => {
    const sectionIndex = Math.floor(index / chunkSize);
    const question = {
      prompt: pickNativeText(entry, nativeCode),
      answer: pickTargetText(entry, targetCode),
      choices: buildChoices(uniqueEntries, index, targetCode),
      exampleSentence: buildExampleSentence(pickTargetText(entry, targetCode), targetCode)
    };

    if (!acc[sectionIndex]) {
      const fallbackTitle = `Section ${sectionIndex + 1}`;
      acc[sectionIndex] = {
        id: `${targetCode}-${nativeCode}-${level.toLowerCase()}-${sectionIndex + 1}`,
        title: sectionTitles[sectionIndex] || fallbackTitle,
        questions: []
      };
    }

    acc[sectionIndex].questions.push(question);
    return acc;
  }, []);
}

export const courseCatalog = levelOrder.flatMap((level) => [
  {
    id: `am-en-${level.toLowerCase()}`,
    nativeCode: "am",
    targetCode: "en",
    level,
    title: `${targetNames.en} for ${nativeNames.am} Speakers`,
    lessons: buildLessonsForLevel("am", "en", level)
  },
  {
    id: `am-fr-${level.toLowerCase()}`,
    nativeCode: "am",
    targetCode: "fr",
    level,
    title: `${targetNames.fr} for ${nativeNames.am} Speakers`,
    lessons: buildLessonsForLevel("am", "fr", level)
  },
  {
    id: `am-de-${level.toLowerCase()}`,
    nativeCode: "am",
    targetCode: "de",
    level,
    title: `${targetNames.de} for ${nativeNames.am} Speakers`,
    lessons: buildLessonsForLevel("am", "de", level)
  },
  {
    id: `ti-en-${level.toLowerCase()}`,
    nativeCode: "ti",
    targetCode: "en",
    level,
    title: `${targetNames.en} for ${nativeNames.ti} Speakers`,
    lessons: buildLessonsForLevel("ti", "en", level)
  },
  {
    id: `ti-fr-${level.toLowerCase()}`,
    nativeCode: "ti",
    targetCode: "fr",
    level,
    title: `${targetNames.fr} for ${nativeNames.ti} Speakers`,
    lessons: buildLessonsForLevel("ti", "fr", level)
  },
  {
    id: `ti-de-${level.toLowerCase()}`,
    nativeCode: "ti",
    targetCode: "de",
    level,
    title: `${targetNames.de} for ${nativeNames.ti} Speakers`,
    lessons: buildLessonsForLevel("ti", "de", level)
  },
  {
    id: `faaf-en-${level.toLowerCase()}`,
    nativeCode: "fa-af",
    targetCode: "en",
    level,
    title: `${targetNames.en} for ${nativeNames["fa-af"]} Speakers`,
    lessons: buildLessonsForLevel("fa-af", "en", level)
  },
  {
    id: `faaf-fr-${level.toLowerCase()}`,
    nativeCode: "fa-af",
    targetCode: "fr",
    level,
    title: `${targetNames.fr} for ${nativeNames["fa-af"]} Speakers`,
    lessons: buildLessonsForLevel("fa-af", "fr", level)
  },
  {
    id: `faaf-de-${level.toLowerCase()}`,
    nativeCode: "fa-af",
    targetCode: "de",
    level,
    title: `${targetNames.de} for ${nativeNames["fa-af"]} Speakers`,
    lessons: buildLessonsForLevel("fa-af", "de", level)
  }
]);

export function getCourse(nativeCode, targetCode, level) {
  const course = courseCatalog.find(
    (item) => item.nativeCode === nativeCode && item.targetCode === targetCode && item.level === level
  );

  if (!course) {
    return null;
  }

  return {
    ...course,
    title: `${course.title} (${level})`
  };
}

export const addCourseLanguageGuide = {
  note: "Add expressions by CEFR level in src/data/vocabulary/commonExpressions.js. Course lessons are generated automatically for each native/target pair."
};
