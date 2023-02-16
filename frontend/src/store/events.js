import { csrfFetch } from "./csrf";

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
    switch(action.type) {
        default:
            return state;
    }
}

export default eventReducer;
