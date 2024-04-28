import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type AddFileParams = {
    agentId: string;
    fileName: string;
}

export const useAddFile = ({ agentId, fileName }: AddFileParams) => {
    const [addFileStatus, setAddFileStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>( 'IDLE');
    const [error, setError] = React.useState<Error | null>(null);
    const { user, loading } = useAuth(); 
    const userId = user?.uid || 'NA';

    if (userId === 'NA') {
        throw new Error('useAddFile must be used within an AuthProvider');
    }

    const addFile = async ({ agentId, fileName }: AddFileParams) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/add_file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                    file_name: fileName,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add file');
            }

            const data = await response.json();

            if(data.status === 'OK') {
                setAddFileStatus('SUCCESS');
            } else {
                setAddFileStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error'));
            }

        } catch (error: any) {
            setAddFileStatus('ERROR');
            setError(error);
        }
    };

    return { addFileStatus, error, addFile };
}

type DeleteFileParams = {
    agentId: string;
    fileName: string;
};

export const useDeleteFile = ({ agentId, fileName }: DeleteFileParams) => {
    const [deleteFileStatus, setDeleteFileStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState<Error | null>(null);
    const { user, loading } = useAuth();
    const userId = user?.uid || 'NA';

    if (userId === 'NA') {
        throw new Error('useDeleteFile must be used within an AuthProvider');
    }

    const deleteFile = async ({ agentId, fileName }: DeleteFileParams) => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/delete_file', {
                method: 'POST',  // Assuming the backend expects a DELETE method for this operation
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                    file_name: fileName,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            const data = await response.json();

            if (data.status === 'OK') {
                setDeleteFileStatus('SUCCESS');
            } else {
                setDeleteFileStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error'));
            }

        } catch (error: any) {
            setDeleteFileStatus('ERROR');
            setError(error);
        }
    };

    return { deleteFileStatus, error, deleteFile };
};
