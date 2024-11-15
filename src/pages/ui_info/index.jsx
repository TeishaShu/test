import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import projectInfo from '@/fn/projectInfo.json';
import commFn from '@/fn/comm';

const uiInfo = props => {
  const [newVersion, setNewVersion] = useState('');
  // api -----
  // getData
  const getData = () => {
    fetch(`${REACT_APP_PUBLIC_PATH}/projectInfo.json?t=${commFn.randomNum()}`)
      .then(res => res.json())
      .then(jsonData => {
        setNewVersion(jsonData.version ? jsonData.version : '');
      }).catch(err => { });
  }

  // mount
  useEffect(() => {
    getData();
  }, []);

  return (
    <PageHeaderWrapper
      title="UI Info"
    >
      <Card bordered={false}>
        <p>UI Version: {projectInfo.version}</p>
        <p>New UI Version: {newVersion}</p>
        <Button
          type="primary"
          onClick={() => {
            window.location.href = `${REACT_APP_PUBLIC_PATH}/?t=${commFn.randomNum()}/#${props.location.pathname}`;
          }}
        >Upgrade</Button>
      </Card>
    </PageHeaderWrapper>
  );
}

export default uiInfo;