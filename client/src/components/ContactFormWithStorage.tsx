import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, SendIcon, Loader2 } from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactFormWithStorage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  // Submit form mutation
  const submitContactForm = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("/api/contact", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      reset();
      setSubmitted(true);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContactForm.mutate(data);
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-md">
      <div className="p-6 md:p-8">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SendIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-heading text-forest text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-olive mb-6">
              Your message has been sent successfully. We'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              variant="outline"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-heading text-forest text-xl font-bold mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-forest font-medium mb-1">
                  Your Name *
                </label>
                <Input 
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-forest font-medium mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-forest font-medium mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Input 
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register("phone")}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-forest font-medium mb-1">
                  Subject *
                </label>
                <Input 
                  id="subject"
                  type="text"
                  placeholder="What is this regarding?"
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-forest font-medium mb-1">
                  Message *
                </label>
                <Textarea 
                  id="message"
                  placeholder="How can we help you?"
                  rows={5}
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>
              
              <Button 
                type="submit"
                className="w-full md:w-auto"
                disabled={submitContactForm.isPending}
              >
                {submitContactForm.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>Send Message</>
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}