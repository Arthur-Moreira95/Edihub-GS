import { Hero } from '../components/home/Hero.jsx';
import { WeekDeadlines } from '../components/home/WeekDeadlines.jsx';
import { HowItWorks } from '../components/home/HowItWorks.jsx';
import { CategoryBrowse } from '../components/home/CategoryBrowse.jsx';
import { FinalCta } from '../components/home/FinalCta.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <WeekDeadlines />
      <HowItWorks />
      <CategoryBrowse />
      <FinalCta />
    </>
  );
}
