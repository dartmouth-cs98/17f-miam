import axios from "axios";

const ROOT_URL = "https://miam98.herokuapp.com/api";
// const ROOT_URL = 'http://localhost:9090/api';

export function signUpUser(email, password, username, pushToken, cb) {
  const params = {
    email: email.toLowerCase(),
    password: password,
    username: username,
    pushToken: pushToken
  };
  axios
    .post(ROOT_URL + "/users/signup", params)
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function uploadProfile(profileUrl, token, cb) {
  const url = `${ROOT_URL}/users`;
  axios
    .put(url, { profilePic: profileUrl }, { headers: { Authorization: token } })
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function uploadBackground(backgroundUrl, token, cb) {
  const url = `${ROOT_URL}/users`;
  axios
    .put(
      url,
      { backgroundPic: backgroundUrl },
      { headers: { Authorization: token } }
    )
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function followUser(newFollower, token, cb) {
  const url = `${ROOT_URL}/users/follow`;
  axios
    .put(
      url,
      { followedUserId: newFollower },
      { headers: { Authorization: token } }
    )
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function unFollowUser(lostFollower, token, cb) {
  const url = `${ROOT_URL}/users/follow`;
  axios
    .delete(
      url,
      { headers: { Authorization: token },
        data: {unfollowedUserId: lostFollower}
      }
    )
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function saveExistingMeme(memeId, token, cb) {
  const url = `${ROOT_URL}/users/save-existing-meme`;
  axios
    .put(url, { memeId: memeId }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function saveNewMeme(meme, token, cb) {
  const url = `${ROOT_URL}/users/save-new-meme`;
  axios
    .post(url, { meme: meme }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function signInUser(email, password, cb) {
  const params = {
    email: email.toLowerCase(),
    password: password
  };
  axios
    .post(ROOT_URL + "/users/signin", params)
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

function getSignedRequest(file) {
  const fileName = encodeURIComponent(file.name);
  // hit our own server to get a signed s3 url
  return axios.get(
    `${ROOT_URL}/sign-s3?file-name=${fileName}&file-type=${file.type}`
  );
}

function uploadFileToS3(signedRequest, file, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve({
            status: 200,
            url: url
          });
        } else {
          reject({
            status: 401,
            msg: "Could not upload image"
          });
        }
      }
    };
    xhr.send(file);
  });
}

export function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  return getSignedRequest(file).then(response => {
    return uploadFileToS3(response.data.signedRequest, file, response.data.url);
  });
}

export function createBattle(theme, token, cb) {
  const url = `${ROOT_URL}/battles`;
  axios
    .post(url, { theme }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function createPost(postObj, token, cb) {
  const url = `${ROOT_URL}/posts`;
  axios
    .post(url, postObj, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function fetchPosts(cb) {
  axios
    .get(`${ROOT_URL}/posts/`)
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      console.log(error.response);
    });
}

export function fetchSinglePost(postID, cb) {
  axios
    .get(`${ROOT_URL}/posts/${postID}`)
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      console.log(error.response);
    });
}

export function deletePost(postID, token, cb) {
  const url = `${ROOT_URL}/posts/${postID}`;
  axios
    .delete(url, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function fetchBattles(cb) {
  axios
    .get(`${ROOT_URL}/battles/`)
    .then(response => {
      cb(response.data, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function fetchMyBattles(token, cb) {
  axios
    .get(`${ROOT_URL}/user-battles`, { headers: { Authorization: token } })
    .then(response => {
      cb(response.data, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getBattle(battleId, cb) {
  axios
    .get(`${ROOT_URL}/battles/${battleId}`)
    .then(response => {
      cb(response.data, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getUserProfile(token, cb) {
  axios
    .get(`${ROOT_URL}/users`, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getUserNotification(token, cb) {
  axios
    .get(`${ROOT_URL}/user-notifs`, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getUserSavedMemes(token, cb) {
  axios
    .get(`${ROOT_URL}/user-memes`, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getUserProfileFromID(userID, cb) {
  axios
    .get(`${ROOT_URL}/users/${userID}`)
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function getTargetUserProfile(username, cb) {
  axios
    .post(`${ROOT_URL}/users`, { query: username })
    .then(async response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function sendMessage(battleId, token, msg, cb) {
  const url = `${ROOT_URL}/battles/msg/${battleId}`;
  axios
    .put(url, msg, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function postComment(postID, comment, token, cb) {
  const url = `${ROOT_URL}/posts/comments`;
  axios
    .post(
      url,
      { postID: postID, commenttext: comment },
      { headers: { Authorization: token } }
    )
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function fetchComment(commentID, cb) {
  const url = `${ROOT_URL}/posts/comments/${commentID}`;
  axios
    .get(url)
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function likePost(postID, action, token, cb) {
  const url = `${ROOT_URL}/posts/${postID}`;
  axios
    .put(url, { action: action }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function likeMeme(msgID, action, token, cb) {
  const url = `${ROOT_URL}/battles/like-msg/${msgID}`;
  axios
    .put(url, { action: action }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

export function followBattle(battleId, token, cb) {
  const url = `${ROOT_URL}/battles/follow/${battleId}`;
  axios
    .put(url, {}, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}
