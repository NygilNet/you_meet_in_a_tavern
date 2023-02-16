import GroupForm from ".";
import { useSelector } from "react-redux";

function UpdateGroupForm() {

    const group = {...useSelector(state => state.groups.singleGroup)};
    console.log(group)
    const toUpdate = {
        name: group.name,
        about: group.about,
        type: group.type,
        location: `${group.city}, ${group.state}`,
        pri: group.private
    }
    toUpdate.previewImg = group.GroupImages.find(img => img.preview) || '';

    return (
        <GroupForm group={toUpdate} formType="Update group" />
    )
}

export default UpdateGroupForm;
