export default deleteScene = (sceneId) => {
  const serverAdr = 'http://api.nowandthen.io';

  return fetch(serverAdr + '/scenes/delete/' + sceneId, {
    headers: {
      'Accept': 'application/json',
    },
    method: 'post'
  }).then((response) => response.json())
  .then((responseJson) => {
    return responseJson;
  });
}