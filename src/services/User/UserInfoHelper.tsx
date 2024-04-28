import React from "react";
import { useAuth } from "../../context/AuthContext";

export const useGetUser = () => {
  const [userStatus, setUserStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [isLoadingUser, setIsLoadingUser] = React.useState(true);
  const [userData, setUserData] = React.useState(null);
  const [error, setError] = React.useState<Error | null>(null);
  const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;
  const { user, loading } = useAuth();
  const userId = user?.uid || 'NA';

  const getUser = async () => {
    try {
      const response = await fetch(backendServiceUrl + '/api/get_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const data = await response.json();

      if (data.status === 'OK') {
        setUserStatus('SUCCESS');
        setUserData(data.user);
      } else {
        setUserStatus('ERROR');
        setError(new Error(data.message || 'Unexpected error'));
      }

    } catch (error: any) {
      setUserStatus('ERROR');
      setError(error);
    }

    setIsLoadingUser(false);
  };

  return { userStatus, userData, error, getUser, isLoadingUser };
}

export const useSaveUser = (userInfo: any) => {
  const [saveStatus, setSaveStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = React.useState<Error | null>(null);
  const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;
  const { user, loading } = useAuth();
  const userId = user?.uid || 'NA';

  const saveUser = async () => {
    try {
      const response = await fetch(backendServiceUrl + '/api/save_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            user_info: userInfo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save user');
      }

      const data = await response.json();

      if (data.status === 'OK') {
        setSaveStatus('SUCCESS');
      } else {
        setSaveStatus('ERROR');
        setError(new Error(data.message || 'Unexpected error'));
      }

    } catch (error: any) {
      setSaveStatus('ERROR');
      setError(error);
    }
  };

  return { saveStatus, error, saveUser };
}

export const useSaveFeedback = () => {
  const [saveStatus, setSaveStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = React.useState<Error | null>(null);
  const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;
  const { user, loading } = useAuth();
  const userId = user?.uid || 'NA';

  const saveFeedback = async (subject: string, description: string) => {
    try {
      const response = await fetch(backendServiceUrl + '/api/write_user_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            subject: subject,
            description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save feedback');
      }

      const data = await response.json();

      if (data.status === 'OK') {
        setSaveStatus('SUCCESS');
      } else {
        setSaveStatus('ERROR');
        setError(new Error(data.message || 'Unexpected error'));
      }

    } catch (error: any) {
      setSaveStatus('ERROR');
      setError(error);
    }
  };

  return { saveStatus, error, saveFeedback };
}