import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Star, StarHalf } from "lucide-react";

// Review schema for validation
const reviewSchema = z.object({
  userId: z.number(),
  productId: z.number(),
  rating: z.number().min(1, "Please select a rating").max(5),
  review: z.string().min(10, "Review must be at least 10 characters long"),
});

// Type definition for our form
type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewSystemProps {
  productId: number;
}

export default function ProductReviewSystem({ productId }: ProductReviewSystemProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the current user ID from the session or local storage
  // In a real app, this would come from your auth context
  const userId = 1; // Placeholder, replace with actual user ID

  // Check if the user can review this product (if they've purchased and received it)
  const { data: canReview, isLoading: checkingEligibility } = useQuery({
    queryKey: [`/api/products/${productId}/can-review`],
    enabled: !!productId && !!userId,
  });

  // Fetch existing reviews for this product
  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  // Set up the form with validation
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      userId: userId,
      productId: productId,
      rating: 0,
      review: "",
    }
  });

  // Watch the rating field for real-time updates
  const currentRating = watch("rating");

  // Set up the mutation to submit the review
  const mutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      return apiRequest(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: "Review submitted!",
        description: "Thank you for sharing your feedback.",
        variant: "default"
      });
      
      // Reset the form
      reset();
      
      // Show success state
      setIsSuccess(true);
      
      // Hide success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
      // Invalidate the cache to refresh the reviews
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/can-review`] });
    },
    onError: (error) => {
      // Show error message
      toast({
        title: "Failed to submit review",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive"
      });
      console.error("Review submission error:", error);
    }
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    // Ensure the data includes the user ID and product ID
    const reviewData = {
      ...data,
      userId: userId,
      productId: productId
    };
    mutation.mutate(reviewData as ReviewFormData);
  };

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Format the average rating to display stars
  const averageRating = calculateAverageRating();
  const roundedRating = Math.round(averageRating * 2) / 2; // Round to nearest 0.5

  // Helper to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }
    
    return stars;
  };

  if (checkingEligibility) {
    return <div className="p-4 text-center">Checking if you can review this product...</div>;
  }

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      {/* Display average rating */}
      {!loadingReviews && reviews && Array.isArray(reviews) && reviews.length > 0 && (
        <div className="flex items-center mb-6">
          <div className="flex items-center mr-2">
            {renderStars(roundedRating)}
          </div>
          <span className="text-lg font-medium">
            {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      )}

      {/* User can write a review section */}
      {canReview && (
        <div className="bg-background p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
              <p className="font-medium">Thank you for your review!</p>
              <p>Your feedback helps other customers make informed decisions.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setValue("rating", rating)}
                      className="focus:outline-none"
                      aria-label={`Rate ${rating} stars`}
                    >
                      <Star 
                        className={`h-8 w-8 cursor-pointer ${
                          currentRating >= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-500">{errors.rating.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="review" className="block text-sm font-medium">Your Review</label>
                <Textarea
                  id="review"
                  placeholder="Share your experience with this product..."
                  rows={5}
                  {...register("review")}
                  aria-invalid={!!errors.review}
                />
                {errors.review && (
                  <p className="text-sm text-red-500">{errors.review.message}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {(isSubmitting || mutation.isPending) ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Display existing reviews */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold mb-4">
          {reviews && Array.isArray(reviews) && reviews.length > 0
            ? "Customer Reviews"
            : "No reviews yet"}
        </h3>
        
        {loadingReviews ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <div className="divide-y">
            {reviews && Array.isArray(reviews) && reviews.map((review: any, index: number) => (
              <div key={index} className="py-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(review.rating)}
                  </div>
                  <span className="font-medium">{review.userName || "Customer"}</span>
                </div>
                <p className="text-gray-600 italic text-sm mb-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-800">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}