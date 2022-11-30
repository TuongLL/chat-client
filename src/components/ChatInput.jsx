import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { BiFile } from "react-icons/bi";
import { storage } from "../base";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { uploadFileRoute } from "../utils/APIRoutes";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [typeMsg, setTypeMsg] = useState("text");
  const [urlMsg, setUrlMsg] = useState({
    webContentLink: "",
    webViewLink: "",
    thumbnailLink: "",
  });
  const [disableBtn, setDisableBtn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      if (typeMsg == "file") {
        handleSendMsg(urlMsg, typeMsg);
      } else handleSendMsg(msg, typeMsg);
      setMsg("");
    }
  };
  const sendFile = async (e) => {
    setMsg(e.target.files[0].name);
    setDisableBtn(true);
    console.log("send file....");
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    let formData = new FormData();
    formData.append("file", file.data);
    const fileUpload = await axios.post(uploadFileRoute, formData);
    // const storageRef = ref(storage, file.name);
    setTypeMsg("file");
    setUrlMsg(fileUpload.data);
    setDisableBtn(false);

    // uploadBytes(storageRef, file).then((snapshot) => {
    //   console.log("Uploaded a blob or file!", snapshot.metadata.fullPath);
    // }).then( () => {
    //   getDownloadURL(storageRef).then((url) => {
    //     console.log(url);
    //     setUrlMsg(url);
    //   }).catch(err => console.log(err));
    // });
    console.log("finish");
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <div className="file">
          <div className="image-upload">
            <label htmlFor="file-input">
              <BiFile size={30} cursor="pointer" />
            </label>
            <input id="file-input" type="file" onChange={sendFile} />
          </div>
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => {
            setMsg(e.target.value);
            setTypeMsg("text");
          }}
          value={msg}
        />

        <button className="btn" type="submit" disabled={disableBtn}>
          {disableBtn == false ? <IoMdSend /> : <Loading />}
        </button>
      </form>
    </Container>
  );
}

const Loading = () => {
  return (
    <LoadingContainer>
      <div className="inner one"></div>
      <div className="inner two"></div>
      <div className="inner three"></div>
    </LoadingContainer>
  );
};
const LoadingContainer = styled.div`
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  perspective: 800px;
  .inner {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .inner.one {
    left: 0%;
    top: 0%;
    animation: rotate-one 1s linear infinite;
    border-bottom: 3px solid #efeffa;
  }

  .inner.two {
    right: 0%;
    top: 0%;
    animation: rotate-two 1s linear infinite;
    border-right: 3px solid #efeffa;
  }

  .inner.three {
    right: 0%;
    bottom: 0%;
    animation: rotate-three 1s linear infinite;
    border-top: 3px solid #efeffa;
  }

  @keyframes rotate-one {
    0% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
    }
  }

  @keyframes rotate-two {
    0% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
    }
  }

  @keyframes rotate-three {
    0% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
    }
  }
`;
const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10% 90%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .image-upload > input {
    display: none;
  }
  button {
    height:50px;
    width: 100px;
    cursor: pointer;
    position: relative;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
