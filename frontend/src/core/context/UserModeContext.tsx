import { createContext, useContext, useState } from 'react';

export type UserMode = 'STUDENT' | 'PROFESSIONAL' | 'TEACHER';

interface UserModeContextType {
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  coursePPC?: string; // Ex: "engenharia-civil" — filtra trilha do Modo Estudante
  setCoursePPC: (course: string) => void;
}

const UserModeContext = createContext<UserModeContextType>({
  mode: 'STUDENT',
  setMode: () => {},
  setCoursePPC: () => {},
});

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<UserMode>('STUDENT');
  const [coursePPC, setCoursePPC] = useState<string | undefined>(undefined);

  return (
    <UserModeContext.Provider value={{ mode, setMode, coursePPC, setCoursePPC }}>
      {children}
    </UserModeContext.Provider>
  );
}

export const useUserMode = () => useContext(UserModeContext);
