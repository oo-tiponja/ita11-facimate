import { Card, Badge, Typography, Button } from "antd";
import { EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import "../../css/MeetingRooms.css";

const { Title, Text } = Typography;

export default function MeetingRooms() {
  const rooms = [
    {
      name: "MNL-3 WESTERNLANDS Room",
      status: "available",
    },
    {
      name: "MNL-3 CROWNLANDS Room",
      status: "busy",
    },
    {
      name: "MNL-3 STORMLANDS Room",
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

  const openOutlookEvent = () => {
    const body = encodeURIComponent("Scheduled via FaciMate");
    const start = "20260214T090000";
    const end = "20260214T100000";

    const url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=&body=${body}&startdt=${start}&enddt=${end}`;

    window.open(url, "_blank");
  };


  return (
    <Card className='meeting-rooms-card' variant='borderless'>
      <div className='meeting-rooms-header' style={{display: 'flex', justifyContent: 'space-between'}}>
        <Title level={5} style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <EnvironmentOutlined style={{ marginRight: "8px" }} />
          Meeting Rooms
        </Title>
        <Button type='link' icon={<CalendarOutlined />} onClick={() => openOutlookEvent({rooms: rooms.map(r => r.name).join(", ")})}>
          Schedule in Outlook
        </Button>
      </div>

      <div className='meeting-rooms-list'>
        {rooms.map((room, index) => (
          <div key={index} className='meeting-room-item'>
            <div className='meeting-room-row' style={{paddingLeft: '20px'}}>
              <div className='meeting-room-left'>
                <Badge status={getStatusColor(room.status)} />
                <Text strong>{room.name}</Text>
              </div>

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
