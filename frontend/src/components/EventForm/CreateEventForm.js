import EventForm from ".";

function CreateEventForm() {
    const event ={
        name: '',
        type: '',
        pri: '',
        price: '',
        startDate: '',
        endDate: '',
        imgUrl: '',
        description: ''
    }

    return (
        <EventForm event={event} formType="Create Event" />
    )
}

export default CreateEventForm
