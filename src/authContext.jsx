import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();
const userData = localStorage.getItem('test-user');
    const parsedData = JSON.parse(userData)
    
const initialState = {
  isAuthenticated: parsedData ? true : false,
  user: parsedData ? parsedData : null,
  token: parsedData ? parsedData?.token :null,
  role: parsedData ? parsedData?.role : null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { token, role } = action.payload;
      localStorage.setItem('test-user', JSON.stringify(action.payload))
      state.isAuthenticated = true
      state.user = action.payload
      state.token = token
      state.role = role
      return {
        ...state,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        role: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "LOGOUT",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    
    const userData = localStorage.getItem('test-user');
    const parsedData = JSON.parse(userData)
    if(userData) {
      
    }
  }, []);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    const role = localStorage.getItem("role");
    window.location.href = "/" + role + "/login";
  };
  console.log(state)
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