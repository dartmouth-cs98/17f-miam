import axios from "axios";

const ROOT_URL = "https://miam98.herokuapp.com/api";
// const ROOT_URL = 'http://localhost:9090/api';

// export function getUserPosts(user_id, page, cb) {
//   // console.log('user id in user api call', user_id);
//   axios.get(`${ROOT_URL}/userPosts/${user_id}`, { params: { page }}).
//   then((response) => {
//     // console.log('posts for user', user_id, page, response);
//     cb(response.data, null);
//   }).catch((error) => {
//     // console.log('error in user posts', error.data);
//     cb(null, error);
//   })
// }
//
// export function createReport(report, cb) {
//   // { reporter, item, type, severity, additionalInfo }
//   // console.log(`report is ${JSON.stringify(report)}`);
//   axios.post(`${ROOT_URL}/report`, report)
//   .then((response) => {
//     // console.log(`Report created. ${response.data}`);
//     cb(response.data);
//   }).catch((error) => {
//     // console.log(`error creating posts. ${error}`);
//   });
// }

export function signUpUser(email, password, username, cb) {
  const params = {
    email: email.toLowerCase(),
    password: password,
    username: username,
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
  return new Promise((fulfill, reject) => {
    axios
      .put(signedRequest, file, { headers: { "Content-Type": file.type } })
      .then(response => {
        fulfill(url);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  return getSignedRequest(file).then(response => {
    return uploadFileToS3(response.data.signedRequest, file, response.data.url);
  });
}

export function createPost(postObj, token, cb) {
  const url = `${ROOT_URL}/posts`;
  console.log(postObj.imgURL);
  console.log(token);
  axios
    .post(
      url,
      { imgURL: postObj.imgURL, hashtags: postObj.hashtags },
      { headers: { Authorization: token } }
    )
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

export function getTargetUserProfile(username, token, cb) {
    axios
      .post(`${ROOT_URL}/users`, { query: username })
      .then(async response => {
        cb(response.data, null);
      })
      .catch(error => {
        cb(null, error);
      });
}

export function sendMessage(battleId, token, msg, cb) {
  const url = `${ROOT_URL}/battles/msg/${battleId}`;
  axios
    .put(url, { message: msg }, { headers: { Authorization: token } })
    .then(response => {
      cb(response, null);
    })
    .catch(error => {
      cb(null, error);
    });
}
