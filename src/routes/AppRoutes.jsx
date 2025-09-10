import { Routes, Route } from "react-router-dom";
import Landing from "../moodcheckin/pages/Landing";
import SelectMoods from "../moodcheckin/pages/SelectMoods";
import EmotionSlider from "../moodcheckin/pages/EmotionSlider";
import EmotionResults from "../moodcheckin/pages/EmotionResults";
import SelectActivity from "../moodcheckin/pages/SelectActivity";
import Success from "../moodcheckin/pages/Success";
import Analytics from '../moodcheckin/pages/Analytics';
import Login from '../moodcheckin/pages/Login';
import Signup from '../moodcheckin/pages/Signup';

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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default AppRoutes;
