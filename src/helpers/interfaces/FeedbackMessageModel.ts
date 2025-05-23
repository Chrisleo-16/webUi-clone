export interface FeedbackMessage {
      uniqueUsers: number;
      raters: Rater[];
  }
  
  interface Rater {
    username: string;
    profilePicUrl: string;
    positiveFeedback: string;
    negativeFeedback: string;
    feedbackMessages: string[];
    feedbackDate: string;
    rating: number;
  }
  

