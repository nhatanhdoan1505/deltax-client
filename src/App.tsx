import { Controller } from "components/index";
import { AppProvider } from "store/index";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Controller />
    </AppProvider>
  );
}

export default App;
