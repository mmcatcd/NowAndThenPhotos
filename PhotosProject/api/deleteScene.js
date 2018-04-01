export default deleteScene = (sceneId) => {
  const serverAdr = 'http://192.168.23.72:3000';

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