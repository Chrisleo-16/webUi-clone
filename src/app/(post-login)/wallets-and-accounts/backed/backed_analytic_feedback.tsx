import FeedBackService from "@/helpers/Api/feedback/feedback.service";
import { FeedbackMessage } from "@/helpers/interfaces/FeedbackMessageModel";

class BackedFeeback {
  private feedService: FeedBackService;
  constructor(feedService: FeedBackService) {
    this.feedService = feedService;
  }

  async getFeedback(): Promise<FeedbackMessage> {
    const feedbackResponse = await this.feedService.getMyFeedBackAnalytics();
    let data: FeedbackMessage;
    if (!feedbackResponse?.data) {
      data = { uniqueUsers: 0, raters: [] } as FeedbackMessage;
    } else {
      data = feedbackResponse.data;
    }
    return data;
  }
}

export default new BackedFeeback(new FeedBackService());
