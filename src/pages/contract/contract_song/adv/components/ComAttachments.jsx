import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import styles from '@/style/style.less';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // const i = Math.floor(Math.log(bytes * 1024) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  // return `${parseFloat((bytes * 1024 / k ** i).toFixed(dm))  } ${  sizes[i]}`;
}

const ComAttachments = props => {
  const {
    info,
  } = props;

  const fileCheck = () => {
    if (info.file.length) {
      return (
        <Card
          bordered={false}
          className={`${styles.card} ${styles.titleNoBBd}`}
          title="附件"
        >
          <Row gutter={[8, 0]}>
            <Col xs={24}>
              {info.file.map((elem) => {
                return <Button key={elem.id} style={{ marginRight: '5px' }} icon={<DownloadOutlined />}>
                  <a
                    href={`${window.FRONTEND_WEB}/contract_song/download_file?file_id=${elem.id}`}
                    target="_blank"
                    className={styles.om_sp_m_lb}
                  >
                    <span style={{ color: '#40a9ff' }}>{elem.orig_name}</span> ({formatBytes(elem.size)})</a>
                </Button>
              })}
            </Col>
          </Row>
        </Card>
      )
    }
    return undefined;
  }

  return (
    <Fragment>
      {
        fileCheck()
      }
    </Fragment>
  );
}

export default ComAttachments;
