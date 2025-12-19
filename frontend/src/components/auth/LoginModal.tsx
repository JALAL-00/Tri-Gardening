'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LoginForm from "./LoginForm"; // We will reuse the login form we already built

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export default function LoginModal({ isOpen, onOpenChange, title = "Login to your Account" }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none p-0 max-w-md">
        {/* We reuse the LoginForm, which has its own Card styling */}
        <LoginForm title={title} />
      </DialogContent>
    </Dialog>
  );
}