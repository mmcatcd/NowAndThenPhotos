export const CREATE_SCENE = 'CREATE_SCENE'


export const createScene = (name) => dispatch => {
  dispatch({
    type: CREATE_SCENE,
    name
  })
}


export const CREATE_PHOTO = 'CREATE_PHOTO'

export const createPhoto = (url, sceneId) => dispatch => {
  dispatch({
    type: CREATE_PHOTO,
    url,
    sceneId
  })
}
