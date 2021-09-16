import React, { useState } from 'react';

import { Anchor, Drawer, Button } from 'antd';

const { Link } = Anchor;

function AppHeader() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className="container-fluid">
      <div className="header">
        <div className="logo">
          <i className="fas fa-dice-d20"></i>
          <a href="https://bit.country/">Agents</a>
        </div>
        <div className="mobileHidden">
          <Anchor targetOffset="65">
            <Link href="#agent" title="Agent Form" />
            <Link href="#table" title="Agent Table" />
          </Anchor>
        </div>
        <div className="mobileVisible">
          <Button type="primary" onClick={showDrawer}>
            <i className="fas fa-bars"></i>
          </Button>
          <Drawer
            placement="right"
            closable={false}
            onClose={onClose}
            visible={visible}
          >
            <Anchor targetOffset="65">
              <Link href="#agent" title="Home" />
              <Link href="#table" title="Agent Table" />
            </Anchor>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;