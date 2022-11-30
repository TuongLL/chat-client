import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import debounce from "lodash/debounce";
import axios from "axios";
import { io } from "socket.io-client";
import { searchUser, host, allUsersRoute } from "../utils/APIRoutes";
import Logout from "./Logout";
export default function Contacts({
  contacts,
  changeChat,
  setContacts,
  currentUserId,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentUserIdLocalStorage, setCurrentUserIdLocalStorage] =
    useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const socket = useRef();
  useEffect(async () => {
    socket.current = io(host);
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data?.username ?? "");
    setCurrentUserImage(data.avatarImage);
    setCurrentUserIdLocalStorage(data._id);
  }, []);
  useEffect(() => {
    socket.current.on("set-status", async (id) => {
      console.log(555, currentUserIdLocalStorage, id);
      const data = await axios.get(
        `${allUsersRoute}/${currentUserIdLocalStorage}`
      );
      setContacts(data.data);
    });
  }, [contacts]);
  const changeCurrentChat = async (index, contact) => {
    setCurrentSelected(index);
    const data = await axios.post(`${searchUser}`, {
      username: contact.username,
    });
    changeChat(data.data[0]);
  };
  const searchContact = async (e) => {
    const username = e.target.value;
    const data = await axios.post(`${searchUser}`, {
      username,
      id: currentUserId,
    });
    console.log("search..", data);
    setContacts(data.data);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>BKPY</h3>
          </div>
          <div className="search">
            <input
              type="text"
              placeholder="Search username..."
              onChange={debounce(searchContact, 300)}
            />
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                    <div className={`${contact.status}`}>{contact.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
              <div className="username">
                <h2>{currentUserName}</h2>
              </div>
            </div>
            <div className="logout-btn">
              <Logout />
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 10% 70% 10%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 4rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .search {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100px;
    input {
      width: 90%;
      padding: 0.5rem;
      border: none;
      outline: none;
      border-radius: 0.2rem;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 3.4rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0 1rem 0 1rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 2.5rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
        .offline {
          color: #cc3300;
        }
        .online {
          color: #00b200;
        }
      }
    }
    .selected {
      background-color: #5e3719;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:10px 20px;    
    .avatar {
      display: flex;
      align-items: center;
      gap: 12px;
      img {
        height: 2.5rem;
        max-inline-size: 100%;
    }
    }
    .username {
      h2 {
        color: white;
        font-size: 2rem;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
