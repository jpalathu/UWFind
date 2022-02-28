export const INITIAL_VALIDATION_STATE = {
  value: "",
  isInvalid: false,
  errorMessage: "",
};

export type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

export const formatValidState = (value: any) => {
  return { value, isInvalid: false, errorMessage: "" };
};

export const formatInvalidState = (value: any, errorMessage: string) => {
  return { value, isInvalid: true, errorMessage };
};
