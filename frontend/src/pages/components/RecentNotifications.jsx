import { Card, Typography, Tag, Empty } from "antd";
import { BellOutlined, MessageOutlined, MailOutlined, ScheduleOutlined } from "@ant-design/icons";
import "../../css/RecentNotifications.css";

const { Title, Text } = Typography;

export default function RecentNotifications() {
  const notifications = [
    {
      id: 1,
      type: "message",
      title: "You are the facilitator for today's Daily Standup at 10:00 AM.",
      ceremony: "Daily Standup",
      ceremonyColor: "cyan",
      sender: "Sarah Chen",
      time: "about 1 year ago",
    },
    {
      id: 2,
      type: "email",
      title: "IPM is scheduled for Monday. Available rooms: Westernlands.",
      ceremony: "IPM",
      ceremonyColor: "blue",
      sender: "Marcus Johnson",
      time: "about 1 year ago",
    },
    {
      id: 3,
      type: "message",
      title: "Retro is today at 3:00 PM. You are the facilitator.",
      ceremony: "Retrospective",
      ceremonyColor: "orange",
      sender: "David Kim",
      time: "about 1 year ago",
    },
  ];

  const getIcon = (type) => {
    return type === "email" ? <MailOutlined /> : <MessageOutlined />;
  };

  return (
    <>
      <Card className='notifications-card' variant='borderless'>
        <Title level={5} style={{ margin: 0, marginBottom: "16px", display: "flex", alignItems: "center" }}>
          <BellOutlined style={{ marginRight: "8px" }} />
          Recent Notifications
        </Title>

        {notifications.length > 0 ? (
          <div className='notifications-list'>
            {notifications.map((notification) => (
              <div key={notification.id} className='notification-item'>
                <div className='notification-icon'>{getIcon(notification.type)}</div>
                <div className='notification-content'>
                  <Text style={{ fontSize: "14px", display: "block", marginBottom: "8px" }}>{notification.title}</Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <Tag color={notification.ceremonyColor} style={{ margin: 0, fontSize: "11px" }}>
                      {notification.ceremony}
                    </Tag>
                    <Text type='secondary' style={{ fontSize: "12px" }}>
                      → {notification.sender}
                    </Text>
                    <Text type='secondary' style={{ fontSize: "12px" }}>
                      • {notification.time}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description='No notifications yet' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
      <Card className='notifications-card' variant='borderless' style={{ marginTop: "20px" }}>
        {/* Upcoming Ceremonies Section - can be expanded */}
        <div style={{ marginTop: "24px" }}>
          <Title level={5} style={{ margin: 0, marginBottom: "16px" }}>
            <ScheduleOutlined style={{ marginRight: "8px" }} /> Upcoming Ceremonies
          </Title>
          <Empty description='No upcoming ceremonies scheduled' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </Card>
    </>
  );
}
