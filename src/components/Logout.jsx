import React, {useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import { logoutRoute, updateStatus, host } from "../utils/APIRoutes";
export default function Logout() {
  const navigate = useNavigate();
  const socket = useRef;
  useEffect(() => {
    socket.cureent = io(host);
  }, [])
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      await axios.post(updateStatus, {
        id,
        status: "offline",
      });
      socket.cureent.emit("update-status", id);
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
