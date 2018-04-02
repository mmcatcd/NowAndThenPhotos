import { combineReducers } from 'redux';

import { CREATE_SCENE, CREATE_PHOTO, ADD_LOCATION, DELETE_PHOTO, ADD_VIDEO } from "../actions/"

const uuidv1 = require('uuid/v1');

let initialState = {
  scenes: {},
  photos: {},
  loading: true
};

const sceneReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SCENE:
            scene = { id: uuidv1(), name: action.name, location: {}, photoIds: [], video: null, date: action.date }
            state = {
                ...state,
                scenes: {...state.scenes, [scene.id]: scene},
                loading: false
            }
            return state;
        case CREATE_PHOTO:
            photo = { id: uuidv1(), url: action.url }
            updatedPhotoIds = [...state.scenes[action.sceneId].photoIds, photo.id]
            updatedScene = {...state.scenes[action.sceneId], photoIds: updatedPhotoIds}
            state = {
                ...state,
                photos: {...state.photos, [photo.id]: photo},
                scenes: {...state.scenes, [action.sceneId]: updatedScene}
            }
            return state;
        case DELETE_PHOTO:
            scenePhotos = [...state.scenes[action.sceneId].photoIds];
            updatedPhotoIds = scenePhotos.filter(item => item !== action.photoId);
            updatedScene = {...state.scenes[action.sceneId], photoIds: updatedPhotoIds};

            photos = {...state.photos};
            delete photos[action.photoId];
            
            state = {
                ...state,
                scenes: {...state.scenes, [action.sceneId]: updatedScene},
                photos: photos
            }

            return state;
        case ADD_LOCATION:
            state = {
                ...state,
                scenes: {
                    ...state.scenes,
                    [action.sceneId]: {
                        ...state.scenes[action.sceneId],
                        location: action.location
                    }
                }
            }

            return state;
        case ADD_VIDEO:
            state = {
                ...state,
                scenes: {
                    ...state.scenes,
                    [action.sceneId]: {
                        ...state.scenes[action.sceneId],
                        video: action.video
                    }
                }
            }
            return state;
        default:
            return state;
    }
};


// Combine all the reducers
const rootReducer = combineReducers({
    sceneReducer
})

export default rootReducer;
