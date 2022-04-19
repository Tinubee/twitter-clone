import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "../fbase";

export default ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayname, setNewDisplayname] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayname(value);
  };

  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();

    console.log(nweets.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayname) {
      await userObj.updateProfile({
        displayName: newDisplayname,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayname}
        />
        <input type="submit" placeholder="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
