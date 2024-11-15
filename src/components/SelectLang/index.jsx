import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = props => {
  const { className } = props;
  const [lang, setLang] = useState('zh-tw');
  const locales = ['en-us', 'zh-tw', 'zh-cn', 'jp'];
  const languageLabels = {
    'en-us': 'English',
    'zh-tw': '繁体中文',
    'zh-cn': '简体中文',
    'jp': '日文',
  };

  const getLang = () => {
    setLang(localStorage['bin-lang']);
  }

  const changeLang = ({ item, key, keyPath, domEvent }) => {
    localStorage['bin-lang'] = key;
    window.location.reload();
  }

  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[lang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  // mount
  useEffect(() => {
    getLang();
  }, []);

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <GlobalOutlined title="语言" />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
