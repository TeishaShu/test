import React, { Fragment } from 'react';
import {
  Row,
  Col,
  Card,
} from 'antd';
import { connect } from 'umi';
import styles from '@/style/style.less';

export const ComInfo = props => {
  const {
    albumList: { info },
  } = props;

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="基本資料"
    >
      {
        (info)
          ? (
            <Fragment>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>專輯編號：<span>{info.album_code}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>專輯名稱：<span>{info.album_name_zh}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>發行日期：<span>{info.publish_date}</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>演唱人：<span>{info.author}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>曲數：<span>{info.song_count}</span></p>
                </Col>
              </Row>
            </Fragment>
          )
          : (null)
      }
    </Card>
  );
}

export default connect(({ albumList, loading }) => ({
  albumList,
}))(ComInfo);