import { RouterProvider } from "react-router-dom";
import { router } from "./router/mainRouter";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from "./store/store";

// Optional: Add a loading component while the store is being rehydrated
const Loading = () => <div>Loading...</div>;

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
