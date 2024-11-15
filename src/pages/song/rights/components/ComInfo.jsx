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
    songList: { info },
    songRightsList: { song_rights },
  } = props;

  return (
    <Card
      bordered={false}
      className={styles.card}
      title="基本資料"
    >
      {
        (song_rights)
          ? (
            <Fragment>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>歌曲編號：<span>{info.song_code}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>系統顯示：<span>{info.song_name}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>原始歌名：<span>{info.song_name_original}</span></p>
                </Col>
              </Row>
              <Row gutter={[8, 8]}>
                <Col xs={24} lg={8}>
                  <p>中文歌名：<span>{info.song_name_zh}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>英文歌名：<span>{info.song_name_en}</span></p>
                </Col>
                <Col xs={24} lg={8}>
                  <p>拼音歌名：<span>{info.song_name_pingyin}</span></p>
                </Col>
              </Row>
            </Fragment>
          )
          : (null)
      }
    </Card>
  );
}

export default connect(({ songList, songRightsList, loading }) => ({
  songList,
  songRightsList,
}))(ComInfo);