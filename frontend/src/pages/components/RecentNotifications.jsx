import {Card, Empty, Spin, Typography} from "antd";
import {BellOutlined, MessageOutlined, ScheduleOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {api} from "../../services/api";
import "../../css/RecentNotifications.css";

const {Title, Text} = Typography;

export default function RecentNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
        // Auto-refresh notifications every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.getRecentNotifications();
            setNotifications(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to load notifications");
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (sentAt) => {
        if (!sentAt) return "recently";
        const date = new Date(sentAt);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getIcon = () => {
        return <MessageOutlined/>;
    };

    return (
        <>
            <Card className='notifications-card' variant='borderless'>
                <Title level={5} style={{margin: 0, marginBottom: "16px", display: "flex", alignItems: "center"}}>
                    <BellOutlined style={{marginRight: "8px"}}/>
                    Recent Notifications
                </Title>

                {loading ? (
                    <div style={{textAlign: "center", padding: "20px"}}>
                        <Spin/>
                    </div>
                ) : error ? (
                    <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                ) : notifications.length > 0 ? (
                    <div className='notifications-list'>
                        {notifications.slice(0, 3).map((notification) => (
                            <div key={notification.id} className='notification-item'>
                                <div className='notification-icon'>{getIcon()}</div>
                                <div className='notification-content'>
                                    <Text style={{fontSize: "14px", display: "block", marginBottom: "8px", whiteSpace: "pre-line"}}>
                                        {notification.message}
                                    </Text>
                                    <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
                                        <Text type='secondary' style={{fontSize: "12px"}}>
                                            → {notification.memberName}
                                        </Text>
                                        <Text type='secondary' style={{fontSize: "12px"}}>
                                            • {formatTime(notification.sentAt)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description='No notifications yet' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                )}
            </Card>
            <Card className='notifications-card' variant='borderless' style={{marginTop: "20px"}}>
                {/* Upcoming Ceremonies Section - can be expanded */}
                <div style={{marginTop: "24px"}}>
                    <Title level={5} style={{margin: 0, marginBottom: "16px"}}>
                        <ScheduleOutlined style={{marginRight: "8px"}}/> Upcoming Ceremonies
                    </Title>
                    <Empty description='No upcoming ceremonies scheduled' image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                </div>
            </Card>
        </>
    );
}
