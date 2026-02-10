import { createContext } from "react";

export const counterContext = createContext({
  form: { site: "", username: "", password: "" },
  setform: () => {},
  passkeyArray: [],
  setPasskeyArray: () => {}
});
