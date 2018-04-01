export default postScene = (images, sceneId, time) => {
  const serverAdr = 'http://192.168.23.72:3000';
  const data = new FormData();

  data.append('time', time);

  images.forEach((image, index) => {
      data.append('photo', {
      uri: image.url,
      type: 'image/jpeg', // or photo.type
      name: image.id + '.jpeg'
    });  
  });
  
  return fetch(serverAdr + '/scenes/create/' + sceneId, {
    headers: {
      'Accept': 'application/json',
    },
    method: 'post',
    body: data
  }).then((response) => response.json())
  .then((responseJson) => {
    return responseJson;
  })
}