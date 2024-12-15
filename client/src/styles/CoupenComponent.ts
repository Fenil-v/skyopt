import { styled, keyframes } from "@mui/system";
import { Box, Button, IconButton, Modal } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Styled Components
export const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

export const ModalContent = styled(Box)`
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 32px;
  outline: none;
  max-width: 400px;
  width: 90%;
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: #666;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const CouponBox = styled(Box)`
  background: linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%);
  padding: 24px;
  border-radius: 12px;
  margin: 24px 0;
  position: relative;
  border: 2px dashed #ccd6e0;
  text-align: center;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  &::before {
    left: -10px;
  }

  &::after {
    right: -10px;
  }
`;

export const CopyButton = styled(Button)`
  background-color: #4285f4;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-transform: none;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
  &:hover {
    background-color: #3367d6;
    box-shadow: 0 6px 16px rgba(66, 133, 244, 0.3);
  }
`;

export const IconWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

export const StyledOfferIcon = styled(LocalOfferIcon)`
  font-size: 48px;
  color: #4285f4;
`;

export const LoadingBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;