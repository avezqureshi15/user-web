import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 400; /* Regular */
    src: url("./assets/fonts/OpenSans-Regular.ttf") format("truetype");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 600; /* SemiBold */
    src: url("./assets/fonts/OpenSans-SemiBold.ttf") format("truetype");
  }

  @font-face {
    font-family: "OpenSans";
    font-style: normal;
    font-weight: 800; /* ExtraBold */
    src: url("./assets/fonts/OpenSans-ExtraBold.ttf") format("truetype");
  }

  html, body, p, h1,h2, h3, button, input {
    font-family: "OpenSans", sans-serif;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
`;

export const ViewContainer = styled("div")`
  border-radius: 12px;
  padding: 24px;
  background: white;
  color: black;
  height: 100%;
  min-height: 700px;
  width: 430px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;
`;

export const CrossButton = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;

  & img {
    width: 20px;
    height: 20px;
  }
`;

export const ViewHead = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 20px;

  > div:nth-of-type(1) {
    display: flex;
    gap: 20px;
    align-items: center;
  }
`;

export const ViewDetails = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 12px;
  padding: 12px;
  background: #f7f8fb;
  box-sizing: border-box;

  > div:nth-of-type(1) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }

  > p {
    > span {
      font-weight: 600;
    }
    &:nth-of-type(4) {
      font-size: 12px;
    }
  }
`;

export const LoaderContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

interface StatusButtonProps {
  isResolved: boolean;
}

export const StatusButton = styled("button")<StatusButtonProps>`
  width: 110px;
  height: 35px;
  background-color: ${(props) => (props.isResolved ? "#00A652" : "#F58220")};
  color: white;
  border: none;
  border-radius: 10px;
  flex-shrink: 0;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: capitalize;
`;

export const AttachmentFile = styled("button")`
  width: 138px;
  height: 48px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  flex-shrink: 0;
  cursor: pointer;

  > span {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const MenuContainer = styled("div")`
  position: relative;
`;

export const ViewMenu = styled("div")`
  width: 200px;
  position: absolute;
  z-index: 9999;
  top: 40px;
  left: 0;
  border: 1px solid lightgray;
  border-radius: 12px;

  > button {
    width: 100%;
    background-color: white;
    height: 40px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
`;

export const ResolveButton = styled("button")`
  background: white;
  width: 100px;
  border: 1px solid lightgray;
  height: 30px;
  border-radius: 12px;
`;
