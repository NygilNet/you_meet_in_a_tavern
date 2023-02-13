import { csrfFetch } from "./csrf";

const SET_GROUP = 'groups/setGroup';
const GET_GROUP = 'groups/getGroup';
const REMOVE_GROUP = 'groups/removeGroup';

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

export const deleteGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeGroup(id))
    };
};

export const newGroup = (group) => async (dispatch) => {
    const { name, about, type, pri, city, state } = group
    const response = await csrfFetch(`/api/groups`, {
        method: 'POST',
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
    dispatch(setGroup(data))
}

export const getSingleGroup = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getGroup(data));
    }
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
        case SET_GROUP:
            return {...state, allGroups: {...state[allGroups], [action.payload.id]: action.payload } };
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
