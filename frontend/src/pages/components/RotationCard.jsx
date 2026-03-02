import { Button, Space, Avatar, Typography, Tag } from "antd";
import { UserOutlined, ReloadOutlined, UserSwitchOutlined, SwapOutlined } from "@ant-design/icons";
import "../../css/RotationCard.css";

const { Text } = Typography;

export default function RotationCard({ ceremony, onSkip, onRetain, onReplace }) {
  const isNotSet = ceremony.currentFacilitator === "Not set";

  const getInitials = (name) => {
    if (!name || name === "Not set" || name === "N/A") return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColor = (name) => {
    if (!name || name === "Not set" || name === "N/A") return "#d9d9d9";
    const colors = ["#5B8DEF", "#9B59B6", "#3498DB", "#1ABC9C", "#F39C12"];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getCeremonyColor = (name) => {
    const colorMap = {
      IPM: { bg: "#E8F4FF", color: "#1890FF", tag: "blue" },
      "Daily Standup": { bg: "#E6F7F0", color: "#13C2C2", tag: "cyan" },
      Retrospective: { bg: "#FFF7E6", color: "#FA8C16", tag: "orange" },
    };
    return colorMap[name] || { bg: "#F5F5F5", color: "#595959", tag: "default" };
  };

  const ceremonyStyle = getCeremonyColor(ceremony.ceremonyName);

  // Parse previous facilitators (assuming it's an array or comma-separated)
  const previousFacilitators = Array.isArray(ceremony.previousFacilitator)
    ? ceremony.previousFacilitator
    : ceremony.previousFacilitator
        ?.split(",")
        .map((f) => f.trim())
        .filter(Boolean) || [];

  return (
    <div className='rotation-card'>
      <div className='rotation-card-header'>
        <Tag color={ceremonyStyle.tag} style={{ fontSize: "12px", fontWeight: "500", border: "none" }}>
          {ceremony.ceremonyName}
        </Tag>
        <Text type='secondary' style={{ fontSize: "13px" }}>
          {ceremony.ceremonySchedule || null}
        </Text>
      </div>

      <div className='rotation-card-body'>
        {/* Current Facilitator */}
        <div className='facilitator-section'>
          <Text type='secondary' className='section-label'>
            CURRENT FACILITATOR
          </Text>
          <div className='facilitator-info'>
            <Avatar
              size={56}
              style={{
                backgroundColor: getColor(ceremony.currentFacilitator),
                fontSize: "20px",
                fontWeight: "600",
              }}>
              {getInitials(ceremony.currentFacilitator)}
            </Avatar>
            <div className='facilitator-details'>
              <Text strong style={{ fontSize: "15px", display: "block" }}>
                {ceremony.currentFacilitator}
              </Text>
              <Text type='secondary' style={{ fontSize: "13px" }}>
                {ceremony.currentFacilitatorEmail || "email@company.com"}
              </Text>
            </div>
          </div>
        </div>

        {/* Next in Rotation */}
        <div className='facilitator-section'>
          <Text type='secondary' className='section-label'>
            NEXT IN ROTATION
          </Text>
          <div className='facilitator-row'>
            <Avatar size={40} style={{ backgroundColor: getColor(ceremony.nextFacilitator) }}>
              {getInitials(ceremony.nextFacilitator)}
            </Avatar>
            <Text style={{ fontSize: "14px", marginLeft: "12px" }}>{ceremony.nextFacilitator}</Text>
          </div>
        </div>

        {/* Previous */}
        <div className='facilitator-section'>
          <Text type='secondary' className='section-label'>
            PREVIOUS
          </Text>
          <Avatar.Group max={{ count: 3 }} size={40}>
            {previousFacilitators.length > 0 ? (
              previousFacilitators.map((facilitator, index) => (
                <Avatar key={index} style={{ backgroundColor: getColor(facilitator) }}>
                  {getInitials(facilitator)}
                </Avatar>
              ))
            ) : (
              <Avatar style={{ backgroundColor: getColor(ceremony.previousFacilitator) }}>
                {getInitials(ceremony.previousFacilitator)}
              </Avatar>
            )}
          </Avatar.Group>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='rotation-card-actions'>
        <Button
          block
          icon={<ReloadOutlined />}
          onClick={onRetain}
          disabled={isNotSet}
          className='action-btn'>
          Retain
        </Button>
        <Button block icon={<SwapOutlined />} onClick={onSkip} disabled={isNotSet} className='action-btn'>
          Skip
        </Button>
        <Button block icon={<UserSwitchOutlined />} onClick={onReplace} className='action-btn'>
          Assign
        </Button>
      </div>
    </div>
  );
}
