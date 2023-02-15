import GroupForm from "."

function StartGroupForm() {
    const group = {
        name: '',
        about: '',
        type: '',
        pri: '',
        location: '',
        previewImg: ''
    }

    return (
        <GroupForm group={group} formType="Create group" />
    )
}

export default StartGroupForm
