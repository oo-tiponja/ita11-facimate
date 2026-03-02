import { Card, Badge, Typography, Button } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import "../../css/MeetingRooms.css";

const { Title, Text } = Typography;

export default function MeetingRooms() {
  const rooms = [
    {
      name: "Westernlands",
      status: "available",
    },
    {
      name: "Crownlands",
      status: "busy",
    },
    {
      name: "Stormlands",
      status: "upcoming",
    },
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      available: "success",
      busy: "error",
      upcoming: "warning",
    };
    return statusMap[status] || "default";
  };

  const openOutlookEvent = (roomName) => {
    const subject = encodeURIComponent("Meeting in " + roomName);
    const body = encodeURIComponent("Meeting scheduled via FaciMate.");
    const start = "20260214T090000";
    const end = "20260214T100000";

    const url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&body=${body}&startdt=${start}&enddt=${end}`;

    window.open(url, "_blank");
  };


  return (
    <Card className='meeting-rooms-card' variant='borderless'>
      <Title level={5} style={{ margin: 0, marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <EnvironmentOutlined style={{ marginRight: "8px" }} />
        Meeting Rooms
      </Title>
      {/* with outlook button */}
      <div className='meeting-rooms-list'>
        {rooms.map((room, index) => (
          <div key={index} className='meeting-room-item'>
            <div className='meeting-room-row'>
              <div className='meeting-room-left'>
                <Badge status={getStatusColor(room.status)} />
                <Text strong>{room.name}</Text>
              </div>

              <Button
                size='small'
                type='default'
                icon={<CalendarOutlined />}
                onClick={() => openOutlookEvent(room.name)}>
                Add Event
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Text type='secondary' style={{ fontSize: "12px", fontStyle: "italic", display: "block", marginTop: "12px" }}>
        Room data synced from Outlook calendars
      </Text>
    </Card>
  );
}
