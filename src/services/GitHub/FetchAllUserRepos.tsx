import * as React from "react";
import Cookie from 'js-cookie';
import { useAuth } from "../../context/AuthContext";
import { redirect } from "react-router-dom";
import { GithubAuthProvider, getAuth, signOut } from "firebase/auth";
import Cookies from "js-cookie";

const auth = getAuth();

export const logout = (setUser: any) => {
    signOut(auth)
      .then(() => {
        Cookies.remove('githubToken');
        setUser(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
}

export const useRepoDetails = () => {
    const {user, setUser} = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);
    const [repoInstallations, setRepoInstallations] = React.useState<{ [key: string]: string }>({});

    const githubToken: string = Cookie.get('githubToken') || '';

    const fetchAllUserInstallations = React.useCallback(async () => {
        checkTokenValidity();
        const response = await fetch(`https://api.github.com/user/installations`, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch installations');
        }

        const data = await response.json();

        for (let i = 0; i < data.installations.length; i++) {
            const installationId = data.installations[i].id;
            const installationResponse = await fetch(`https://api.github.com/user/installations/${installationId}/repositories`, {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });

            if (!installationResponse.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const installationData = await installationResponse.json();
            const installationRepos = installationData.repositories;

            for (let j = 0; j < installationRepos.length; j++) {
                const repoName = installationRepos[j].full_name;
                repoInstallations[repoName] = installationId.toString();
            }
            setRepoInstallations(repoInstallations);
        }
        setIsLoading(false);
        return repoInstallations;
    }, []);

    const checkTokenValidity = async () => {
        if (!githubToken) {
            logout(setUser)
            redirect('/');
        } else {
            // Assuming there's an API endpoint to validate the token
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            });
            if (!response.ok) {
                logout(setUser)
                redirect('/');
            }
        }
    }

    return { isLoading, setIsLoading, fetchAllUserInstallations, repoInstallations };
};