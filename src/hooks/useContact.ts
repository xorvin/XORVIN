import { useMutation } from '@tanstack/react-query';
import { contactService } from '@/services/contact.service';
import type { ContactForm } from '@/types';

export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactForm) => contactService.submitContact(data),
  });
}
