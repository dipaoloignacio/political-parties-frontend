import "./App.css";
import { WebSocketProvider } from "./context/WebSocketContext";
import { HomePage } from "./pages/HomePage";

function PoliticalApp() {
  return (
    <>
      <WebSocketProvider url="wss://parties-api.dipaoloproyects.space">
        <HomePage />
      </WebSocketProvider>
    </>
  );
}

export default PoliticalApp;
