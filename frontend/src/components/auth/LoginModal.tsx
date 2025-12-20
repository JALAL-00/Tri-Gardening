'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LoginForm from "./LoginForm"; 

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export default function LoginModal({ isOpen, onOpenChange, title = "Login to your Account" }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none p-0 max-w-md">
        <LoginForm title={title} />
      </DialogContent>
    </Dialog>
  );
}