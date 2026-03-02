/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import {useEffect, useState} from "react";
import {Card, Col, message, Row, Typography} from "antd";
import {AuditOutlined, CalendarOutlined, ClockCircleOutlined} from "@ant-design/icons";
import {api} from "../services/api";
import RotationCard from "./components/RotationCard";
import AssignModal from "./components/AssignModal";
import TeamRoster from "./components/TeamRoster";
import MeetingRooms from "./components/MeetingRooms";
import RecentNotifications from "./components/RecentNotifications";
import calculateIteration from "./CalculateIteration";
import "../css/Dashboard.css";

const {Title, Text} = Typography;

export default function Dashboard() {
    const [dashboard, setDashboard] = useState([]);
    const [members, setMembers] = useState([]);
    const [assignModal, setAssignModal] = useState({visible: false, ceremonyId: null});
    const [currentIteration] = useState(() => calculateIteration());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [dashRes, membersRes] = await Promise.all([api.getDashboard(), api.getMembers()]);
            setDashboard(dashRes.data);
            setMembers(membersRes.data);
        } catch (error) {
            message.error("Failed to load data");
        }
    };

    const handleSkip = async (ceremonyId) => {
        try {
            await api.skipToNext(ceremonyId);
            message.success("Skipped to next facilitator");
            loadData();
        } catch (error) {
            message.error("Failed to skip");
        }
    };

    const handleRetain = async (ceremonyId) => {
        try {
            message.success("Facilitator retained");
            loadData();
        } catch (error) {
            message.error("Failed to retain");
        }
    };

    const handleAssign = async (ceremonyId, memberId) => {
        try {
            await api.assignFacilitator(ceremonyId, memberId);
            message.success("Facilitator assigned");
            setAssignModal({visible: false, ceremonyId: null});
            loadData();
        } catch (error) {
            message.error(error.response?.data || "Failed to assign");
        }
    };

    return (
        <div className='dashboard-container'>
            {/* Header */}
            <div className='dashboard-header'>
                <div className='header-logo'>
                    <div className='logo-icon'>
                        <AuditOutlined/>
                    </div>
                    <div>
                        <Title level={4} style={{margin: 0, fontWeight: 600}}>
                            FaciMate
                        </Title>
                        <Text type='secondary' style={{fontSize: "14px"}}>
                            Ceremony & Rotation Management
                        </Text>
                    </div>
                </div>
            </div>

            <div className='dashboard-content'>
                {/* Current Iteration Card */}
                <Card className='iteration-card' variant='borderless'>
                    <div className='iteration-card-content'>
                        <div className='iteration-left'>
                            <Text type='secondary' className='iteration-label'>
                                CURRENT ITERATION
                            </Text>
                            <Title level={1} style={{margin: "8px 0 0 0", fontWeight: 700}}>
                                {currentIteration.number}th Sprint
                            </Title>
                        </div>
                        <div className='iteration-right'>
                            <div className='iteration-detail-item'>
                                <CalendarOutlined className='iteration-icon'/>
                                <div>
                                    <Text type='secondary' className='iteration-detail-label'>
                                        Duration
                                    </Text>
                                    <Text strong className='iteration-detail-value'>
                                        {currentIteration.startDate} – {currentIteration.endDate}
                                    </Text>
                                </div>
                            </div>
                            <div className='iteration-detail-item'>
                                <ClockCircleOutlined className='iteration-icon'/>
                                <div>
                                    <Text type='secondary' className='iteration-detail-label'>
                                        Days Remaining
                                    </Text>
                                    <Text strong className='iteration-detail-value'>
                                        {currentIteration.status}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Facilitators Section */}
                <Title level={4} style={{marginTop: "10px", marginBottom: "10px", fontWeight: 650}}>
                    Facilitators
                </Title>
                <div>
                    <Row gutter={[24, 24]}>
                        {dashboard.map((ceremony) => (
                            <Col xs={24} sm={24} md={8} key={ceremony.ceremonyId}>
                                <RotationCard
                                    ceremony={ceremony}
                                    onSkip={() => handleSkip(ceremony.ceremonyId)}
                                    onRetain={() => handleRetain(ceremony.ceremonyId)}
                                    onReplace={() => setAssignModal({visible: true, ceremonyId: ceremony.ceremonyId})}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Bottom Section */}
                <Row gutter={[24, 24]} style={{marginTop: "24px"}}>
                    {/* Left Column - Notifications */}
                    <Col xs={24} lg={14}>
                        <RecentNotifications/>
                    </Col>

                    {/* Right Column - Meeting Rooms & Team Roster */}
                    <Col xs={24} lg={10}>
                        <MeetingRooms/>
                        <TeamRoster members={members} onRefresh={loadData}/>
                    </Col>
                </Row>

                <AssignModal
                    visible={assignModal.visible}
                    ceremonyId={assignModal.ceremonyId}
                    members={members.filter((m) => m.isActive)}
                    onAssign={handleAssign}
                    onCancel={() => setAssignModal({visible: false, ceremonyId: null})}
                />
            </div>
        </div>
    );
}