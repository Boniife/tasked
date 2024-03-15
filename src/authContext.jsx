// authProvider.js
import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  globalMessage: "", 
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { token, role } = action.payload;
      localStorage.setItem('test-user', JSON.stringify(action.payload))
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        token: token,
        role: role,
        globalMessage: "Login successful",
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
        globalMessage: "",
      };
    case "SET_GLOBAL_MESSAGE":
      return {
        ...state,
        globalMessage: action.payload,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    const userData = localStorage.getItem('test-user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      dispatch({ type: "LOGIN", payload: parsedData });
    }
  }, []);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    const role = localStorage.getItem("role");
    window.location.href = "/" + role + "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
