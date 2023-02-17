import { csrfFetch } from "./csrf";

const RESTORE_EVENT = 'events/restoreEvent'
const SET_EVENT = 'events/setEvent';
const GET_EVENT = 'events/getEvent';
const REMOVE_EVENT = 'events/removeEvent';

const restoreEvent = (events) => {
    return {
        type: RESTORE_EVENT,
        payload: events
    };
};

const setEvent = (event) => {
    return {
        type: SET_EVENT,
        payload: event
    }
}

const getEvent = (event) => {
    return {
        type: GET_EVENT,
        payload: event
    };
};

const removeEvent = (id) => {
    return {
        type: REMOVE_EVENT,
        payload: id
    }
};

const normalizeData = (array) => {
    const obj = {};
    array.forEach(o => obj[o.id] = o);
    return obj
}

export const restoreEvents = () => async (dispatch) => {
    const response = await csrfFetch(`/api/events`);
    const data = await response.json();

    const normalizeEvents = normalizeData(data.Events);

    dispatch(restoreEvent(normalizeEvents));
}

export const deleteEvent = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(removeEvent(id))
    };
};

export const newEvent = (id, event) => async (dispatch) => {
    const { name, type, price, startDate, endDate, description, imgUrl } = event;
    const response = await csrfFetch(`/api/groups/${id}/events`, {
        method: 'POST',
        body: JSON.stringify({
            name,
            type,
            price,
            description,
            startDate,
            endDate
        })
    })
    const data = await response.json();

    if (imgUrl) {

        const imgResponse = await csrfFetch(`/api/events/${data.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: imgUrl,
                preview: true
            })
        })
        data.previewImage = imgUrl;
    } else {
        data.previewImage = 'no preview image provided';
    }

    dispatch(setEvent((data)));
    return data.id
}


export const getSingleEvent = (id) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${id}`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getEvent(data));
    }
}

const allEvents = {};
const normalizeAllEvents = async () => {
    const obj = {};
    const response = await csrfFetch(`api/events`);
    const data = await response.json();

    data.Events.forEach(o => allEvents[o.id] = o);
    return obj;
}
normalizeAllEvents();

const initialState = { allEvents, singleEvent: {} };

const eventReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case RESTORE_EVENT:
            newState = {...state};
            newState.allEvents = action.payload;
            return newState;
        case SET_EVENT:
            newState = {...state};
            let newAllEvents = {...newState.allEvents};
            newAllEvents[action.payload.id] = action.payload;
            newState.allEvents = newAllEvents;
            return newState;
        case REMOVE_EVENT:
            newState = {...state};
            delete newState.allEvents[action.payload];
            return newState;
        case GET_EVENT:
                return {...state, singleEvent: action.payload };
        default:
            return state;
    }
}

export default eventReducer;
