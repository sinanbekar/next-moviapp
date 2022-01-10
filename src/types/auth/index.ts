export type CounterStatus = "idle" | "loading" | "failed";

export type User = {
  uid: string | null;
  displayName: string | null;
};

export type SigninInfo = {
  email: string;
  password: string;
};
export type SignupInfo = SigninInfo & {
  displayName?: string;
};

export type AsyncData<T> = {
  data: T;
  loading?: boolean;
  error?: string | null;
  fulfilled?: boolean;
};

export type AsyncUser = AsyncData<User> & {
  authentication?: boolean | null;
};
