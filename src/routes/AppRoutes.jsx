import { Routes, Route } from "react-router-dom";
import Landing from "../moodcheckin/pages/Landing";
import SelectMoods from "../moodcheckin/pages/SelectMoods";
import EmotionSlider from "../moodcheckin/pages/EmotionSlider";
import EmotionResults from "../moodcheckin/pages/EmotionResults";
import SelectActivity from "../moodcheckin/pages/SelectActivity";
import Success from "../moodcheckin/pages/Success";
import Analytics from '../moodcheckin/pages/Analytics';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/selectmoods" element={<SelectMoods />} />
      <Route path="/emotion-slider" element={<EmotionSlider />} />
      <Route path="/emotion-results" element={<EmotionResults />} />
      <Route path="/select-activity" element={<SelectActivity />} />
      <Route path="/success" element={<Success />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default AppRoutes;
