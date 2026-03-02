import React from "react";
import {ConfigProvider} from "antd";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#667eea",
                    borderRadius: 6,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                },
                components: {
                    Button: {
                        controlHeight: 36,
                        borderRadius: 6,
                    },
                    Card: {
                        borderRadiusLG: 8,
                    },
                },
            }}>
            <Dashboard/>
        </ConfigProvider>
    );
}

export default App;
