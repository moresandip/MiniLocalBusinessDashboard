import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface BusinessData {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  headline: string;
}

interface BusinessState {
  businessData: BusinessData | null;
  loading: boolean;
  error: string | null;
  formData: {
    name: string;
    location: string;
  };
}

type BusinessAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BUSINESS_DATA'; payload: BusinessData }
  | { type: 'SET_FORM_DATA'; payload: { name: string; location: string } }
  | { type: 'UPDATE_HEADLINE'; payload: string }
  | { type: 'RESET_STATE' };

const initialState: BusinessState = {
  businessData: null,
  loading: false,
  error: null,
  formData: {
    name: '',
    location: ''
  }
};

const businessReducer = (state: BusinessState, action: BusinessAction): BusinessState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BUSINESS_DATA':
      return { 
        ...state, 
        businessData: action.payload, 
        loading: false, 
        error: null 
      };
    case 'SET_FORM_DATA':
      return { ...state, formData: action.payload };
    case 'UPDATE_HEADLINE':
      return {
        ...state,
        businessData: state.businessData 
          ? { ...state.businessData, headline: action.payload }
          : null,
        loading: false,
        error: null
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

const BusinessContext = createContext<{
  state: BusinessState;
  dispatch: React.Dispatch<BusinessAction>;
} | null>(null);

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(businessReducer, initialState);

  return (
    <BusinessContext.Provider value={{ state, dispatch }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};