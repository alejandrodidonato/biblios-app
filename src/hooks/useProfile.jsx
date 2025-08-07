import { useContext } from 'react';
import ProfileContext from '../context/ProfileProvider';

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile debe usarse dentro de ProfileProvider');
  }
  return context;
};

export default useProfile;