import AppRoutes from "./routes/AppRoutes";

const App = () => {
  document.title = "World Country explorer";
  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
