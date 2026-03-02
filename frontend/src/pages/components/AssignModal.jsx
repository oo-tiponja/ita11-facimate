import { Modal, Select } from "antd";
import { useState } from "react";

export default function AssignModal({ visible, ceremonyId, members, onAssign, onCancel }) {
  const [selectedMember, setSelectedMember] = useState(null);

  const handleOk = () => {
    if (selectedMember) {
      onAssign(ceremonyId, selectedMember);
      setSelectedMember(null);
    }
  };

  const handleCancel = () => {
    setSelectedMember(null);
    onCancel();
  };

  return (
    <Modal
      title='Assign Facilitator'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: !selectedMember }}>
      <Select
        style={{ width: "100%" }}
        placeholder='Select team member'
        value={selectedMember}
        onChange={setSelectedMember}
        options={members.map((m) => ({ label: m.name, value: m.id }))}
      />
    </Modal>
  );
}
