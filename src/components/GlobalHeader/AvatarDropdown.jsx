import { useState, Fragment } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import commFn from '@/fn/comm';
import ComModal from './components/ComModal';

export const AvatarDropdown = props => {
  const {
    isPath,
    initUserData
  } = props;
  // for Modal
  const [modalVisible, setModalVisible] = useState(false);

  const onMenuClick = event => {
    const { key } = event;

    switch (key) {
      case 'account':
        history.push('/account');
        break;
      case 'settle':
        showModal();
        break;
      case 'logout':
        // sessionStorage
        sessionStorage.removeItem('song_base');
        sessionStorage.removeItem('contract_song_basic');
        sessionStorage.removeItem('contract_author_base');
        sessionStorage.removeItem('isrc_base');
        sessionStorage.removeItem('album_base');
        sessionStorage.removeItem('souvenir_base');
        sessionStorage.removeItem('misc_base');
        sessionStorage.removeItem('karaoke_base');
        sessionStorage.removeItem('information_author_base');
        sessionStorage.removeItem('information_company_base');
        sessionStorage.removeItem('new_media_index');
        sessionStorage.removeItem('list_use_type_index');
        sessionStorage.removeItem('settle_right_newmedia_index');
        sessionStorage.removeItem('settle_record_newmedia_index');
        sessionStorage.removeItem('settle_record_newmedia_apple');
        commFn.logout();
        break;
    }
  };

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="account">
        會員專區
      </Menu.Item>
      {
        (initUserData && initUserData.platform_id && initUserData.platform_id == '1')
        && (
          <Menu.Item key="settle">
            切換結算企業
          </Menu.Item>
        )
      }
      <Menu.Item key="logout">
        <LogoutOutlined />
        登出
      </Menu.Item>
    </Menu>
  );

  // modal show
  const showModal = () => {
    setModalVisible(true);
  }

  // modal (add or edit) - hide
  const hideModal = () => {
    setModalVisible(false);
  }

  // handleSubmit
  const handleSubmit = (obj) => {
    localStorage.agent_eid = (obj && obj.agent_eid) ? obj.agent_eid : '';
    window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${commFn.randomNum()}/#${isPath}`;
  }

  return initUserData && initUserData.user_name ? (
    <Fragment>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            icon={<UserOutlined />}
            alt="avatar" />
          <span className={styles.name}>{initUserData.user_name}</span>
        </span>
      </HeaderDropdown>
      <ComModal
        visible={modalVisible}
        onCancel={hideModal}
        onSubmit={handleSubmit}
        orgList={[]}
      />
    </Fragment>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
}

export default connect(({ authList }) => ({
  initUserData: authList.initUserData,
}))(AvatarDropdown);
