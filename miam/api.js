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

export function signUpUser(email, password, cb) {
  const params = {
    email: email.toLowerCase(),
    password: password
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

export function createPost(postObj, cb) {
  const params = {
    postObj: postObj
  };
  axios
    .post(ROOT_URL + "/post", params)
    .then(async response => {
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

export function getUserProfile(cb) {
  axios
    .get(`${ROOT_URL}/users`)
    .then(response => {
      cb(response.data, null);
    })
    .catch(error => {
      cb(null, error);
    });
}

// export function searchPosts(long, lat, tags, page, user, cb) {
//   // console.log('search posts lat:', lat, 'long:', long);
//   axios.get(`${ROOT_URL}/search/`, { params: { long, lat, tags, page, user } }).
//   then((response) => {
//     // console.log(response, null);
//     cb(response.data);
//   }).catch((error) => {
//     // console.log(error);
//     // console.log('error searching posts');
//     cb(null, error);
//   })
// }
//
// export function createPost(post, cb) {
//   // console.log(`post is ${JSON.stringify(post)}`);
//   axios.post(`${ROOT_URL}/posts/`, post).
//   then((response) => {
//     // console.log(`Post created. ${response.data}`);
//     cb(response.data);
//   }).catch((error) => {
//     // console.log(`error creating posts. ${error}`);
//   });
// }
//
// export function getPost(post_id, user, cb) {
//   const url = `${ROOT_URL}/posts/${post_id}`;
//   axios.get(url, {params: {post_id, user}}).
//   then((response) => {
//     // console.log(response.data);
//     cb(response.data, null);
//   }).catch((error) => {
//     // console.log(error);
//     cb(null, error);
//   });
// }
//
// export function deletePost(post_id, cb) {
//   const url = `${ROOT_URL}/posts/${post_id}`;
//   axios.delete(url, {params: {post_id}}).
//   then((response) => {
//     // console.log(response.data);
//     cb(response.data);
//   }).catch((error) => {
//     // console.log(error);
//   });
// }
//
// export function editPost(postId, fields, action, cb) {
//   const url = `${ROOT_URL}/posts/${postId}`;
//   let params;
//   if (action == 'CREATE_COMMENT') {
//     params = {
//       comment: fields.comment,
//       user: fields.user,
//       action,
//     }
//   } else if (action == 'DOWNVOTE_COMMENT') {
//     params = {
//       commentId: fields.commentId,
//       user: fields.user,
//       action,
//     }
//   } else if (action == 'UPVOTE_COMMENT') {
//     params = {
//       commentId: fields.commentId,
//       user: fields.user,
//       action,
//     }
//   } else if (action == 'DELETE_COMMENT') {
//     params = {
//       commentId: fields.commentId,
//       action,
//     }
//   } else {
//     params = {
//       user: fields.user,
//       action
//     }
//   }
//
//   axios.put(url, params).
//   then((response) => {
//
//     cb(response.data, null);
//   }).catch((error) => {
//     cb(null, error);
//   });
// }
//
// export function getTrendingTags(long, lat, cb) {
//   // console.log('getting trending');
//   axios.get(`${ROOT_URL}/tags/`, { params: { long, lat } }).
//   then((response) => {
//     // console.log(response);
//     cb(response.data)
//   })
// }
