import React, { useState, useEffect, useCallback } from "react";
import "./styles.css";

function App() {
  const [notifications, setNotifications] = useState([]);
  const [time, setTime] = useState(1);
  const [weights, setWeights] = useState(["status", "priority", "time"]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const sortNotifications = useCallback(
    (notifications) => {
      return [...notifications].sort((a, b) => {
        for (const weight of weights) {
          if (a[weight] !== b[weight]) {
            return a[weight] - b[weight];
          }
        }
        return 0;
      });
    },
    [weights]
  );

  const initializeNotifications = useCallback(() => {
    if (!isInitialized) {
      const initialNotifications = Array.from({ length: 3 }, (_, i) => ({
        id: i,
        status: Math.floor(Math.random() * 4) + 1,
        priority: Math.floor(Math.random() * 3) + 1,
        time: i + 1
      }));
      setTime(4);
      setNotifications(sortNotifications(initialNotifications));
      setIsInitialized(true);
    }
  }, [isInitialized, sortNotifications]);

  useEffect(() => {
    initializeNotifications();
  }, [initializeNotifications]);

  useEffect(() => {
    setNotifications((prevNotifications) =>
      sortNotifications(prevNotifications)
    );
  }, [sortNotifications]);

  const addNotification = () => {
    const newNotification = {
      id: notifications.length,
      status: 1,
      priority: Math.floor(Math.random() * 3) + 1,
      time: time
    };
    setTime(time + 1);
    setNotifications(sortNotifications([...notifications, newNotification]));
  };

  const updateStatus = (id) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) {
        return { ...notification, status: 2 };
      }
      return notification;
    });
    setNotifications(sortNotifications(updatedNotifications));
  };

  const swapBoxes = (weight) => {
    if (selectedBox === null) {
      setSelectedBox(weight);
    } else {
      const newWeights = [...weights];
      const index1 = weights.indexOf(selectedBox);
      const index2 = weights.indexOf(weight);
      [newWeights[index1], newWeights[index2]] = [
        newWeights[index2],
        newWeights[index1]
      ];
      setWeights(newWeights);
      setSelectedBox(null);
    }
  };

  const resetNotifications = () => {
    setIsInitialized(false);
    initializeNotifications();
  };

  return (
    <div className="App">
      <div className="main-content">
        <div className="control-panel">
          <div className="header">
            <h1> Sorting Sandbox </h1>
          </div>
          <div className="notification-controls">
            <button onClick={addNotification}>Add Notification</button>
            <button onClick={resetNotifications}>Reset</button>
          </div>
          <div className="weight-controls">
            <div>
              <p> Adjust Weight Order:</p>
            </div>
            {weights.map((weight, index) => (
              <div
                className="weight-box"
                key={index}
                style={selectedBox === weight ? { borderColor: "red" } : {}}
                onClick={() => swapBoxes(weight)}
              >
                {weight}
              </div>
            ))}
          </div>
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div className="notification-card" key={notification.id}>
              <p>Status: {notification.status}</p>
              <p>Priority: {notification.priority}</p>
              <p>Time: {notification.time}</p>
              {notification.status === 1 && (
                <button onClick={() => updateStatus(notification.id)}>
                  Change Status to 2
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
