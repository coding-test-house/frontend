'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  sessionNumber: string;
  onChange: (session: string) => void;
  disabled?: boolean;
}

const SESSION_LIST = [
  '11회차',
  '12회차',
  '13회차',
  '14회차',
  '15회차',
  '16회차',
  '17회차',
  '18회차',
  '19회차',
  '20회차',
];

export default function SessionSelectModal({
  sessionNumber,
  onChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (session: string) => {
    onChange(session);
    setOpen(false);
  };

  return (
    <div className="space-y-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-gray-800/50 border-purple-500/50 text-white justify-start"
            id="session-number"
            type="button"
            disabled={disabled}
          >
            {sessionNumber || '회차 선택'}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border border-gray-700">
          <DialogTitle className="text-yellow-400 mb-2">회차 선택</DialogTitle>
          <div className="grid grid-cols-2 gap-2">
            {SESSION_LIST.map((session) => (
              <Button
                key={session}
                variant="outline"
                className="bg-gray-800/50 border-purple-500/50 text-white placeholder:text-gray-400"
                onClick={() => handleSelect(session)}
              >
                {session}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
