import { csrfFetch } from "./csrf";

const RESTORE_GROUP = 'groups/restoreGroup';
const SET_GROUP = 'groups/setGroup';
const GET_GROUP = 'groups/getGroup';
const REMOVE_GROUP = 'groups/removeGroup';
const CLEAR_GROUP = 'groups/clearGroup';

const restoreGroup = (groups) => {
    return {
        type: RESTORE_GROUP,
        payload: groups
    };
};

const setGroup = (group) => {
    return {
        type: SET_GROUP,
        payload: group
    };
};

const getGroup = (group) => {
    return {
        type: GET_GROUP,
        payload: group
    };
};


const removeGroup = (id) => {
    return {
        type: REMOVE_GROUP,
        payload: id
    };
};

const clearGroup = () => {
    return {
        type: CLEAR_GROUP
    };
};

const normalizeData = (array) => {
    const obj = {};
    array.forEach(o => obj[o.id] = o);
    return obj;
}

export const restoreGroups = () => async (dispatch) => {
    const response = await csrfFetch(`/api/groups`);
    const data = await response.json();

    const normalizeGroups = normalizeData(data);

    dispatch(restoreGroup(normalizeGroups))
}

export const deleteGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeGroup(id))
    };
};

export const newGroup = (group) => async (dispatch) => {
    const { name, about, type, pri, city, state, previewImg } = group
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
        body: JSON.stringify({
            name,
            about,
            type,
            private: !!pri,
            city,
            state
        })
    })
    const data = await response.json();

    if (previewImg) {

        const imgResponse = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: previewImg,
                preview: true
            })
        });

        data.previewImage = previewImg;
    } else {
        data.previewImage = 'no preview image provided';
    }

    dispatch(setGroup(data));
    return data.id;
}

export const editGroup = (id, group) => async (dispatch) => {
    const { name, about, type, pri, city, state, numMembers, previewImg } = group
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            name,
            about,
            type,
            private: pri,
            city,
            state
        })
    })
    const data = await response.json();

    data.numMembers = numMembers;

    if (previewImg) {

        const imgResponse = await csrfFetch(`/api/groups/${data.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: previewImg,
                preview: true
            })
        });

        data.previewImage = previewImg;
    } else {
        data.previewImage = 'no preview image provided';
    }

    return dispatch(setGroup(data))
}

export const getSingleGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getGroup(data));
    }
}

export const resetGroup = () => async (dispatch) => {
    dispatch(clearGroup());
}


const allGroups = {};
const normalizeAllGroups = async () => {
    const obj = {};
    const response = await csrfFetch(`api/groups`);
    const data = await response.json();

    data.forEach(o => allGroups[o.id] = o);
    return obj;
}
normalizeAllGroups();

const initialState = { allGroups, singleGroup: {} }

const groupReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case CLEAR_GROUP:
            newState = {...state};
            delete newState.singleGroup;
            return newState;
        case RESTORE_GROUP:
            newState = {...state};
            newState.allGroups = action.payload;
            return newState;
        case SET_GROUP:
            newState = {...state};
            let newAllGroups = { ...newState.allGroups}
            newAllGroups[action.payload.id] = action.payload;
            newState.allGroups = newAllGroups;
            return newState;
            // return {...state, allGroups: {...state.allGroups, [action.payload.id]: action.payload } };
        case REMOVE_GROUP:
            newState = {...state};
            delete newState.allGroups[action.payload];
            return newState;
        case GET_GROUP:
            return {...state, singleGroup: action.payload}
        default:
            return state;
    }
}

export default groupReducer;
