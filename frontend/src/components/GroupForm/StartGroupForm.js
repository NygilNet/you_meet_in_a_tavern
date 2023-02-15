import GroupForm from "."

function StartGroupForm() {
    const group = {
        name: '',
        about: '',
        type: '',
        pri: null,
        location: '',
        previewImg: ''
    }

    return (
        <GroupForm group={group} formType="CREATE" />
    )
}

export default StartGroupForm
