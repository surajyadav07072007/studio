'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ReportJobDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe!",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report a Suspicious Job</DialogTitle>
            <DialogDescription>
              Help us protect the community by reporting fake or misleading job postings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="job-link">Job Link</Label>
              <Input id="job-link" type="url" placeholder="https://example.com/job/123" required />
            </div>
            <div className="grid w-full gap-1.5">
                <Label htmlFor="reason">Reason for Reporting</Label>
                <Textarea placeholder="Describe why you think this job is suspicious..." id="reason" required />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="proof">Upload Proof (optional)</Label>
              <Input id="proof" type="file" />
               <p className="text-xs text-muted-foreground">Screenshots, emails, etc.</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
