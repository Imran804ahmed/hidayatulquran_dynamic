// Content of the course pages (one entry per course). Rendered by components/course/CoursePage.
// JSX fragments keep inline emphasis (<strong>) of the original copy.
import type { CourseContent } from "@/components/course/types";

export const COURSES = {
  noorani: {
    path: "/noorani-qaida-online",
    title: "Noorani Qaida Online Course for Kids and Beginners | HidayatulQuran Academy",
    description: "Learn Noorani Qaida online with certified tutors. 1-on-1 live classes for kids and adults starting their Quran journey. Proper pronunciation, Arabic letters, and Tajweed basics. Free trial!",
    ogTitle: "Noorani Qaida Online Course for Kids and Beginners | HidayatulQuran Academy",
    ogDescription: "Learn Noorani Qaida online with certified tutors. 1-on-1 live classes for kids and Quran beginners. Free trial available!",
    image: "/assets/img/NooraniQaida_hidayatulquran_Academy.jpg",
    imageAlt: "Noorani Qaida online course for kids and Quran beginners",
    name: "Noorani Qaida Online Course",
    breadcrumb: "Noorani Qaida Online",
    schema: { name: "Noorani Qaida Online Course", description: "Learn Noorani Qaida online with certified tutors. 1-on-1 live classes for kids and adults starting their Quran journey with Arabic letters and proper pronunciation.", educationalLevel: "Beginner", breadcrumb: "Noorani Qaida Online" },
    introHeading: "Learn Noorani Qaida Online — Beginner Quran Foundation Course",
    intro: [
      <>
        Start your Quran journey with our{" "}
        <strong>online Noorani Qaida course</strong>
        {" "}— the perfect foundation for kids and adults who want to learn how to read the Quran from scratch. Our certified tutors teach Arabic letter recognition, correct pronunciation (Makharij), proper letter joining, and essential Quran reading skills through live 1-on-1 sessions.
      </>,
      <>
        Whether you are in the{" "}
        <strong>USA, UK, Canada, Australia, UAE</strong>
        , or anywhere in the world, our flexible online Noorani Qaida classes fit your schedule.{" "}
        <strong>Free trial class</strong>
        {" "}available — no payment required.
      </>,
    ],
    learnHeading: "What You Will Learn",
    learn: [
      <>
        <strong>Arabic letters</strong>
        {" "}— recognition and correct pronunciation
      </>,
      <>
        <strong>Harakaat (vowels)</strong>
        {" "}— Fatha, Kasra, Damma and their usage
      </>,
      <>
        <strong>Letter joining rules</strong>
        {" "}— how Arabic letters connect in words
      </>,
      <>
        <strong>Tanween, Shadda, Sukoon</strong>
        {" "}— essential pronunciation marks
      </>,
      <>
        <strong>Basic Tajweed rules</strong>
        {" "}— for correct Quran recitation
      </>,
      <>
        <strong>Six Kalimas, basic Duas, and Hadith</strong>
      </>,
      <>
        <strong>Seerat Nabi (S.A.W.)</strong>
        {" "}— introduction to Prophet&apos;s life
      </>,
    ],
    audience: [
      "Kids starting Quran from scratch",
      "Adults who have never learned to read Arabic",
      "New Muslims beginning their Quran journey",
      "Anyone wanting a strong foundation before full Quran reading",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
  reading: {
    path: "/quran-reading-course-online",
    title: "Online Quran Reading Course with Tajweed | HidayatulQuran Academy",
    description: "Master Quran reading with proper Tajweed in live 1-on-1 online classes. For kids and adults worldwide. Certified tutors. Free trial class — no obligation!",
    ogTitle: "Online Quran Reading Course with Tajweed | HidayatulQuran Academy",
    ogDescription: "Master Quran reading with proper Tajweed in live 1-on-1 online classes for kids and adults. Free trial available!",
    image: "/assets/img/QuranReadingCourse_hidayatulquran_Academy.jpeg",
    imageAlt: "Quran reading course online with certified tutor guidance",
    name: "Online Quran Reading Course",
    breadcrumb: "Quran Reading Course Online",
    schema: { name: "Online Quran Reading Course", description: "Master Quran reading with proper Tajweed in live 1-on-1 online sessions. Certified tutors for kids and adults worldwide.", educationalLevel: "Beginner to Intermediate", breadcrumb: "Quran Reading Course" },
    introHeading: "Online Quran Reading Course — From Letters to Full Verses",
    intro: [
      <>
        Our{" "}
        <strong>online Quran reading course</strong>
        {" "}is designed for students who want to improve their Quran reading from basic words to complete verses. It focuses on fluency, correct pronunciation (Tajweed), and confident recitation so learners can read the Quran smoothly with a deep connection to the words of Allah.
      </>,
      <>
        All classes are live, 1-on-1 sessions with a certified tutor. Available for students in the{" "}
        <strong>USA, UK, Canada, Australia, UAE</strong>
        , and worldwide.{" "}
        <strong>Free trial class available</strong>
        {" "}— start today with no commitment.
      </>,
    ],
    learnHeading: "What You Will Learn",
    learn: [
      <>
        <strong>Fluent Quran reading</strong>
        {" "}from letters to full verses
      </>,
      <>
        <strong>Correct pronunciation</strong>
        {" "}(Makharij) of all Arabic letters
      </>,
      <>
        <strong>Basic Tajweed rules</strong>
        {" "}applied during reading
      </>,
      <>
        <strong>Wazu (ablution)</strong>
        {" "}— method and rulings
      </>,
      <>
        <strong>Seerat Nabi (S.A.W.)</strong>
        {" "}and multiple Duas
      </>,
      <>
        <strong>Selected Hadith</strong>
        {" "}and Islamic etiquette
      </>,
    ],
    audience: [
      "Students who have completed Noorani Qaida",
      "Adults who can read but want to improve fluency",
      "Kids learning to read the full Quran",
      "Anyone who wants to read Quran with proper Tajweed",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
  tajweed: {
    path: "/quran-tajweed-course-online",
    title: "Online Quran with Tajweed Course — Master Proper Recitation | HidayatulQuran Academy",
    description: "Learn Quran with Tajweed rules online. Master Ghunna, Qalqalah, Madd and more with certified tutors. 1-on-1 live sessions for kids and adults. Free trial class!",
    ogTitle: "Online Quran with Tajweed Course | HidayatulQuran Academy",
    ogDescription: "Learn Quran with Tajweed rules online. Master proper recitation with certified tutors. 1-on-1 live sessions. Free trial!",
    image: "/assets/img/QuranWithTajweed_hidayatulquran_Academy.jpeg",
    imageAlt: "Quran with Tajweed course for accurate online recitation",
    name: "Online Quran with Tajweed Course",
    breadcrumb: "Quran with Tajweed Online",
    schema: { name: "Quran with Tajweed Online Course", description: "Master Tajweed rules for proper Quran recitation. Learn Ghunna, Qalqalah, Ikhfa, Idgham, Madd and more in live 1-on-1 online sessions.", educationalLevel: "Intermediate", breadcrumb: "Quran with Tajweed" },
    introHeading: "Online Quran with Tajweed — Master Proper Recitation",
    intro: [
      <>
        Master the rules of{" "}
        <strong>Tajweed</strong>
        {" "}and beautify your Quran recitation with our online course. Students learn essential recitation rules — Ghunna, Qalqalah, Ikhfa, Idgham, and Madd — so they can recite the Quran the way it was revealed, with beauty, precision, and care.
      </>,
      <>
        All classes are live 1-on-1 sessions with a certified Tajweed teacher. Available for students in{" "}
        <strong>USA, UK, Canada, UAE, Australia</strong>
        , and worldwide. Book a{" "}
        <strong>free trial class</strong>
        {" "}today.
      </>,
    ],
    learnHeading: "Tajweed Rules You Will Master",
    learn: [
      <>
        <strong>Ghunna</strong>
        {" "}— nasal sound rules
      </>,
      <>
        <strong>Qalqalah</strong>
        {" "}— echo/bouncing sound
      </>,
      <>
        <strong>Ikhfa</strong>
        {" "}— hiding sound rules
      </>,
      <>
        <strong>Idgham</strong>
        {" "}— merging letters
      </>,
      <>
        <strong>Madd</strong>
        {" "}— elongation rules
      </>,
      <>
        <strong>Makharij</strong>
        {" "}— articulation points of letters
      </>,
      <>
        <strong>Waqf rules</strong>
        {" "}— correct stopping points
      </>,
    ],
    audience: [
      "Students who can read the Quran and want to improve recitation",
      "Adults wanting to learn proper Tajweed from scratch",
      "Kids who have completed basic Quran reading",
      "Anyone who wants to recite the Quran correctly",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
  hifz: {
    path: "/quran-memorization-hifz-online",
    title: "Online Hifz Course — Quran Memorization Classes Online | HidayatulQuran Academy",
    description: "Memorize the Quran online with structured Hifz classes. Daily lessons, revision cycles and certified Hafiz tutors for kids and adults. Free trial class available!",
    ogTitle: "Online Hifz Course — Quran Memorization Classes | HidayatulQuran Academy",
    ogDescription: "Memorize the Quran online with structured Hifz classes. Daily lessons and certified tutors for kids and adults. Free trial!",
    image: "/assets/img/QuranMemorization_hidayatulquran_Academy.jpeg",
    imageAlt: "Online Hifz and Quran memorization course with structured daily revision",
    name: "Online Quran Memorization (Hifz) Course",
    breadcrumb: "Quran Memorization Online",
    schema: { name: "Online Quran Memorization (Hifz) Course", description: "Memorize the Quran online with structured daily lessons, revision cycles, and certified Hafiz tutors for kids and adults worldwide.", educationalLevel: "Intermediate to Advanced", breadcrumb: "Quran Memorization (Hifz)" },
    introHeading: "Online Hifz Course — Memorize the Quran from Home",
    intro: [
      <>
        Our{" "}
        <strong>online Quran memorization (Hifz) course</strong>
        {" "}supports students in memorizing short Surahs, selected portions, or the entire Holy Quran. Through a structured and disciplined routine with daily new lessons and regular revision cycles, our certified Hafiz tutors guide you every step of the way.
      </>,
      <>
        Live 1-on-1 sessions available for students in{" "}
        <strong>USA, UK, Canada, Australia, UAE</strong>
        , and worldwide. Flexible timings for all time zones.{" "}
        <strong>Free trial class</strong>
        {" "}— no commitment required.
      </>,
    ],
    learnHeading: "What You Will Learn",
    learn: [
      <>
        <strong>Daily new sabaq</strong>
        {" "}(new lesson) with memorization techniques
      </>,
      <>
        <strong>Sabqi</strong>
        {" "}— revision of recent memorization
      </>,
      <>
        <strong>Manzil</strong>
        {" "}— revision of older memorized portions
      </>,
      <>
        <strong>Tajweed during memorization</strong>
        {" "}for correct recitation
      </>,
      <>
        <strong>Method of Salah</strong>
        {" "}— rulings and translation
      </>,
      <>
        <strong>Wazu and Ghusal</strong>
        {" "}— rulings and method
      </>,
      <>
        <strong>Seerat Nabi (S.A.W.)</strong>
      </>,
    ],
    audience: [
      "Kids who want to become Hafiz-e-Quran",
      "Adults who want to memorize selected Surahs",
      "Students who have completed Quran reading with Tajweed",
      "Anyone with a goal to memorize the full Quran",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
  tafseer: {
    path: "/tafseer-quran-course-online",
    title: "Online Tafseer e Quran Course — Understand the Quran | HidayatulQuran Academy",
    description: "Explore Tafseer e Quran online. Understand the meaning and wisdom of Quranic verses with certified scholars. Live 1-on-1 sessions for kids and adults worldwide. Free trial!",
    ogTitle: "Online Tafseer e Quran Course | HidayatulQuran Academy",
    ogDescription: "Understand the Quran through Tafseer. Live 1-on-1 online sessions with certified scholars for kids and adults. Free trial available!",
    image: "/assets/img/TafseerQuran_hidayatulquran_Academy.jpeg",
    imageAlt: "Tafseer e Quran course for understanding Quranic meaning and wisdom",
    name: "Online Tafseer e Quran Course",
    breadcrumb: "Tafseer e Quran Online",
    schema: { name: "Online Tafseer e Quran Course", description: "Explore the meanings, explanations, and wisdom of the Holy Quran. Understand and apply divine guidance with certified scholars in live 1-on-1 online sessions.", educationalLevel: "Intermediate to Advanced", breadcrumb: "Tafseer e Quran Course" },
    introHeading: "Online Tafseer Quran — Learn the Meaning of Quran",
    intro: [
      <>
        Our{" "}
        <strong>online Tafseer e Quran course</strong>
        {" "}helps students explore the meanings, explanations, and wisdom of the Holy Quran. Students learn to reflect on Quranic verses, understand their message, and apply divine guidance in daily life with better awareness, purpose, and spiritual connection.
      </>,
      <>
        Taught by certified Islamic scholars in live 1-on-1 online sessions. Available for students in{" "}
        <strong>USA, UK, Canada, Australia, UAE</strong>
        , and worldwide.{" "}
        <strong>Free trial class</strong>
        {" "}available with no commitment.
      </>,
    ],
    learnHeading: "What You Will Learn",
    learn: [
      <>
        <strong>Verse-by-verse Tafseer</strong>
        {" "}from classical and modern scholars
      </>,
      <>
        <strong>Context (Asbab al-Nuzul)</strong>
        {" "}— reasons for revelation
      </>,
      <>
        <strong>Quranic guidance</strong>
        {" "}for daily life application
      </>,
      <>
        <strong>Method of Salah</strong>
        {" "}— rulings and translation
      </>,
      <>
        <strong>Wazu and Ghusal</strong>
        {" "}— rulings and method
      </>,
      <>
        <strong>Islamic etiquette of life</strong>
      </>,
    ],
    audience: [
      "Students who want to understand the Quran deeply",
      "Adults who want to strengthen their faith through knowledge",
      "Anyone who reads the Quran but wants to know its meaning",
      "Students seeking Islamic knowledge in English",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
  arabic: {
    path: "/quranic-arabic-course-online",
    title: "Quranic Arabic Course Online — Understand Quran Without Translation | HidayatulQuran",
    description: "Learn Quranic Arabic online to understand the Quran directly. Grammar, vocabulary and meanings in live 1-on-1 sessions. Free trial class at HidayatulQuran Academy!",
    ogTitle: "Quranic Arabic Course Online | HidayatulQuran Academy",
    ogDescription: "Learn Quranic Arabic online. Understand the Quran directly — grammar, vocabulary, meanings. 1-on-1 live sessions. Free trial!",
    image: "/assets/img/QuranicArabic_hidayatulquran_Academy.jpeg",
    imageAlt: "Quranic Arabic course for understanding Quran vocabulary and grammar",
    name: "Quranic Arabic Course Online",
    breadcrumb: "Quranic Arabic Course Online",
    schema: { name: "Quranic Arabic Course Online", description: "Learn Quranic Arabic vocabulary, grammar, and sentence patterns to understand the Quran directly without needing translation. Live 1-on-1 online sessions.", educationalLevel: "Beginner to Intermediate", breadcrumb: "Quranic Arabic Course" },
    introHeading: "Learn Quranic Arabic Online — Understand Quran Without Translation",
    intro: [
      <>
        Our{" "}
        <strong>online Quranic Arabic course</strong>
        {" "}teaches you the language of the Quran — vocabulary, grammar, and sentence patterns — so you can begin understanding Quranic verses directly, without needing a translation. Recitation becomes more meaningful and your connection with Allah&apos;s words grows deeper.
      </>,
      <>
        Live 1-on-1 online sessions with certified Arabic teachers. Available for students in{" "}
        <strong>USA, UK, Canada, Australia, UAE</strong>
        , and worldwide. Book a{" "}
        <strong>free trial class</strong>
        {" "}today.
      </>,
    ],
    learnHeading: "What You Will Learn",
    learn: [
      <>
        <strong>Quranic vocabulary</strong>
        {" "}— most common Quran words
      </>,
      <>
        <strong>Arabic grammar (Nahw &amp; Sarf)</strong>
        {" "}basics
      </>,
      <>
        <strong>Sentence structure</strong>
        {" "}in the Quran
      </>,
      <>
        <strong>Root word system</strong>
        {" "}— unlock thousands of words
      </>,
      <>
        <strong>Method of Salah</strong>
        {" "}— rulings and translation
      </>,
      <>
        <strong>Rules of Purification (Taharah)</strong>
      </>,
    ],
    audience: [
      "Students who want to understand the Quran directly",
      "Adults who want to learn Arabic for Quran comprehension",
      "Anyone who reads the Quran but doesn't understand Arabic",
      "Students who completed Quran reading and want to go deeper",
      "Students in USA, UK, Canada, Australia and worldwide",
    ],
  },
} satisfies Record<string, CourseContent>;
