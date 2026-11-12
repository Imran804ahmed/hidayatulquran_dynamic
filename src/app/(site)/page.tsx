import { englishAlternates, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import HeroSection from "@/components/home/sections/HeroSection";
import CoursesSection from "@/components/home/sections/CoursesSection";
import PricingSection from "@/components/home/sections/PricingSection";
import TeachingMethodSection from "@/components/home/sections/TeachingMethodSection";
import EnvironmentSection from "@/components/home/sections/EnvironmentSection";
import FeaturesSection from "@/components/home/sections/FeaturesSection";
import FaqSection from "@/components/home/sections/FaqSection";
import TestimonialsSection from "@/components/home/sections/TestimonialsSection";
import PaymentsSection from "@/components/home/sections/PaymentsSection";
import ContactSection from "@/components/home/sections/ContactSection";
import { faqSchema, organizationSchema, websiteSchema } from "@/content/home-schema";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  path: "/",
  title: "Online Quran Classes for Kids and Adults | HidayatulQuran Academy",
  description: "Join live 1-on-1 online Quran classes with certified male and female tutors. Tajweed, Hifz, Noorani Qaida and more for kids and adults in USA, UK, Canada and worldwide. Book a free trial today!",
  keywords: "HidayatulQuran, online Quran academy, online Quran classes, learn Quran online, Quran with Tajweed, Noorani Qaida, Quran reading course, Quran memorization, Tafseer course, Quranic Arabic, Islamic studies, Quran tutor for kids, female Quran teacher, one to one Quran classes",
  ogDescription: "Join live 1-on-1 online Quran classes with certified male and female tutors. Tajweed, Hifz, Noorani Qaida for kids and adults in USA, UK, Canada. Free trial!",
  twitterDescription: "Join live 1-on-1 online Quran classes. Tajweed, Hifz, Noorani Qaida for kids and adults in USA, UK, Canada. Book a free trial class today!",
  locale: "en_US",
  languages: englishAlternates("/"),
});

export default function HomePage() {
  return (
    <div className={styles.page}>
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={websiteSchema} />
      <HeroSection />
      <main id="main">
        <CoursesSection />
        <PricingSection />
        <TeachingMethodSection />
        <EnvironmentSection />
        <FeaturesSection />
        <FaqSection />
        <TestimonialsSection />
        <PaymentsSection />
        <ContactSection />
      </main>
    </div>
  );
}
