import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';
import { useSaveFeedback } from '../../services/User/UserInfoHelper';

export const FeedbackModal: React.FC<any> = ({ isOpen, onClose }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();
  const { saveFeedback } = useSaveFeedback();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFeedback(subject, description);
    onClose();
    toast({
      title: "Feedback submitted.",
      description: "Thank you for your feedback.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: 'top'
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Provide Feedback</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input placeholder='Subject' value={subject} onChange={e => setSubject(e.target.value)} required />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} required />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme="blue" type='submit'>
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}