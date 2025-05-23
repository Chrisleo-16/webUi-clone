import MobitCard from "@/components/cards/xmobcard";
import XmobImage from "@/components/images/xmobImage";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobRating from "@/components/rating/xmobRating";
import XmobTable from "@/components/tables/xmobTable";
import XmobText from "@/components/text/xmobText";
import { FeedbackMessage } from "@/helpers/interfaces/FeedbackMessageModel";

interface FeedbackProps {
  feedback: FeedbackMessage;
}

const columns = [
  { label: "Name", key: "name" },
  { label: "Date", key: "date" },
  { label: "Feedback", key: "feedback" },
  { label: "Rating", key: "rating" },
];

export default function AnalyticUserDashBoard({ feedback }: FeedbackProps) {
  const { uniqueUsers, raters } = feedback;

  const data = raters.map((rater) => ({
    name: (
      <Xmoblayout layoutType="flex-row">
        <XmobImage src={rater.profilePicUrl} circular={true} width="20px" height="20px" />
        <XmobText>{rater.username}</XmobText>
      </Xmoblayout>
    ),
    date: <XmobText>{rater.feedbackDate}</XmobText>,
    feedback: rater.feedbackMessages.join(", "), // In case there are multiple feedback messages
    rating: <XmobRating totalStars={5} value={rater.rating} readOnly />,
  }));

  return (
    <div>
      <Xmoblayout layoutType="flex-row" isResponsive={true}>
        <MobitCard bordered={true} rounded={true}>
        <Xmoblayout layoutType="flex-col" isResponsive={true}>
          <XmobText variant="h5" textAlign="center">Unique Users</XmobText>
          <XmobText variant="h3" textAlign="center" fontWeight="bold">{uniqueUsers}</XmobText>
          </Xmoblayout>
        </MobitCard>
        <MobitCard bordered={true} rounded={true}>
        <Xmoblayout layoutType="flex-col" isResponsive={true}>
          <XmobText variant="h5" textAlign="center">Total Ratings</XmobText>
          <XmobText variant="h3" textAlign="center" fontWeight="bold">{raters.length}</XmobText>
          </Xmoblayout>
        </MobitCard>
      </Xmoblayout>
      <XmobTable columns={columns} data={data} />
    </div>
  );
}
