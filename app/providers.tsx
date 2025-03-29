import { Provider } from "react-redux"; // ✅ Correct import
import { store } from "../store/store";
import { ReactNode } from "react"; // ✅ Import ReactNode for proper typing

export default function Providers({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>; // ✅ No more TypeScript error
}
