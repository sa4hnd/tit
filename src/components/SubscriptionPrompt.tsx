import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SubscriptionPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white'>
        <DialogHeader>
          <DialogTitle>Subscribe to Access Quizzes</DialogTitle>
          <DialogDescription className='text-gray-200'>
            You need to subscribe to access our quizzes and improve your
            knowledge.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <p>Unlock unlimited quizzes and track your progress!</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant='secondary'>
            Close
          </Button>
          <Button onClick={() => (window.location.href = '/contact')}>
            Contact Us
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionPrompt;
