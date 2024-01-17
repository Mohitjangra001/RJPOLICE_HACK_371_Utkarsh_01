import React, { useState } from 'react';
import { Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const handleStarClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: (hoveredRating || rating) >= star ? '#FFD700' : '#C0C0C0',
          }}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(null)}
        >
          &#9733;
        </span>
      ))}
      <Typography variant="caption" color="textSecondary">
        {rating || hoveredRating ? `${rating || hoveredRating} stars` : 'No rating'}
      </Typography>
    </div>
  );
};

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [feedbackRating, setFeedbackRating] = useState(null);

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Your Recent Feedback
        </Typography>
        <Typography color={medium}>Give Feedback</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/Rating.webp"
        style={{ borderRadius: '0.75rem', margin: '0.75rem 0' }}
      />
      <StarRating rating={feedbackRating} onRatingChange={setFeedbackRating} />
      <FlexBetween>
        <Typography color={main}>FeedBack </Typography>
        <Typography color={medium}>https://police.rajasthan.gov.in/new/dashboard</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Your Feedback is valuable for Us.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
