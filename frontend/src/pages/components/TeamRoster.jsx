/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Card, Avatar, Typography, Button, Switch, Modal, Form, Input, message, Space } from "antd";
import { UserOutlined, PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { api } from "../../services/api";
import "../../css/TeamRoster.css";

const { Title, Text } = Typography;

export default function TeamRoster({ members, onRefresh }) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColor = (name) => {
    const colors = ["#5B8DEF", "#9B59B6", "#3498DB", "#1ABC9C", "#F39C12"];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.toggleActive(id);
      message.success(`Member ${currentStatus ? "deactivated" : "activated"} successfully`);
      onRefresh();
    } catch (error) {
      message.error("Failed to update member status");
    }
  };

  const handleAddMember = async (values) => {
    try {
      await api.addMember({
        name: values.name,
        email: values.email,
        isActive: true,
        sortOrder: parseInt(values.sortOrder),
      });
      message.success("Member added successfully");
      form.resetFields();
      setAddModalVisible(false);
      onRefresh();
    } catch (error) {
      message.error("Failed to add member");
    }
  };
  const activeMembers = members.filter((m) => m.isActive);
  const inactiveMembers = members.filter((m) => !m.isActive);

  return (
    <>
      <Card className='team-roster-card' variant='borderless'>
        <div className='team-roster-header'>
          <div>
            <Title level={5} style={{ margin: 0, display: "flex", alignItems: "center" }}>
              <UserOutlined style={{ marginRight: "8px" }} />
              Team Roster
            </Title>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Text type='secondary'>{activeMembers.length} active</Text>
            <Button type='primary' icon={<PlusOutlined />} size='small' onClick={() => setAddModalVisible(true)}>
              Add
            </Button>
          </div>
        </div>

        <div className='team-roster-list'>
          {activeMembers.map((member) => (
            <div key={member.id} className='team-roster-item'>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                <span style={{ color: "#0015" }}>{member.sortOrder}</span>
                <Avatar size={40} style={{ backgroundColor: getColor(member.name) }}>
                  {getInitials(member.name)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text strong style={{ display: "block" }}>
                    {member.name}
                  </Text>
                  <Text type='secondary' style={{ fontSize: "13px" }}>
                    {member.email}
                  </Text>
                </div>
                <Switch
                  checked={member.isActive}
                  onChange={() => handleToggleActive(member.id, member.isActive)}
                  size='small'
                />
              </div>
            </div>
          ))}
        </div>

        {inactiveMembers.length > 0 && (
          <>
            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <Text type='secondary' style={{ fontSize: "12px", fontWeight: "500" }}>
                ON LEAVE / INACTIVE
              </Text>
            </div>
            <div className='team-roster-list inactive'>
              {inactiveMembers.map((member) => (
                <div key={member.id} className='team-roster-item inactive'>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                    <Avatar size={40} style={{ backgroundColor: "#d9d9d9", color: "#8c8c8c" }}>
                      {getInitials(member.name)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text type='secondary' style={{ display: "block" }}>
                        {member.name}
                      </Text>
                      <Text type='secondary' style={{ fontSize: "13px" }}>
                        {member.email}
                      </Text>
                    </div>
                    <Switch
                      checked={member.isActive}
                      onChange={() => handleToggleActive(member.id, member.isActive)}
                      size='small'
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserAddOutlined style={{ marginRight: "8px", fontSize: "18px" }} />
            Add Team Member
          </div>
        }
        open={addModalVisible}
        onCancel={() => {
          form.resetFields();
          setAddModalVisible(false);
        }}
        footer={null}>
        <Form form={form} layout='vertical' onFinish={handleAddMember} style={{ marginTop: "16px" }}>
          <Form.Item
            label='Full Name'
            name='name'
            rules={[{ required: true, message: "Please enter member domain username" }]}>
            <Input placeholder='e.g., DELACJU' />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: "Please enter company email" },
              { type: "email", message: "Please enter a valid company email" },
            ]}>
            <Input placeholder='juan.delacruz@company.com' />
          </Form.Item>
          <Form.Item
            label='Rotation Order'
            name='sortOrder'
            initialValue={members.length + 1}
            rules={[{ required: true, message: "Please enter rotation order" }]}>
            <Input type='number' min={1} placeholder={`e.g., ${members.length + 1}`} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  form.resetFields();
                  setAddModalVisible(false);
                }}>
                Cancel
              </Button>
              <Button type='primary' htmlType='submit'>
                Add Member
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}