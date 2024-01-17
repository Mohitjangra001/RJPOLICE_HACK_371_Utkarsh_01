import React, { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  AddOutlined,
  CloseOutlined,
  RadioButtonUncheckedOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { AiOutlineTags } from "react-icons/ai";
import { toast, ToastContainer } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showPollOptions, setShowPollOptions] = useState(false);

  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const sensitiveWords = ["Fuck", "Sex"]; // Define your sensitive words


  const handlePost = async () => {

    // Check for sensitive words
    const containsSensitiveWord = sensitiveWords.some(word => post.toLowerCase().includes(word.toLowerCase()));

    if (containsSensitiveWord) {
      // Display a pop-up message for sensitive words
      toast.error("Sensitive words cannot be posted!", {
        position: "top-right",
        autoClose: 3000, // Close the pop-up after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);

    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }

    if (showPollOptions) {
      formData.append("pollQuestion", pollQuestion);
      formData.append("pollOptions", JSON.stringify(pollOptions));
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowPollOptions(false);
    } else {
      console.error("Error posting the poll");
      // Handle error, e.g., show an error message to the user
    }
  };

  const TagsIcon = (props) => <AiOutlineTags {...props} />;

  const handleAddOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = pollOptions.filter((_, i) => i !== index);
    setPollOptions(updatedOptions);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const renderPollOptions = () => {
    return pollOptions.map((option, index) => (
      <FlexBetween key={index} mt="1rem">
        <InputBase
          placeholder={`Option ${index + 1}`}
          onChange={(e) => handlePollOptionChange(index, e.target.value)}
          value={option}
          sx={{
            width: "85%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "0.75rem 1.5rem",
          }}
        />
        <IconButton onClick={() => handleRemoveOption(index)}>
          <CloseOutlined />
        </IconButton>
      </FlexBetween>
    ));
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's is your recommendation..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton onClick={() => setImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <Typography color={mediumMain}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TagsIcon sx={{ marginRight: "0.5rem", color: mediumMain }} />
                  Tags
                </Box>
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <FlexBetween mt="1rem">
          <Typography
            onClick={() => setShowPollOptions(!showPollOptions)}
            color={showPollOptions ? palette.primary.main : mediumMain}
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <RadioButtonUncheckedOutlined sx={{ color: mediumMain }} />
            Poll
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post || (showPollOptions && pollOptions.length < 2)}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>

      {showPollOptions && (
        <>
          <InputBase
            placeholder="Enter your poll question..."
            onChange={(e) => setPollQuestion(e.target.value)}
            value={pollQuestion}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
              marginTop: "1rem",
            }}
          />
          {renderPollOptions()}
          <FlexBetween mt="1rem">
            <IconButton onClick={handleAddOption}>
              <AddOutlined />
            </IconButton>
            <Typography
              onClick={() => setShowPollOptions(false)}
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer" } }}
            >
              Cancel
            </Typography>
          </FlexBetween>
        </>
      )}
    </WidgetWrapper>
  );
};

export default MyPostWidget;
