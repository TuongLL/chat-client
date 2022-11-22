import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import debounce from "lodash/debounce";
import axios from "axios";
import { searchUser } from "../utils/APIRoutes";
export default function Contacts({
  contacts,
  changeChat,
  setContacts,
  currentUserId,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    setInterval(async () => {
      const data = await axios.post(`${searchUser}`, {
        username: contact.username
      });
      changeChat(data.data[0]);
    }, 2000);
  };
  const searchContact = async (e) => {
    const username = e.target.value;
    const data = await axios.post(`${searchUser}`, {
      username,
      id: currentUserId,
    });
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
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
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
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 2.5rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
        font-size: 1.2rem;
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
