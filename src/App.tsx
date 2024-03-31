import { Route, Routes } from "react-router-dom";
import InfinityScroll from "./components/InfinityScroll";

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<InfinityScroll />} />
      </Routes>
    </>
  );
}

export default App;
